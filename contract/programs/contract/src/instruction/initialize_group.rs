use anchor_lang::prelude::*;
use crate::state::*;

/**
pub strcut GroupAccount{
    pub payer: Pubkey,
    pub name: [u8, 64],
    pub member_count: u8,  
    pub expense_count: u64,
    pub currency: Currency,
    pub onchain_payment_enabled: bool,
    pub balance_check_enabled: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CurrencyType {
    TWD,
    USD,
}

*/


#[derive(Accounts)]
pub struct InitialGroup<'info> {
    #[account(init, payer=payer, space=8 + 32 + 64 + 8 + 8 + 1 + 1 + 1 + 8)] //儲備8bytes
    pub group_account: Account<'info, GroupAccount> ,

    #[account(mut)] //創建人
    pub payer: Signer<'info>,

    #[account(
        init, 
        seeds=[b"member", group_account.key().as_ref(), payer.key().as_ref()], 
        bump, 
        payer=payer, 
        space= 8 + 32 + 32 + 8 + 8 + 8,
    )]
    pub member_account: Account<'info, MemberAccount>,  //創建者自己的member Account
    
    pub system_program: Program<'info, System>,
}

pub fn handler (
    ctx: Context<InitialGroup>, 
    name: [u8; 64], 
    currency: Currency,
    onchain_payment_enabled: bool,
    balance_check_enabled: bool ) -> Result<()> {
        
        // basic info
        let group = &mut ctx.accounts.group_account ;
        group.name = name ;
        let group.payer = ctx.accounts.payer ;
        group.member_count = 0 ;
        group.expense_count = 0 ;

        // currency 
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


        // update creator's memberaccount 
        let member = &mut ctx.accoutns.member_account ;
        member.group = group.key() ;
        member.payer = ctx.accounts.payer.key() ;
        member.pre_paid = 0 ;
        member.net = 0 ;
        group.member_count += 1 ;

        Ok(())
}

