#[account]  
pub strcut GroupAccount{ 
    pub payer: Pubkey,
    pub name: [u8, 32],
    pub expense_count: u16, 
    pub onchain_payment_enabled: bool,
    pub member: [Pubkey; 8],
    pub net: [u32; 8],
}


#[event]
pub struct SignExpenseEvent {

    signer: Pubkey,
    payer_txid: String,
    action: Action,
    
}

#[event]
pub struct Expense {
    pub group: Pubkey,
    pub payer: Pubkey,
    pub amount: u32,
    pub description: String,
    pub member: [Pubkey; 8] ;
    pub expense: [u64; 8] ;
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ExpenseData {
    pub group: Pubkey,
    pub payer: Pubkey,
    pub amount: u64,
    pub description: String,
    pub member: [Pubkey; 8] ;
    pub expense: [u64; 8] ;
}