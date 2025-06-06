#[account]  
pub strcut GroupAccount{ 
    pub payer: Pubkey,
    pub name: [u8, 32],
    pub expense_count: u16, 
    pub onchain_payment_enabled: bool,
    pub member: [Pubkey; 8],
    pub net: [u32; 8],
}


