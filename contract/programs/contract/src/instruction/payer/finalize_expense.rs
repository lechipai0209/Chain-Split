use mod anchor::prelude::*;
use mod crate::state::*;

#[derive(Accounts)]
pub struct FinalizeExpense<'info> {

    payer: Signer<'info>,

    #[account(mut)]
    group: Account<'info, GroupAccount>,
}

pub fn handler(
    ctx: Context<FinalizeExpense>,
    pubkey: Vec<Pubkey>,
    events: 
    message: 
    transaction:


) -> Result<()> {
    let group = &mut ctx.accounts.group;
    Ok(())
}



