use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod state;

use crate::instructions::*;

declare_id!("FhKYycaAKbcFfXFXyzt2giLx2azkJYSvMe84GgSyB9Pv");

#[program]
pub mod solana_crud_dapp {
    use super::*;

    pub fn create_journal(
        ctx: Context<CreateJournalEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let singer_pub_key = ctx.accounts.signer.key();
        create_journal_handler(ctx, singer_pub_key, title, message)
    }

    pub fn update_journal(
        ctx: Context<UpdateJournalEntry>,
        _title: String,
        message: String,
    ) -> Result<()> {
        update_journal_entry(ctx, message)
    }

    pub fn delete_journal(_ctx: Context<DeleteJournalEntry>, _title: String) -> Result<()> {
        delete_journal_handler()
    }
}
