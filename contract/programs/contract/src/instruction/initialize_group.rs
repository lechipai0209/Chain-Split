use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitialGroup<'info> {
    #[account(init, payer=host, space=8 + 32 + 64 + 8 + 8 + 1 + 1 + 1 + 8)]
    pub group_account: Account<'info, GroupAccount> ,

    #[account(mut)]
    pub host: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler (
    ctx: Context<InitialGroup>, 
    name: [u8; 64], 
    currency: Currency,
    onchain_payment_enabled: bool,
    balance_check_enabled: bool ) -> Result<()> {
        let group = &mut ctx.accounts.group_account ;
        group.name = name ;
        let group.host = ctx.accounts.host ;
        group.member_count = 0 ;
        group.expense_count = 0 ;
        group.currency = currency ;
        match currency {
            Currency::TWD => {
                group.onchain_payment_enabled = false ;
                group.balance_check_enabled = false ;
            },
            Currency::USD => {
                group.onchain_payment_enabled = onchain_payment_enabled ;
                group.balance_check_enabled = balance_check_enabled ;
            }
        }
        Ok(())
}

