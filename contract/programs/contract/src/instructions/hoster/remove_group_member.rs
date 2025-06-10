use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct RemoveGroupMember<'info> {

    #[account(mut)] // change on-chain data -> charge fee
    pub signer: Signer<'info>,
    
    #[account(mut)]
    pub group: Account<'info, GroupAccount>,
}


pub fn remove_group_member_handler(
    ctx: Context<RemoveGroupMember>, 
    member_pubkey: Pubkey 
) -> Result<()> {
    
    let group_account = &mut ctx.accounts.group;
    let signer_account = &mut ctx.accounts.signer;

    require!(group_account.payer == signer_account.key(), ErrorCode::Unauthorized);
    require!(member_pubkey != Pubkey::default(), ErrorCode::InvalidPubkey);
    require!(member_pubkey != group_account.payer.key(), ErrorCode::CouldNotRemovePayer);

    for i in 0..group_account.member.len() {
        if group_account.member[i] == member_pubkey {
            if group_account.net[i] == 0 {
                group_account.member[i] = Pubkey::default();
                group_account.member_name[i] = 0;

                emit!(GroupMemberRemovedEvent {
                    signer: signer_account.key().to_string(),
                    member: member_pubkey.to_string(),
                    group_account: group_account.key().to_string(),
                    action: "remove the group member".to_string(),
                });
                return Ok(());
            }
            return Err(error!(ErrorCode::Unsettled));
        } 
    }

    Err(error!(ErrorCode::NotMember))
}

#[error_code]
pub enum ErrorCode {

    #[msg("Not authorized")]
    Unauthorized,

    #[msg("Users net balance isn't 0")]
    Unsettled,
    
    
    #[msg("User is not in the group")]
    NotMember,

    #[msg("Empty pubkey")]
    InvalidPubkey,

    #[msg("Could not remove payer")]
    CouldNotRemovePayer,

}

#[event]
pub struct GroupMemberRemovedEvent {
    signer: String,
    member: String,
    group_account: String,
    action: String,
}

