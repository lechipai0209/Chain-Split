use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
#[instruction(nonce: [u8; 7])]
pub struct CreateExpense<'info> {

    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 1000,
        seeds = [
            b"expense",
            &[1,2,3,4,5,6,7],
        ],
        bump
    )]
    pub expense: Account<'info, ExpenseAccount>,

    pub group: Account<'info, GroupAccount>,

    pub system_program: Program<'info, System>,

}


pub fn create_expense_handler(
    ctx: Context<CreateExpense>, 
    name: [u8; 32],
    member: [Pubkey; 20],
    expense: [u32; 20],
    amount: u32,
    nonce: [u8; 7],
) -> Result<()> {
    
    let expense_account = &mut ctx.accounts.expense;
    let payer_account = &mut ctx.accounts.payer;
    let group_account = &mut ctx.accounts.group;

    // payer not in group
    require!(
        group_account.member.contains(&payer_account.key()),
        ErrorCode::PayerNotInGroup
    );

    // member not in group
    for m in member.iter() {
        require!(
            group_account.member.contains(m),
            ErrorCode::ExpenseMemberNotInGroup
        );
    }

    // sum doesn't equal to amount
    let sum: u32 = expense.iter().sum();
    require!(
        sum == amount as u32,
        ErrorCode::ExpenseAmountMismatch
    );

    // expense mismatch
    for i in 0..expense.len() {
        if expense[i] > 0 {
            require!(
                group_account.member[i] != Pubkey::default(),
                ErrorCode::NobodyCharged
            ) ;
        }
    }

    expense_account.payer = payer_account.key();
    expense_account.group = group_account.key();
    expense_account.name = name;
    expense_account.member = member;
    expense_account.expense = expense;
    expense_account.amount = amount;
    expense_account.verified = [true; 20];
    expense_account.finalized = false;

    for i in 0..expense_account.verified.len() {
        if member[i] != Pubkey::default() && member[i] != payer_account.key() {
            expense_account.verified[i] = false;
        }
        
    }

    emit!(ExpenseCreatedEvent {
        signer: payer_account.key().to_string(),
        expense_account: expense_account.key().to_string(),
        action: "create the expense".to_string(),
    });

    Ok(())
}


#[error_code]
pub enum ErrorCode {

    #[msg("Payer not in group")]
    PayerNotInGroup,

    #[msg("Expense member not in group")]
    ExpenseMemberNotInGroup,

    #[msg("Expense amount mismatch")]
    ExpenseAmountMismatch,

    #[msg("Nobody charged")]
    NobodyCharged,
}

#[event]
pub struct ExpenseCreatedEvent {
    signer: String,
    expense_account: String,
    action: String,
}
