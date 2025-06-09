use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct JoinGroup<'info> {

    #[account(mut)] // change on-chain data -> charge fee
    pub signer: Signer<'info>,
    
    #[account(mut)]
    pub group: Account<'info, GroupAccount>,
}


pub fn handler(ctx: Context<JoinGroup>, name: u128 ) -> Result<()> {
    
    let group_account = &mut ctx.accounts.group;
    let signer_account = &mut ctx.accounts.signer;


    for existing in group_account.member.iter() {
        if existing == &signer_account.key() {
            return Err(error!(ErrorCode::AlreadyMember));
        }
    }

    for i in 0..group_account.member.len() {
        if group_account.member[i] == Pubkey::default() {
            group_account.member[i] = signer_account.key();
            group_account.member_name[i] = name;

            emit!(MemberJoinedEvent {
                signer: signer_account.key(),
                group_account: group_account.key(),
                action: "join the group".to_string(),
            });
            
            return Ok(()) ;
        }
    }

    Err(error!(ErrorCode::GroupFull))
}

#[error_code]
pub enum ErrorCode {

    #[msg("This account is already a member of the group.")]
    AlreadyMember,

    #[msg("The group is already full.")]
    GroupFull,
}

#[event]
pub struct MemberJoinedEvent {
    pub signer: Pubkey,
    pub group_account: Pubkey,
    pub action: String,
}

