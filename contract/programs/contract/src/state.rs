#[account]  
pub strcut GroupAccount{ 
    pub payer: Pubkey,          //32
    pub name: [u8; 32],         //32
    pub member: [Pubkey; 20],   //32 * 20
    pub member_name: [u128; 20],     //16 * 20
    pub net: [i32; 20],         // 4 * 20
}
//total = 32 + 32 + 32 * 20 + 16 * 20 + 4 * 20 + 8 = 1112


#[account]
pub struct ExpenseAccount {
    pub group: Pubkey,        //32 
    pub payer: Pubkey,        //32
    pub amount: u32,          //4
    pub name: [u8; 32],       //32
    pub member: [Pubkey; 20], // 32 * 20
    pub expense: [u32; 20] ,  // 4 * 20
    pub verified: [bool; 20], // 1 * 20
    pub finalized: bool,      // 1
}
//total = 32 + 32 + 4 + 32 + 32 * 20 + 4 * 20   + 20+  8 = 928-80 = 848

#[account]
pub struct PaymentAccount {
    pub group: Pubkey,    //32 
    pub payer: Pubkey,    //32
    pub recipient: Pubkey,//32
    pub amount: u32,      //4
    pub vertified: bool,  //1
}
