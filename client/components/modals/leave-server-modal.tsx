'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/store/use-modal-store'
import { Button } from '@/components/ui/button'
import { leaveServer } from '@/actions/leave-server'
import { useRouter } from 'next/navigation'
import { FormError } from '../form-error'

export const LeaverServerModal = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)

  const { isOpen, onClose, type, data } = useModal()
  const { server } = data

  const isModalOpen = isOpen && type === 'leaveServer'

  const onClick = () => {
    startTransition(() => {
      leaveServer(server.id)
        .then((data) => {
          if ('error' in data) {
            setError(data.error)
          } else {
            onClose()
            router.refresh()
            router.push('/')
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Leave Server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to leave
            <span className='font-semibold text-indigo-500'>
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button
              disabled={isPending}
              onClick={onClose}
              variant='ghost'
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={onClick}
              variant='primary'
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
        <FormError message={error} />
      </DialogContent>
    </Dialog>
  )
}
