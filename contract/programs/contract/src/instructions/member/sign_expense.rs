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

    // 順便把結果傳回去
    let end = if expense_account.verified.iter().any(|v| *v == VerifiedType::False) {
        "False".to_string()
    } else if expense_account.verified.iter().any(|v| *v == VerifiedType::None) {
        "None".to_string()
    } else {
        "True".to_string()
    }; 

    
    emit!(ExpenseSignedEvent {
        group: expense_account.group.to_string(),
        signer: signer_account.key().to_string(),
        account: expense_account.key().to_string(),
        verified,
        end: end,
        total_expense,
    });
    
    // 這邊新增一個feature : 如果做到全員同意了，就自動fanailze結算，不需要等使用者手動結算
    if end == "True" || expense_account.finalized == false {

        expense_account.finalized = true;

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

        emit!(AutoFinalizeEvent {
            group: expense_account.group.to_string(),
            account: expense_account.key().to_string(),
            payer: expense_account.payer.to_string(),
            amount: expense_account.amount,
        });
    }


    Ok(())
}

#[event]
pub struct ExpenseSignedEvent {
    pub group: String,
    pub signer: String,
    pub account: String,
    pub verified: bool,
    pub total_expense: u32,
    pub end: String
}

#[event]
pub struct AutoFinalizeEvent {
    pub group: String,
    pub account: String
    pub payer: String,
    pub amount: u32,
}


#[error_code]
pub enum CustomError {
    #[msg("Member not in expense")]
    MemberNotInExpense,
}

// TODO : 這邊應該要稍微該寫一下，end == true 的時候馬上就要去改net了(已加、記得跑起來debug看看)