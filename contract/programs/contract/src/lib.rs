pub mod state ;
pub mod instruction ;

use crate::state::* ;
use crate::instruction::* ;
use anchor_lang::prelude::*;

declare_id!("Guq3MeZzkf5CiSK7wFBm7VzKSreSiccjz7kbJpH2boW9");

#[program]
pub mod contract {
    use super::*;

// hoster side
    pub fn create_group(
        ctx: Context<CreateGroup>, 
        group_name: [u8; 32], 
        hoster_name: u128,
        nonce: u64,
    ) -> Result<()> {
        create_group::handler(ctx, group_name, hoster_name, nonce)
    } 

//     pub fn remove_group_member(
//         ctx: Context<RemoveGroupMember>, 
//         member_pubkey: Pubkey,
//     ) -> Result<()> {
//         remove_group_member::handler(ctx, member_pubkey)
//     }

//     pub fn close_group(
//         ctx: Context<CloseGroup>,
//     ) -> Result<()> {
//         close_group::handler(ctx)
//     }

// // member side
//     pub fn join_group(
//         ctx: Context<JoinGroup>, 
//         name: u128,
//     ) -> Result<()> {
//         join_group::handler(ctx, name)
//     }

//     pub fn sign_expense(
//         ctx: Context<SignExpense>,
//     ) -> Result<()> {
//         sign_expense::handler(ctx)
//     }

//     pub fn pay_with_usd(
//         ctx: Context<PayWithUsd>, 
//         amount: u32,
//         nonce: u64
//     ) -> Result<()> {
//         pay_with_usd::handler(ctx, amount)
//     }

//     pub fn pay_with_usdt(
//         ctx: Context<PayWithUsdt>, 
//         amount: u32,
//     ) -> Result<()> {
//         pay_with_usdt::handler(ctx, amount)
//     }

// // payer side
//     pub fn close_expense(
//         ctx: Context<CloseExpense>,
//     ) -> Result<()> {
//         close_expense::handler(ctx)
//     }

//     pub fn confirm_usd(
//         ctx: Context<ConfirmUsd>,
//     ) -> Result<()> {
//         confirm_usd::handler(ctx)
//     }

//     pub fn create_expense(
//         ctx: Context<CreateExpense>, 
//         name: [u8; 32],
//         member: [Pubkey; 20],
//         expense: [u32; 20],
//         amount: u32,
//         nonce: u64
//     ) -> Result<()> {
//         create_expense::handler(ctx, name, member, expense, amount)
//     }

//     pub fn finalize_expense(
//         ctx: Context<FinalizeExpense>,
//     ) -> Result<()> {
//         finalize_expense::handler(ctx)
//     }
    
    
}











