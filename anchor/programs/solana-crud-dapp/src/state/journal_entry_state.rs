use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
    pub owner: Pubkey,
    #[max_len(MAX_LEN_TITLE)]
    pub title: String,
    #[max_len(MAX_LEN_DESCRIPTION)]
    pub message: String,
}

impl JournalEntryState {
    pub fn new(owner: Pubkey, title: String, message: String) -> Self {
        Self {
            owner,
            title,
            message,
        }
    }
}
