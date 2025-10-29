use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteJournalEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, close=signer, seeds=[signer.key().as_ref(), title.as_bytes()], bump)]
    journal: Account<'info, JournalEntryState>,
}

pub fn delete_journal_handler() -> Result<()> {
    Ok(())
}
