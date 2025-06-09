use use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct SignExpense<'info> {
    
    #[account(mut)]
    pub signer: Signer<'info>,


    #[account(mut)]
    pub expense: Account<'info, ExpenseAccount>,
}

pub fn handler(
    ctx: Context<SignExpense>, 
) -> Result<()> {
    let signer_account = &mut ctx.accounts.signer;
    let expense_account = &mut ctx.accounts.expense;

    // whether this guy envolves into the transaction
    require!(
        expense_account.member.contains(&signer_account.key()), 
        CustomError::MemberNotInExpense
    );

    let total_expense = 0 ;

    for i in 0..expense_account.member.len() {
        if expense_account.member[i] == signer_account.key() {
            expense_account.verified[i] = true;
            total_expense += expense_account.expense[i];
        }
    }// redundent check for preventing same member payment

    emit!(ExpenseSignedEvent {
        signer: signer_account.key(),
        expense_account: expense_account.key(),
        total_expense,
    });
    

    Ok(())
}

#[event]
pub struct ExpenseSignedEvent {
    pub signer: Pubkey,
    pub expense_account: Pubkey,
    pub total_expense: u32,
}


#[error_code]
pub enum CustomError {
    #[msg("Member not in expense")]
    MemberNotInExpense,
}