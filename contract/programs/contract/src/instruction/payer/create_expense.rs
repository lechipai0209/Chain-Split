use mod anchor_lang::prelude::* ;
use mod crate::state::* ;

#[derive(Accounts)]
pub struct CreateExpense<'info> {
    
    // 付錢的倒楣鬼
    pub payer: Signer<'info>,
    
    // 用來確認到底在不在群組裡(不在的話是來亂的)
    pub group: Account<'info, GroupAccount>,
    
}

pub fn handler(
    ctx: Context<CreateExpense>, 
    amount: u64, 
    description: String,
    participants: Vec<Pubkey>,
    expense: Vec<u64>,
) -> Result<()> {
    
    let group = &mut ctx.accounts.group;
    let payer = &mut ctx.accounts.payer;

    require!(
        participants.len() == expense.len(),
        CustomError::ExpenseParticipantsMismatch
    );

    require!(
        expense.iter().sum() == amount,
        CustomError::ExpenseMismatch
    )

    let valid_members : [Pubkey; 8] = group.member ; 
    
    //emit container
    let mut participants_pubkeys: [Pubkey; 8] = [Pubkey::default(); 8];
    let mut expense_data: [u64; 8] = [0; 8];

    for (i, paricipant_pubkey) in participants.iter().enumerate() {

        require!(
            valid_members.contains(paricipant_pubkey),
            CustomError::MemberNotInGroup
        );

        participants_pubkeys[i] = *paricipant_pubkey ;
        expense_data[i] = expense[i] ;
    }
    
    
    require!(
        valid_members.contains(payer.key),
        CustomError::PayerNotInGroup
    );

    emit!(Expense {
        group: group.key(),
        payer: payer.key(),
        amount,
        description,
        participants: participants_pubkeys,
        expense: expense_data,
    });

    Ok(())
}




#[error_code]
pub enum CustomError {

    #[msg("Paricipant number is inconsistent with expense")]
    ExpenseParticipantsMismatch,

    #[msg("Contain member not in group")]
    MemberNotInGroup,

    #[msg("Signer not in group")]
    PayerNotInGroup,

    #[msg("Total expense is not equal to amount")]
    ExpenseMismatch
}