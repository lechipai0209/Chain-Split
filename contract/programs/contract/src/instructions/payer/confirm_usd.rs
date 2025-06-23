use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct ConfirmUsd<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payment: Account<'info, PaymentAccount>,

    #[account(mut)]
    pub group: Account<'info, GroupAccount>,

}

pub fn confirm_usd_handler(ctx: Context<ConfirmUsd>) -> Result<()> {
    
    let payment_account = &mut ctx.accounts.payment;
    let signer_account = &mut ctx.accounts.signer;
    let group_account = &mut ctx.accounts.group;

    require!(
        payment_account.recipient == signer_account.key(), 
        ErrorCode::Unauthorized
    ) ;

    payment_account.verified = true;

    let recipient_index = group_account.member.iter()
        .position(|x| x == &payment_account.recipient).unwrap();
    group_account.net[recipient_index] -= payment_account.amount as i32;

    let payer_index = group_account.member.iter()
        .position(|x| x == &payment_account.payer).unwrap();
    group_account.net[payer_index] += payment_account.amount as i32;

    emit!(PaymentConfirmedEvent {
        group: payment_account.group.to_string() ,
        signer: signer_account.key().to_string(),
        account: payment_account.key().to_string(),
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
    pub signer: String,
    pub account: String,
    pub payer: String,
    pub recipient: String,
    pub amount: u32,
    pub action: String,
}


