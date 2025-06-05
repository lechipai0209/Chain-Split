#[account]  // 32+20+2+1+1+1*96+8*32+8*12+8*1 + 8 = 520
pub strcut GroupAccount{ 
    pub payer: Pubkey,
    pub name: [u8, 20],
    pub expense_count: u16, //一般版 65筆最高
    pub onchain_payment_enabled: bool,
    pub member: [Pubkey; 8],
    pub net: [u32; 8],
    pub expense: [Pubkey; 1], //一般版 65筆最高
}

// 32+32+8+32+32+1+1 + 8 = 146 10000/146= 68
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq)]
pub struct Expense {
    pub group: Pubkey,  
    pub payer: Pubkey,
    pub amount: u64,
    pub name: [u8; 32],
    pub expense: [u32; 8],
    pub signed: u8,
    pub is_canceled: bool,
}

#[account]
pub struct ProfileAccount {
    pub name: [u8; 32],
    pub payer: Pubkey,
    pub groups: [Pubkey; 50] , // 一般版 最多50筆最高
}



#[account]
pub struct  ExpenseAccount {
    pub expense: [Expense; 68],
    pub expense_count: u8,
    pub next_account: Pubkey,
}
