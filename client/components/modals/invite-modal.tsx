'use client'

import { useState, useTransition } from 'react'
import { Check, Copy, RefreshCcw } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/store/use-modal-store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useOrigin } from '@/hooks/use-origin'
import { generateInviteLinkServer } from '@/actions/generate-invite-link-server'
import { FormError } from '@/components/form-error'

export const InviteModal = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>(undefined)

  const { onOpen, isOpen, onClose, type, data } = useModal()
  const origin = useOrigin()
  const { server } = data

  const [copied, setCopied] = useState(false)

  const isModalOpen = isOpen && type === 'invite'
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 500)
  }

  const onNew = () => {
    startTransition(() => {
      generateInviteLinkServer(server.id)
        .then((data) => {
          if ('error' in data) {
            setError(data.error)
          } else {
            onOpen('invite', { server: data })
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
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            Server invite link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              value={inviteUrl}
              disabled={isPending}
              readOnly
            />
            <Button
              onClick={onCopy}
              size='icon'
              disabled={isPending}
            >
              {copied ? (
                <Check
                  name='check'
                  className='w-4 h-4'
                />
              ) : (
                <Copy
                  name='copy'
                  className='w-4 h-4'
                />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            variant='link'
            size='sm'
            className='text-xs text-zinc-500 mt-4'
            disabled={isPending}
          >
            Generate a new link
            <RefreshCcw
              name='refresh-ccw'
              className='w-4 h-4 ml-2'
            />
          </Button>
          <FormError message={error} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
