use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct CreateAccount<'info> {

    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 1200,
        seeds = [
            b"expense".as_ref(),
            payer.key().as_ref(),
            &nonce.to_le_bytes(),
        ],
        bump
    )]
    pub expense: Account<'info, ExpenseAccount>,

    pub group: Account<'info, GroupAccount>,

    pub system_program: Program<'info, System>,

}


pub fn handler(
    ctx: Context<CreateAccount>, 
    name: [u8; 32],
    member: [Pubkey; 20],
    expense: [u32; 20],
    amount: u32,
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
            )
        }
    }

    expense_account.payer: Pubkey = payer_account.key();
    expense_account.group: Pubkey = group_account.key();
    expense_account.name: [u8; 32] = name;
    expense_account.member: [Pubkey; 20] = member;
    expense_account.expense: [u32; 20] = expense;
    expense_account.amount: u32 = amount;
    expense_account.verified : [bool; 20] = [true; 20];

    for i in 0..verified.len() {
        if member[i] != Pubkey::default() {
            expense_account.verified[i] = false;
        }
    }

    emit!(ExpenseCreatedEvent {
        signer: payer_account.key(),
        expense_account: expense_account.key(),
        action: "create the expense".to_string(),
    });

    Ok(())
}
// 有一個nonce 的problem要確認?

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
    signer: Pubkey,
    expense_account: Pubkey,
    action: String,
}
