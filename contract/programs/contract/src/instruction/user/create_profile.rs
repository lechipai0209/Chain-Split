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
pub struct CreateProfile<'info> {

    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 32 + 32 + 50 * 32 + 8 + 1 + 7,
        seeds = [b"Profile".as_ref(), payer.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, ProfileAccount>,

    pub system_program: Program<'info, System>,
}


pub fn handler(ctx: Context<CreateProfile>, name: [u8, 32] ) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    profile.payer = ctx.accounts.payer.key();
    profile.name = name;
    profile.group_count = 0;
    profile.groups = [Pubkey::default(); 50];
    Ok(())
}