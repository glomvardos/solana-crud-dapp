use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateJournalEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds=[signer.key().as_ref(), title.as_bytes()], bump, realloc = ANCHOR_DISCRIMINATOR_SIZE + JournalEntryState::INIT_SPACE, realloc::payer=signer, realloc::zero = true )]
    journal: Account<'info, JournalEntryState>,

    pub system_program: Program<'info, System>,
}

pub fn update_journal_entry(ctx: Context<UpdateJournalEntry>, message: String) -> Result<()> {
    ctx.accounts.journal.message = message;
    Ok(())
}
