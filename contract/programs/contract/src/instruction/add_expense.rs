use anchor_lang::prelude::*;
use anchor_lang::* ;
use crate::state::*;

/** Account Structure
#[account]
pub struct ExpenseAccount {
    pub group: Pubkey,
    pub payer: Pubkey,
    pub amount: u64,
    pub name: [u8; 64],
    pub description: [u8; 128],
    pub is_reversed: bool,
}

*/


#[derive(Accounts)]
pub struct AddExpense<'info> {

    #[account(mut)]
    pub payer: Signer<'info> ,

    #[account(mut)]
    pub group_account: Account<'info, GroupAccount>,
    
    #[account(
        init,
        seeds = [b"expense", group_account.key().as_ref(), &group_account.expense_count.to_le_bytes()],
        bump,
        payer = payer,
        space = 8 + 32 + 32 + 8 + 64 + 128 + 4  + 1,
    )]
    pub expense_account: Account<'info, ExpenseAccount>,

    #[account()]
    pub rent: Sysvar<'info, Rent>,

    pub system_program: Program<'info, System>,
}

pub fn handler (
    ctx: Context<AddExpense>, 
    amount: u64, 
    name: String,
    description: String,
) -> Result<> {

    let expense_account = &mut ctx.accounts.expense_account ;
    let system_program = &mut ctx.accounts.system_program ;
    let group = &mut ctx..accounts.group_account ;
    let payer = &mut ctx.accounts.payer ;

    expense_account.group = group.key() ;
    expense_account.payer = payer.key() ;
    expense_account.amount = amount ;
    expense_account.name = fixed_len_bytes::<64>(&name);
    expense_account.description = fixed_len_bytes::<128>(&description);
    expense_account.is_reversed = false ;
    
    Ok(expense_account.key())

}