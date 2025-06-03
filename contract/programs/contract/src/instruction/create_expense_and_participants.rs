use anchor_lang::prelude::*;
use crate::state::*;

/**
#[account]
pub struct ExpenseAccount {
    pub group: Pubkey,
    pub payer: Pubkey,
    pub amount: u64,
    pub name: [u8; 64],
    pub description: [u8; 128],
    pub participants: Vec<Pubkey>,
    pub is_reversed: bool,
}
*/


#[derive(Accounts)]
#[instruction(participants: Vec<Pubkey>)] 
// #[derive(Accounts)] can only put AccountInfo type
//  normal parameters have to be plunge by this one
pub struct CreateExpenseAndParticipants<'info> {

    #[account(mut)]
    pub payer: Signer<'info> ,

    #[account(mut)]
    pub group_account: Account<'info, GroupAccount>,
    
    #[account(
        init,
        seeds = [b"expense", group_account.key().as_ref(), &group_account.expense_count.to_le_bytes()],
        bump,
        payer = payer,
        space = 8 + 32 + 32 + 8 + 64 + 128 + 4 + 32*30 + 1,
    )]
    pub expense_account: Account<'info, ExpenseAccount>,

    #[account()]
    pub rent: Sysvar<'info, Rent>,

    pub system_program: Program<'info, System>,
}

pub fn handler (
    ctx: Context<CreateExpenseAndParticipants>, 
    participants: Vec<Pubkey>,
    amount: u64, 
    name: String,
    description: String,
) -> Result<()> {

    // deal with expense_account basic info
    let expense_account = &mut ctx.accounts.expense_account ;
    
    expense_account.group = ctx.accounts.group_account.key() ;
    expense_ccount.payer = ctx.accounts.payer.key(),
    expense_ccount.amount = amount ;
    expense.name = fixed_len_bytes::<32>(&name);
    expense.description = fixed_len_bytes::<64>(&description);
    expense_account.is_reversed = false ;

    for(i, participant) in participants.iter().enumerate() {
        let (participant_pda, bump) = Pubkey::find_program_address( // special for pda
            &[b"participant", expense_account.key().as_ref(), participant.as_ref()],
            ctx.program_id,
        ) ; 
    }


    
    
}