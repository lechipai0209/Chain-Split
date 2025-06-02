pub mod state ;
pub mod instruction ;

use crate::state::* ;
use crate::instruction::* ;
use anchor_lang::prelude::*;

declare_id!("Guq3MeZzkf5CiSK7wFBm7VzKSreSiccjz7kbJpH2boW9");

#[program]
pub mod contract {
    use super::*;
    pub fn initialize_group(
        ctx: Context<InitialGroup>, 
        name: [u8; 64], 
        currency: Currency, 
        onchain_payment_enabled: bool,
        balance_check_enabled: bool) -> Result<()> {

        instruction::initialize_group::handler(
            ctx, 
            name, 
            currency,
            onchain_payment_enabled,
            balance_check_enabled
        ) 
    }

    pub join_group (ctx: Context<JoinGroup>) -> Result<()> {
        instruction::join_group::handler(ctx)
    }




}











