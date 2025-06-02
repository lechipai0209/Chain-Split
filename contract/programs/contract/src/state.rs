#[account]
pub strcut GroupAccount{
    pub host: Pubkey,
    pub name: [u8, 64],
    pub member_count: i64,
    pub expense_count: i64,
}

#[derive[Accounts]]

#[account]
pub struct MemberAccount {
    pub group: Pubkey,
    pub user : Pubkey,
    pub pre_paid: i64,
    pub net: i64,
}
