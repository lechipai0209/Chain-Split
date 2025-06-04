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


// #[account]  // 32+20+2+1+1+1*96+8*32+8*12+8*1 + 8 = 520
// pub strcut GroupAccount{ 
//     pub payer: Pubkey,
//     pub name: [u8, 20],
//     pub expense_count: u16, //一般版 70筆最高
//     pub onchain_payment_enabled: bool,
//     pub member_name: [u32; 8],
//     pub member: [Pubkey; 8],
//     pub net: [u32; 8],
//     pub expense: [Pubkey; 1], //一般版 70筆最高
// }