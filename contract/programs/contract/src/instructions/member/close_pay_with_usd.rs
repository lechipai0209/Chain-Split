use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct ClosePayWithUsd<'info> {

    #[account(mut)] 
    pub signer: Signer<'info>,
    
    #[account(
        mut,
        close = signer,
        constraint = payment.payer == signer.key() @ ErrorCode::Unauthorized
    )]
    pub payment: Account<'info, PaymentAccount>,
}

pub fn close_pay_with_usd_handler(ctx: Context<ClosePayWithUsd>) -> Result<()> {
    
    let payment_account = &mut ctx.accounts.payment;
    let signer_account = &mut ctx.accounts.signer;


    require!(
        payment_account.payer == signer_account.key(), 
        ErrorCode::Unauthorized
    );

    emit!(PaymentClosedEvent {
        group: payment_account.group.to_string(),
        signer: signer_account.key().to_string(),
        account: payment_account.key().to_string(),
        payer: payment_account.payer.to_string(),
        recipient: payment_account.recipient.to_string(),
        amount: payment_account.amount,
        action: "close the payment".to_string(),
        
    })  ;

    Ok(())
}

#[error_code]
pub enum ErrorCode {

    #[msg("Not the payer of the payment")]
    Unauthorized,

}

#[event]
pub struct PaymentClosedEvent {
    pub group: String,
    pub signer: String,
    pub account: String,
    pub payer: String,
    pub recipient: String,
    pub amount: u32,
    pub action: String,
}
