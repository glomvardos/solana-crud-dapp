use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateJournalEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = ANCHOR_DISCRIMINATOR_SIZE + JournalEntryState::INIT_SPACE, seeds=[signer.key().as_ref(), title.as_bytes()], bump )]
    pub journal: Account<'info, JournalEntryState>,

    pub system_program: Program<'info, System>,
}

pub fn create_journal_handler(
    ctx: Context<CreateJournalEntry>,
    owner: Pubkey,
    title: String,
    message: String,
) -> Result<()> {
    let journal_entry = JournalEntryState::new(owner, title, message);
    ctx.accounts.journal.set_inner(journal_entry);

    Ok(())
}
