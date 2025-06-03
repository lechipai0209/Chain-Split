use anchor_lang::prelude::*;
use crate::state::*;

/**
#[account]
pub struct MemberAccount {
    pub group: Pubkey,
    pub payer : Pubkey,
    pub pre_paid: u64,
    pub net: i64,
}
*/


#[derive(Accounts)]
pub struct JoinGroup {
    #[account(mut)]
    group_account: Account<'info, GroupAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init, 
        seeds=[b"member", group_account.key().as_ref(), &group_account.member_count.to_le_bytes()], 
        bump, 
        payer=payer, 
        space= 8 + 32 + 32 + 8 + 8 + 8,
    )]
    pub member_account: Account<'info, MemberAccount>, //創建者自己的memberAccount

    pub system_program: Program<'info, System> ,

}


pub handler (ctx: Context<JoinGroup>) -> Result<()> {
    let group = &mut ctx.accounts.group_account ;
    let member = &mut ctx.accoutns.member_account ;

    member.group = group.key() ;
    member.payer = ctx.accounts.payer.key() ;
    member.pre_paid = 0 ;
    member.net = 0 ;
    
    group.member_count += 1 ;
    
    Ok(())
}