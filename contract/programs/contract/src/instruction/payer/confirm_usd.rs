use use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct ConfirmUsd<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payment: Account<'info, PaymentAccount>,

}

pub fn handler(ctx: Context<ConfirmUsd>) -> Result<()> {
    
    let payment_account = &mut ctx.accounts.payment;
    let signer_account = &mut ctx.accounts.signer;

    require!(
        payment_account.recipient == signer_account.key(), 
        ErrorCode::Unauthorized
    ) ;

    payment_account.verified = true;

    emit!(PaymentConfirmedEvent {
        group: payer_account.group ,
        payer: payment_account.payer,
        recipient: signer_account.key(),
        amount: payment_account.amount,
        action: "confirm the payment".to_string(),
    });
    
    Ok(())

}

#[err_code]
pub enum ErrorCode {
    #[msg("Not the recipient of the payment")]
    Unauthorized,
}

#[event]
pub struct PaymentConfirmedEvent {
    pub group: Pubkey,
    pub payer: Pubkey,
    pub recipient: Pubkey,
    pub amount: u32,
    pub action: String,
}


