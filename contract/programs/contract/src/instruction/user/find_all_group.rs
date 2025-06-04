pub mod anchor::prelude::*;
pub mod crate::state::*;

/**
#[account]
pub struct Profile {
    pub name: [u8; 32],
    pub payer: Pubkey,
    pub group_count: u8,
    pub groups: [Pubkey; 50] , // 一般版 最多50筆最高
}
*/

#[derive(Accounts)]
pub struct FindAllGroup<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        seeds = [b"Profile".as_ref(), signer.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,
}


pub fn handler(ctx: Context<FindAllGroup>) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let signer = &ctx.accounts.signer;
    let group_account = &mut ctx.accounts.group_account;
    
    require_keys_eq!(profile.payer, signer.key(), CustomError::Unauthorized);

    


    Ok(())
}

#[error_code]
pub enum CustomError {
    #[msg("Signer and Profile are not match.")]
    Unauthorized,

    #[msg("Already in the Group")]
    AlreadyJoined,

    #[msg("Group full!")]
    GroupFull,

    #[msg("Your group list is full!")]
    GroupListFull,
}