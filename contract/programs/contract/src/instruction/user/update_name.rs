pub mod anchor::prelude::*;
pub mod crate::state::*;

/**
#[account]
pub struct ProfileAccount {
    pub name: [u8; 32],
    pub payer: Pubkey,
    pub group_count: u8,
    pub groups: [Pubkey; 50] , // 一般版 最多50筆最高
}
*/

#[derive(Accounts)]
pub struct UpdateName<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        mut
        seeds = [b"Profile".as_ref(), payer.key().as_ref()],
        bump,
    )]
    pub profile: Account<'info, ProfileAccount>,


}


pub fn handler(ctx: Context<UpdateName>, name: [u8, 32]) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    
    require_keys_eq!(profile.payer, ctx.accounts.signer.key(), CustomError::Unauthorized);

    profile.name = name;
    Ok(())
}

#[error_code]
pub enum CustomError {
    
    #[msg("You are not authorized to update this profile.")]
    Unauthorized,
}