mod anchor::prelude::*;
mod crate::state::*;


#[derive(Accounts)]
pub struct CreateGroup<'info> {
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 520,
        seeds = [b"group".as_ref(), payer.key().as_ref()],
        bump
    )]
    pub group: Account<'info, GroupAccount>,

    pub system_program: Program<'info, System>,
}


pub fn handler(ctx: Context<CreateGroup>, onchain_payment_enabled: bool) -> Result<()> {
    let group = &mut ctx.accounts.group;
    group.payer = ctx.accounts.payer.key();
    Ok(())
}

