use anchor_lang::prelude::*;
use borsh::{BorshSerialize, BorshDeserialize};

#[account]  
pub struct GroupAccount{ 
    pub payer: Pubkey,          //32
    pub member: [Pubkey; 20],   //32 * 20
    pub net: [i32; 20],         // 4 * 20
}
//total = 32 + 32 * 20 + 4 * 20 + 8  = 760


#[account]
pub struct ExpenseAccount {
    pub group: Pubkey,        //32 
    pub payer: Pubkey,        //32
    pub amount: u32,          //4
    pub member: [Pubkey; 20], // 32 * 20
    pub expense: [u32; 20] ,  // 4 * 20
    pub verified: [VerifiedType; 20], // 1 * 20
    pub finalized: bool,      // 1
}
//total = 32 + 32 + 4 + 32 * 20 + 4 * 20   + 20+  8 = 848

#[account]
pub struct PaymentAccount {
    pub group: Pubkey,    //32 
    pub payer: Pubkey,    //32
    pub recipient: Pubkey,//32
    pub amount: u32,      //4
    pub verified: bool,  //1
}

#[derive(
    BorshSerialize, 
    BorshDeserialize,
    Clone, 
    Copy, 
    Debug, 
    PartialEq, 
    Eq,
)]
pub enum VerifiedType {
    None,
    True,
    False,
} 
