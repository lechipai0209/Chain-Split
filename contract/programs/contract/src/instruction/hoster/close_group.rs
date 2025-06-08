use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct CloseGroup<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(mut, close = signer)]
    pub group: Account<'info, GroupAccount>,

}


pub fn handler(ctx: Context<CloseGroup>) -> Result<()> {
    
    let group_account = &mut ctx.accounts.group;
    let signer_account = &mut ctx.accounts.signer;

    let sum : u32 = group_account.iter().sum() ;
    require!(sum == 0, ErrorCode::Unsettled);

    Ok(())
}


#[error_code]
pub enum ErrorCode {

    #[msg("Net array doesn't sum to 0")]
    Unsettled,

}

