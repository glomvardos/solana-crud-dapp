'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { SolanaCrudDappProgram } from './solana-crud-dapp-ui'

export default function SolanaCrudDappFeature() {
  const { publicKey } = useWallet()

  return publicKey ? (
    <SolanaCrudDappProgram />
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-16">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  )
}
