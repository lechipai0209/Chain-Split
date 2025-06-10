use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct SignExpense<'info> {
    
    #[account(mut)]
    pub signer: Signer<'info>,


    #[account(mut)]
    pub expense: Account<'info, ExpenseAccount>,
}

pub fn sign_expense_handler(
    ctx: Context<SignExpense>, 
    verified: bool
) -> Result<()> {
    let signer_account = &mut ctx.accounts.signer;
    let expense_account = &mut ctx.accounts.expense;

    // whether this guy envolves into the transaction
    require!(
        expense_account.member.contains(&signer_account.key()), 
        CustomError::MemberNotInExpense
    );

    let mut total_expense = 0 ;

    for i in 0..expense_account.member.len() {
        if expense_account.member[i] == signer_account.key() {
            expense_account.verified[i] = verified;
            total_expense += expense_account.expense[i];
        }
    }// redundent check for preventing same member payment

    emit!(ExpenseSignedEvent {
        signer: signer_account.key().to_string(),
        verified,
        expense_account: expense_account.key().to_string(),
        total_expense,
    });
    

    Ok(())
}

#[event]
pub struct ExpenseSignedEvent {
    pub signer: String,
    pub verified: bool,
    pub expense_account: String,
    pub total_expense: u32,
}


#[error_code]
pub enum CustomError {
    #[msg("Member not in expense")]
    MemberNotInExpense,
}