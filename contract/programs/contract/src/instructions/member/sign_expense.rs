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
            expense_account.verified[i] = 
                if verified {VerifiedType::True} else {VerifiedType::False};
            total_expense += expense_account.expense[i];
        }
    }// redundent check for preventing same member payment

    let end = if expense_account.verified.iter().any(|v| *v == VerifiedType::False) {
        VerifiedType::False
    } else if expense_account.verified.iter().any(|v| *v == VerifiedType::None) {
        VerifiedType::None
    } else {
        VerifiedType::True
    }; // 順便把結果傳回去

    emit!(ExpenseSignedEvent {
        group: expense_account.group.to_string(),
        signer: signer_account.key().to_string(),
        account: expense_account.key().to_string(),
        verified,
        end: end,
        total_expense,
    });
    
    Ok(())
}

#[event]
pub struct ExpenseSignedEvent {
    pub group: String,
    pub signer: String,
    pub account: String,
    pub verified: bool,
    pub total_expense: u32,
    pub end: VerifiedType
}


#[error_code]
pub enum CustomError {
    #[msg("Member not in expense")]
    MemberNotInExpense,
}

// TODO : 這邊應該要稍微該寫一下，end == true 的時候馬上就要去改net了