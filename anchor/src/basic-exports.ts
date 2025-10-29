// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import IDL from '../target/idl/solana_crud_dapp.json'
import type { SolanaCrudDapp } from '../target/types/solana_crud_dapp'

// Re-export the generated IDL and type
export { SolanaCrudDapp, IDL }

// The programId is imported from the program IDL.
export const SOLANA_CRUD_DAPP_PROGRAM_ID = new PublicKey(IDL.address)

// This is a helper function to get the Basic Anchor program.
export function getBasicProgram(provider: AnchorProvider, address?: PublicKey): Program<SolanaCrudDapp> {
  return new Program({ ...IDL, address: address ? address.toBase58() : IDL.address } as SolanaCrudDapp, provider)
}

// This is a helper function to get the program ID for the Basic program depending on the cluster.
export function getSolanaCrudAppProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Basic program on devnet and testnet.
      return new PublicKey('JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H')
    case 'mainnet-beta':
    default:
      return SOLANA_CRUD_DAPP_PROGRAM_ID
  }
}
