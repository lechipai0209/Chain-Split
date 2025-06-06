use mod anchor::prelude::*;
use mod crate::state::*;

#[derive(Accounts)]
pub struct SignExpense<'info> {
    
    // 欠錢的人
    pub signer: Signer<'info>,

    // 田pubkey在event裡面
    pub group: Acccount<'info, GroupAccount>,
}

pub fn handler(
    ctx: Context<SignExpense>, 
    
    expense_data: ExpenseData,
    txid: String,
    payer: Pubkey, 

    action: Action,
) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let signer = &mut ctx.accounts.signer;

    // whether this guyy envolves into the transaction
    require!(group.member.contains(&signer.key()), CustomError::MemberNotInGroup);

    emit!(SignExpenseEvent {
        signer: signer.key(),
        action: action,
        payer_txid: txid,
    });

    Ok(())
}

pub enum Action {
    Accept,
    Reject,
}
