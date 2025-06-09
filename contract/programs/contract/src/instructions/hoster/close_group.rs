use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct CloseGroup<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        mut, 
        close = signer,
        constraint = group.payer == signer.key() @ ErrorCode::Unauthorized
    )]
    pub group: Account<'info, GroupAccount>,

}


pub fn close_group_handler(ctx: Context<CloseGroup>) -> Result<()> {
    
    let group_account = &mut ctx.accounts.group;
    let signer_account = &mut ctx.accounts.signer;

    let sum : i32 = group_account.net.iter().sum() ;
    require!(sum == 0, ErrorCode::Unsettled);

    Ok(())
}


#[error_code]
pub enum ErrorCode {

    #[msg("Net array doesn't sum to 0")]
    Unsettled,

    #[msg("Not the payer of the group")]
    Unauthorized

}

