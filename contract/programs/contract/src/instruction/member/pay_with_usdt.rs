use anchor_lang::prelude::*;
use anchor_spl::token::{
    Token, 
    TokenAccount, 
    Mint, 
    Transfer, 
    transfer
};

use anchor_spl::associated_token::get_associated_token_address;

#[derive(Accounts)]
pub struct PayWithUsdt<'info> {
    
    pub usdt_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub payer: Signer<'info>,


    // need to be existing
    #[account(
        mut,
        constraint = from_token_account.key() == get_associated_token_address(&payer.key(), &usdt_mint.key()) @ ErrorCode::InvalidFromTokenAccount,
        constraint = from_token_account.mint == usdt_mint.key() @ ErrorCode::InvalidMint,
        constraint = from_token_account.owner == payer.key() @ ErrorCode::InvalidOwner,
    )]
    pub from_token_account: Account<'info, TokenAccount>,

    // CHECK : No need to vertify, only derive ATA
    pub recipient: AccountInfo<'info>,

    #[account(
        mut,
        constraint = to_token_account.key() == get_associated_token_address(&recipient.key(), &usdt_mint.key()) @ ErrorCode::InvalidToTokenAccount,
        constraint = to_token_account.mint == usdt_mint.key() @ ErrorCode::InvalidMint,
        constraint = to_token_account.owner == recipient.key() @ ErrorCode::InvalidOwner,
    )]
    pub to_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    pub group: Account<'info, GroupAccount>,

}

pub fn handler(
    ctx: Context<PayWithUsdt>, 
    amount: u32,
) -> Result<()> {
    let payer_account = &mut ctx.accounts.payer;
    let recipient_account = &mut ctx.accounts.recipient;
    let from_token_account = &mut ctx.accounts.from_token_account;
    let to_token_account = &mut ctx.accounts.to_token_account;
    let payer_account = &mut ctx.accounts.payer;
    let group_account = &mut ctx.accounts.group;
    let cpi_program = ctx.accounts.token_program.to_account_info();

    require!(group_account.member.contains(&recipient_account.key()), ErrorCode::Unauthorized);
    require!(group_account.member.contains(&payer_account.key()), ErrorCode::Unauthorized);
    
    let cpi_accounts = Transfer {
        from: from_token_account.to_account_info(),
        to: to_token_account.to_account_info(),
        authority: payer_account.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    transfer(cpi_ctx, amount)?;

    group_account.net[group_account.member.iter()
    .position(|x| x == &recipient_account.key()).unwrap()] += amount;
    
    group_account.net[group_account.member.iter()
    .position(|x| x == &payer_account.key()).unwrap()] -= amount;

    emit!(PayWithUsdtEvent {
        group: group_account.key(),
        signer: payer_account.key(),
        recipient: recipient_account.key(),
        amount: amount,
        action: "pay with USDT".to_string(),
    });

    Ok(())
}


#[error_code]
pub enum ErrorCode {
    #[msg("Invalid payer token account")]
    InvalidFromTokenAccount,
    
    #[msg("Invalid recipient token account")]
    InvalidToTokenAccount,


    #[msg("USDT token account has Invalid mint")]
    InvalidMint,

    #[msg("USDT token account has Invalid owner")]
    InvalidOwner,

    #[msg("Net array doesn't sum to 0")]
    Unsettled,

    #[msg("Payer or recipient not in group")]
    Unauthorized,
}

#[event]
pub struct PayWithUsdtEvent {
    pub group: Pubkey,
    pub signer: Pubkey,
    pub recipient: Pubkey,
    pub amount: u32,
    pub action: String,
}
