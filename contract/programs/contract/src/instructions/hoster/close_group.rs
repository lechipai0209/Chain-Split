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

    let has_nonzero = group_account.net.iter().any(|&x| x != 0);
    require!(!has_nonzero, ErrorCode::Unsettled);

    emit!(GroupClosedEvent {
        signer: signer_account.key().to_string(),
        group_account: group_account.key().to_string(),
        action: "close the group".to_string(),
    });

    Ok(())
}


#[error_code]
pub enum ErrorCode {

    #[msg("Net array contains non-zero values")]
    Unsettled,

    #[msg("Not the payer of the group")]
    Unauthorized

}

#[event]
pub struct GroupClosedEvent {
    signer: String,
    group_account: String,
    action: String,
}

