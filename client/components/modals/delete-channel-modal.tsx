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
import { useRouter } from 'next/navigation'
import { FormError } from '../form-error'
import { deleteChannel } from '@/actions/delete-channel'

export const DeleteChannelModal = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)

  const { isOpen, onClose, type, data } = useModal()
  const { server, channel } = data

  const isModalOpen = isOpen && type === 'deleteChannel'

  const onClick = () => {
    startTransition(() => {
      deleteChannel(server.id, channel.id)
        .then((data) => {
          if ('error' in data) {
            setError(data.error)
          } else {
            router.refresh()
            router.push(`/servers/${server?.id}`)
            onClose()
            window.location.reload()
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
            Delete Channel
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to do this? <br />
            <span className='font-semibold text-indigo-500'>
              #{channel?.name}
            </span>{' '}
            will be permanently deleted.
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
