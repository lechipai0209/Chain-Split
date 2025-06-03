#[account]
pub strcut GroupAccount{
    pub payer: Pubkey,
    pub name: [u8, 64],
    pub member_count: u8, // 最多限制50位參加者
    pub expense_count: u64,
    pub currency: Currency,
    pub onchain_payment_enabled: bool,
    pub balance_check_enabled: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CurrencyType {
    TWD,
    USD,
}


#[account]
pub struct MemberAccount {
    pub group: Pubkey,
    pub payer : Pubkey,
    pub pre_paid: u64,
    pub net: i64,
}

#[account]
pub struct ExpenseAccount {
    pub group: Pubkey,
    pub payer: Pubkey,
    pub amount: u64,
    pub name: [u8; 32],
    pub description: [u8; 64],
    pub is_reversed: bool,
}

#[account]
pub struct ExpenseParticient {
    pub expense_account: Pubkey,
    pub participant: Pubkey,
    pub payment: u64,
    pub signed: bool,
}
