'use client'

import { Button } from '@/components/ui/button'
import { useSolanaCrudDappProgram } from '@/lib/hooks/use-solana-crud-dapp-program'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { Card } from '../ui/card'
import { Edit2Icon, Trash2Icon } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'

type MutationResult<T> = UseMutationResult<string, Error, T, unknown>

type Journal = { title: string; message: string }
type CreateJournalProps = {
  createJournal: MutationResult<Journal>
}

type JournalProps = {
  updateJournal: MutationResult<Journal>
  deleteJournal: MutationResult<Omit<Journal, 'message'>>
} & Journal

export function CreateJournal({ createJournal }: CreateJournalProps) {
  const [journal, setJournal] = useState({ title: '', message: '' })
  const { publicKey } = useWallet()

  const handleJournalChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setJournal({ ...journal, [event.target.name]: event.target.value })
  }

  const isFormValid = journal.title?.trim() && journal.message?.trim()

  const handleSubmit = () => {
    if (!isFormValid || !publicKey) return
    createJournal.mutate(journal, {
      onSuccess: () => {
        setJournal({ title: '', message: '' })
      },
    })
  }

  return (
    <Card className="flex flex-col max-w-[650px] w-full m-auto p-10 gap-0 mt-20">
      <input
        name="title"
        value={journal.title}
        onChange={handleJournalChange}
        placeholder="Title"
        className="px-4 py-2 border rounded-2xl mb-4"
      />
      <textarea
        name="message"
        value={journal.message}
        rows={4}
        onChange={handleJournalChange}
        placeholder="Message"
        className="px-4 py-2 border rounded-2xl"
      />
      <Button className="mt-10" onClick={handleSubmit} disabled={createJournal.isPending || !isFormValid}>
        Submit
      </Button>
    </Card>
  )
}

export function SolanaCrudDappProgram() {
  const { getProgramAccount, getStateAccounts, createJournal, updateJournal, deleteJournal } =
    useSolanaCrudDappProgram()
  const { data: accounts } = getStateAccounts
  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <CreateJournal createJournal={createJournal} />
      <div className="grid grid-cols-3 gap-5">
        {accounts?.map((pa) => (
          <Journal
            key={pa.account.title}
            title={pa.account.title}
            message={pa.account.message}
            updateJournal={updateJournal}
            deleteJournal={deleteJournal}
          />
        ))}
      </div>
    </div>
  )
}

function Journal({ title, message, updateJournal, deleteJournal }: JournalProps) {
  const [isEdit, setIsEdit] = useState(false)
  const [editedMessage, setEditedMessage] = useState(message)

  const handleUpdate = async () => {
    if (!editedMessage?.trim()) return
    await updateJournal.mutateAsync({ title, message: editedMessage }, { onSuccess: () => setIsEdit(false) })
  }

  return (
    <Card className="p-5 gap-0">
      <div className="flex justify-end gap-3 mb-4">
        <button type="button" onClick={() => setIsEdit((prev) => !prev)}>
          <Edit2Icon size={20} />
        </button>
        <button type="button" onClick={() => deleteJournal.mutate({ title })}>
          <Trash2Icon size={20} />
        </button>
      </div>
      <h2 className="font-medium text-xl text-center">{title}</h2>
      {!isEdit && <p className="text-sm mt-5">{message}</p>}
      {isEdit && (
        <div className="flex flex-col">
          <textarea
            name="message"
            value={editedMessage}
            rows={4}
            onChange={(e) => setEditedMessage(e.target.value)}
            placeholder="Message"
            className="px-4 py-2 mt-5 border rounded-2xl"
          />
          <Button className="mt-5" onClick={handleUpdate} disabled={updateJournal.isPending || !editedMessage?.trim()}>
            Save
          </Button>
        </div>
      )}
    </Card>
  )
}
