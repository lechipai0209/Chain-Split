pub mod state ;
pub mod instructions ;

use anchor_lang::prelude::*;

use crate::state::* ;
use crate::instructions::hoster::create_group::* ;
use crate::instructions::hoster::close_group::* ;
use crate::instructions::hoster::remove_group_member::* ;

use crate::instructions::member::join_group::* ;
use crate::instructions::member::sign_expense::* ;
use crate::instructions::member::pay_with_usd::* ;
use crate::instructions::member::pay_with_usdt::* ;
use crate::instructions::member::close_pay_with_usd::* ;

use crate::instructions::payer::create_expense::* ;
use crate::instructions::payer::close_expense::* ;
use crate::instructions::payer::confirm_usd::* ;
use crate::instructions::payer::finalize_expense::* ;

declare_id!("EotpYAoc7dokSnzuKosXJ41yMM9Ba9dS1ErQhG4EFHRQ");

#[program]
pub mod contract {
    use super::*;

// hoster side
    pub fn create_group(
        ctx: Context<CreateGroup>, 
        nonce: [u8; 5],
        group_name: [u8; 32], 
        hoster_name: u128,
    ) -> Result<()> {
        
        create_group_handler(ctx, nonce, group_name, hoster_name)
    } 

    pub fn remove_group_member(
        ctx: Context<RemoveGroupMember>, 
        member_pubkey: Pubkey,
    ) -> Result<()> {
        remove_group_member_handler(ctx, member_pubkey)
    }

    pub fn close_group(
        ctx: Context<CloseGroup>,
    ) -> Result<()> {
        close_group_handler(ctx)
    }

// // // member side
    pub fn join_group(
        ctx: Context<JoinGroup>, 
        name: u128,
    ) -> Result<()> {
        join_group_handler(ctx, name)
    }

    pub fn sign_expense(
        ctx: Context<SignExpense>,
        verified: bool
    ) -> Result<()> {
        sign_expense_handler(ctx, verified)
    }

    pub fn pay_with_usd(
        ctx: Context<PayWithUsd>, 
        nonce: [u8; 7],
        amount: u32,
    ) -> Result<()> {
        pay_with_usd_handler(ctx, nonce, amount)
    }

    pub fn pay_with_usdt(
        ctx: Context<PayWithUsdt>, 
        amount: u32,
    ) -> Result<()> {
        pay_with_usdt_handler(ctx, amount)
    }
    
    pub fn close_pay_with_usd(
        ctx: Context<ClosePayWithUsd>,
    ) -> Result<()> {
        close_pay_with_usd_handler(ctx)
    }
    
// // payer side
    pub fn close_expense(
        ctx: Context<CloseExpense>,
    ) -> Result<()> {
        close_expense_handler(ctx)
    }

    pub fn confirm_usd(
        ctx: Context<ConfirmUsd>,
    ) -> Result<()> {
        confirm_usd_handler(ctx)
    }

    pub fn create_expense(
        ctx: Context<CreateExpense>, 
        nonce: [u8; 7],
        name: [u8; 32],
        member: [Pubkey; 20],
        expense: [u32; 20],
        amount: u32,
    ) -> Result<()> {
        create_expense_handler(ctx, nonce, name, member, expense, amount)
    }

    pub fn finalize_expense(
        ctx: Context<FinalizeExpense>,
    ) -> Result<()> {
        finalize_expense_handler(ctx)
    }

    
    
    
}











