import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { SolanaCrudDapp } from '../target/types/solana_crud_dapp'

describe('solana_crud_dapp', () => {
  jest.setTimeout(30000)

  const program = anchor.workspace.SolanaCrudDapp as Program<SolanaCrudDapp>
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  let title: string
  const signer = provider.wallet as anchor.Wallet
  let journalPda: anchor.web3.PublicKey
  beforeAll(async () => {
    title = 'The best journal: The return 4'
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [signer.publicKey.toBuffer(), Buffer.from(title)],
      program.programId,
    )
    journalPda = pda
  })

  it('Create journal entry', async () => {
    const tx = await program.methods.createJournal(title, 'My journal message').rpc()
    const journal = await program.account.journalEntryState.fetch(journalPda)
    console.log('Created Journal', journal)
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http://localhost:8899`)
  })

  it('Update journal entry', async () => {
    let journal = await program.account.journalEntryState.fetch(journalPda)
    console.log('Stale journal', journal)
    const tx = await program.methods.updateJournal(title, 'My updated journal message').rpc()
    journal = await program.account.journalEntryState.fetch(journalPda)
    console.log('Updated journal', journal)
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http://localhost:8899`)
  })

  it('Delete journal entry', async () => {
    const tx = await program.methods.deleteJournal(title).rpc()
    const journal = await program.account.journalEntryState.fetch(journalPda).catch(() => null)
    console.log('Closed Journal', journal)
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http://localhost:8899`)
  })
})
