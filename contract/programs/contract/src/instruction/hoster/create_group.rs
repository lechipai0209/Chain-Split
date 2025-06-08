use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct CreateGroup<'info> {
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 1304,
        seeds = [
            b"group".as_ref(), 
            payer.key().as_ref(), 
            &nonce.to_le_bytes()
        ],
        bump
    )]
    pub group: Account<'info, GroupAccount>,

    pub system_program: Program<'info, System>,
}


pub fn handler(ctx: Context<CreateGroup>, group_name: [u8; 32], hoster_name: u128) -> Result<()> {
    
    let group_account = &mut ctx.accounts.group;
    let payer_account = &mut ctx.accounts.payer;

    group_account.payer = payer_account.key();
    group_account.name = group_name ;

    for i in 0..20 {
        group_account.member[i] = Pubkey::default();
        group_account.member_name[i] = 0;
        group_account.net[i] = 0;
    }

    group_account.member[0] = payer_account.key();
    group_account.member_name[0] = hoster_name;

    emit!(GroupCreatedEvent {
        signer: payer_account.key(),
        group_account: group_account.key(),
        action: "create the group".to_string(),
    });

    Ok(())
}

#[event]
pub struct GroupCreatedEvent {
    pub signer: Pubkey,
    pub group_account: Pubkey,
    pub action: String,
}
