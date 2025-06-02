use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct JoinGroup {
    #[account(mut)]
    group_account: Account<'info, GroupAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(init, seeds=[b"member", group_account.key().as_ref(), user.key().as_ref()], bump, payer=user, space= 8 + 32 + 32 + 8 + 8)]
    pub member_account: Account<'info, MemberAccount>,

    pub system_program: Program<'info, System> ,
    
}


pub handler (ctx: Context<JoinGroup>) -> Result<()> {
    let group = &mut ctx.accounts.group_account ;
    let member = &mut ctx.accoutns.member_account ;

    member.group = group ;
    member.user = ctx.accounts.user.key() ;
    member.pre_paid = 0 ;
    member.net = 0 ;
    
    group.member += 1 ;
    Ok(())
}