use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct RemoveGroupMember<'info> {

    #[account(mut)] // change on-chain data -> charge fee
    pub signer: Signer<'info>,
    
    #[account(mut)]
    pub group: Account<'info, GroupAccount>,
}


pub fn handler(
    ctx: Context<RemoveGroupMember>, 
    member_pubkey: Pubkey 
) -> Result<()> {
    
    let group_account = &mut ctx.accounts.group;
    let signer_account = &mut ctx.accounts.payer;

    require!(group_account.payer == signer_account.key(), ErrorCode::Unauthorized);

    for i in 0..group_account.member.len() {
        if group_account.member[i] == &member_pubkey {
            if group_account.net[i] == 0 {
                group_account.member[i] = Pubkey::default();
                group_account.member_name[i] = 0;

                emit!(GroupMemberRemovedEvent {
                    signer: signer_account.key(),
                    member: member_pubkey,
                    group_account: group_account.key(),
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

}

#[event]
pub struct GroupMemberRemovedEvent {
    signer: Pubkey,
    member: Pubkey,
    group_account: Pubkey,
    action: String,
}

