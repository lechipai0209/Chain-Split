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

#[account]  // 32+20+2+1+1+1*96+8*32+8*12+8*1 + 8 = 520
pub strcut GroupAccount{ 
    pub payer: Pubkey,
    pub name: [u8, 20],
    pub expense_count: u16, //一般版 70筆最高
    pub onchain_payment_enabled: bool,
    pub member: [Pubkey; 8],
    pub net: [u32; 8],
    pub expense: [Pubkey; 1], //一般版 70筆最高
}
*/

#[derive(Accounts)]
pub struct JoinGroup<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        mut
        seeds = [b"Profile".as_ref(), payer.key().as_ref()],
        bump,
    )]
    pub profile: Account<'info, ProfileAccount>,

    #[account(mut)]
    pub group_account:Account<'info, GroupAccount>,
}


pub fn handler(ctx: Context<JoinGroup>, name: [u8, 32]) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let signer = &ctx.accounts.signer;
    let group_account = &mut ctx.accounts.group_account;
    
    // check payer = signer
    require_keys_eq!(profile.payer, signer.key(), CustomError::Unauthorized);

    // check already joined
    let already_joined = group_account
        .member
        .iter()
        .any(|x| x == &signer.key());
        
    // check group full
    let has_group_slot = group_account
        .member
        .iter()
        .any(|m| *m == Pubkey::default());
        
    // check profile full
    let has_profile_slot = profile.group_count < profile.groups.len() as u8;
    
    require!(!already_joined, CustomError::AlreadyJoined);
    require!(has_group_slot, CustomError::GroupFull);
    require!(has_profile_slot, CustomError::GroupListFull);

    if let Some(slot) = group_account.member.iter_mut().find(|m| **m == Pubkey::default()) {
    *slot = signer.key();
    }

    profile.groups[profile.group_count as usize] = group_account.key();
    profile.group_count += 1;


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