use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
#[instruction(nonce: u64)]
pub struct PayWithUsd<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 200,
        seeds = [
            b"payment", 
            &nonce.to_le_bytes()[..7],
        ],
        bump
    )]
    pub payment: Account<'info, PaymentAccount>,

    /// CHECK: No need to vertify, only for log
    pub recipient: AccountInfo<'info>,

    pub group: Account<'info, GroupAccount>,

    pub system_program: Program<'info, System>,
}

pub fn pay_with_usd_handler(
    ctx: Context<PayWithUsd>, 
    amount: u32,
    nonce: u64,
) -> Result<()> {
    let payer_account = &mut ctx.accounts.payer;
    let recipient_account = &mut ctx.accounts.recipient;
    let group_account = &mut ctx.accounts.group;
    let payment_account = &mut ctx.accounts.payment;

    require!(group_account.member.contains(&recipient_account.key()), ErrorCode::Unauthorized);
    require!(group_account.member.contains(&payer_account.key()), ErrorCode::Unauthorized);
    
    payment_account.recipient = recipient_account.key();
    payment_account.amount = amount;
    payment_account.payer = payer_account.key();
    payment_account.group = group_account.key();

    emit!(PaymentCreatedEvent {
        group: group_account.key(),
        payer: payer_account.key(),
        recipient: recipient_account.key(),
        amount: amount,
        action: "create the payment(unverified)".to_string(),
    });

    Ok(())
}


#[error_code]
pub enum ErrorCode {

    #[msg("Member not in group")]
    Unauthorized,
}

#[event]
pub struct PaymentCreatedEvent {
    pub group: Pubkey,
    pub payer: Pubkey,
    pub recipient: Pubkey,
    pub amount: u32,
    pub action: String
}