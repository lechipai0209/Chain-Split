use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct FinalizeExpense<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(mut)]
    pub expense: Account<'info, ExpenseAccount>,

    #[account(mut)]
    pub group: Account<'info, GroupAccount>,

}


pub fn handler(
    ctx: Context<FinalizeExpense>, 
) -> Result<()> {
    
    let expense_account = &mut ctx.accounts.expense;
    let signer_account = &mut ctx.accounts.signer;
    let group_account = &mut ctx.accounts.group;

    require!(
        expense_account.payer == signer_account.key(), 
        ErrorCode::Unauthorized
    ) ;

    require!(
        expense_account.verified.iter().all(|v| *v),
        ErrorCode::NotAllVerified
    ) ;

    require!(
        expense_account.finalized == false, 
        ErrorCode::AlreadyFinalized
    ) ;

    for (i, member_key) in expense_account.member.iter().enumerate() {
        if member_key == &Pubkey::default() {
            continue;
        }

        // 記錄扣款
        if let Some(group_index) = group_account.member.iter().position(|x| x == member_key) {

            group_account.net[group_index] -= expense_account.expense[i] as i32;
            
            if member_key == &expense_account.payer {
                group_account.net[group_index] += expense_account.amount as i32;
            }    
        }
    }

    expense_account.finalized = true ;

    emit!(ExpenseCreatedEvent {
        signer: signer_account.key(),
        expense_account: expense_account.key(),
        action: "finalize expense".to_string(),
    });

    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not the payer of the expense")]
    Unauthorized,

    #[msg("Not all members verified")]
    NotAllVerified,

    #[msg("Already finalized")]
    AlreadyFinalized
}

#[event]
pub struct ExpenseCreatedEvent {
    signer: Pubkey,
    expense_account: Pubkey,
    action: String,
}
