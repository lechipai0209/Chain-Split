use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct ConfirmUsd<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payment: Account<'info, PaymentAccount>,

}

pub fn confirm_usd_handler(ctx: Context<ConfirmUsd>) -> Result<()> {
    
    let payment_account = &mut ctx.accounts.payment;
    let signer_account = &mut ctx.accounts.signer;

    require!(
        payment_account.recipient == signer_account.key(), 
        ErrorCode::Unauthorized
    ) ;

    payment_account.verified = true;

    // 這邊要impl group account 的邏輯

    emit!(PaymentConfirmedEvent {
        group: payment_account.group.to_string() ,
        payer: payment_account.payer.to_string(),
        recipient: signer_account.key().to_string(),
        amount: payment_account.amount,
        action: "confirm the payment".to_string(),
    });
    
    Ok(())

}

#[error_code]
pub enum ErrorCode {
    #[msg("Not the recipient of the payment")]
    Unauthorized,
}

#[event]
pub struct PaymentConfirmedEvent {
    pub group: String,
    pub payer: String,
    pub recipient: String,
    pub amount: u32,
    pub action: String,
}


