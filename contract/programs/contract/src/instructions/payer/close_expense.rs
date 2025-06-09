use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct CloseExpense<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        mut, 
        close = signer,
        constraint = expense.payer == signer.key() @ ErrorCode::Unauthorized
    )]
    pub expense: Account<'info, ExpenseAccount>,

}


pub fn handler(ctx: Context<CloseExpense>) -> Result<()> {
    
    let expense_account = &mut ctx.accounts.expense;
    let signer_account = &mut ctx.accounts.signer;

    require!(
        expense_account.payer == signer_account.key(), 
        ErrorCode::Unauthorized
    ) ;

    emit!(ExpenseClosedEvent {
        signer: signer_account.key(),
        expense_account: expense_account.key(),
        action: "close the expense".to_string(),
    });
    
    Ok(())
}


#[error_code]
pub enum ErrorCode {
    #[msg("Not the payer of the expense")]
    Unauthorized,
}

#[event]
pub struct ExpenseClosedEvent {
    signer: Pubkey,
    expense_account: Pubkey,
    action: String,
}
