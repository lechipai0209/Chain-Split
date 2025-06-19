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

pub fn close_pay_with_usd(ctx: Context<ClosePayWithUsd>) -> Result<()> {
    
    let payment_account = &mut ctx.accounts.payment;
    let signer_account = &mut ctx.accounts.signer;


    require!(
        payment_account.payer == signer_account.key(), 
        ErrorCode::Unauthorized
    );

    emit!(PaymentClosedEvent {
        signer: signer_account.key().to_string(),
        payment_account: payment_account.key().to_string(),
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
    pub signer: String,
    pub payment_account: String,
    pub action: String,
}
