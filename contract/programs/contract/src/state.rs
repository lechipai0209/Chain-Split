#[account]  // 357
pub strcut GroupAccount{ 
    pub payer: Pubkey,
    pub name: [u8, 32],
    pub expense_count: u16, //一般版 66筆最高
    pub currency: Currency,
    pub onchain_payment_enabled: bool,
    pub member: [Pubkey; 8],
    pub net: [u32; 8],
    pub expense: [Pubkey; 1], //一般版 66筆最高
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Currency {
    TWD,
    USD,
}



#[account] // 107+8++32+8=150
pub struct ExpenseAccount {
    pub group: Pubkey,  
    pub payer: Pubkey,
    pub amount: u64,
    pub name: [u8; 32],
    pub participants: [u8; 8],
    pub expense: [u32; 10],
    pub signed: [u8; 10],
    pub is_reversed: bool,
}


