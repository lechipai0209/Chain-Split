use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
#[instruction(nonce: [u8; 5])]
pub struct CreateGroup<'info> {
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 1304,
        seeds = [
            b"group", 
            &nonce[..],       
        ],
        bump
    )]
    pub group: Account<'info, GroupAccount>,

    pub system_program: Program<'info, System>,
}


pub fn create_group_handler(
    ctx: Context<CreateGroup>, 
    nonce: [u8; 5],
) -> Result<()> {
    let group_account = &mut ctx.accounts.group;
    let payer_account = &mut ctx.accounts.payer;

    group_account.payer = payer_account.key();

    for i in 0..20 {
        group_account.member[i] = Pubkey::default();
        group_account.net[i] = 0;
    }

    group_account.member[0] = payer_account.key();

    emit!(GroupCreatedEvent {
        group: group_account.key().to_string(),
        signer: payer_account.key().to_string(),
        account: group_account.key().to_string(),
        action: "create the group".to_string(),
    });

    Ok(())
}

#[event]
pub struct GroupCreatedEvent {
    pub group: String,
    pub signer: String,
    pub account: String,
    pub action: String,
}

#[error_code]
pub enum ErrorCode {
    InvalidNonce,
}