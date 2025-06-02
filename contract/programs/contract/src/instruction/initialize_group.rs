use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitialGroup<'info> {
    #[account(init, payer=host, space=8 + 32 + 64 + 8 + 8)]
    pub group_account: Account<'info, GroupAccount> ,

    #[account(mut)]
    pub host: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler (ctx: Context<InitialGroup>, name: [u8; 64]) -> Result<()> {
        let group = &mut ctx.accounts.group_account ;
        group.name = name ;
        let group.host = ctx.accounts.host ;
        group.member_count = 0 ;
        group.expense_count = 0 ;
        Ok(())
}

