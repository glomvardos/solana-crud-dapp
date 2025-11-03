'use client'

import { useCluster } from '@/components/cluster/cluster-data-access'
import { useAnchorProvider } from '@/components/solana/solana-provider'
import { useTransactionToast } from '@/components/use-transaction-toast'
import { getSolanaCrudAppProgram, getSolanaCrudAppProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { toast } from 'sonner'

export function useSolanaCrudDappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolanaCrudAppProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSolanaCrudAppProgram(provider, programId), [provider, programId])
  const { publicKey } = useWallet()
  const queryClient = useQueryClient()

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const getStateAccounts = useQuery({
    queryKey: ['journals', { cluster }],
    queryFn: async () => {
      return await program.account.journalEntryState.all([
        {
          memcmp: {
            offset: 8,
            bytes: publicKey!.toBase58(),
          },
        },
      ])
    },
    enabled: !!program && !!publicKey,
  })

  const createJournal = useMutation({
    mutationKey: ['journal', 'create', { cluster }],
    mutationFn: ({ title, message }: { title: string; message: string }) =>
      program.methods.createJournal(title, message).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      queryClient.invalidateQueries({ queryKey: ['journals', { cluster }] })
    },
    onError: () => {
      toast.error('Failed to run program')
    },
  })

  const updateJournal = useMutation({
    mutationKey: ['journal', 'update', { cluster }],
    mutationFn: ({ title, message }: { title: string; message: string }) =>
      program.methods.updateJournal(title, message).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      queryClient.invalidateQueries({ queryKey: ['journals', { cluster }] })
    },
    onError: () => {
      toast.error('Failed to run program')
    },
  })

  const deleteJournal = useMutation({
    mutationKey: ['journal', 'delete', { cluster }],
    mutationFn: ({ title }: { title: string }) => program.methods.deleteJournal(title).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      queryClient.invalidateQueries({ queryKey: ['journals', { cluster }] })
    },
    onError: () => {
      toast.error('Failed to run program')
    },
  })

  return {
    program,
    programId,
    getProgramAccount,
    createJournal,
    updateJournal,
    deleteJournal,
    getStateAccounts,
  }
}
