'use client'

import { useState, useTransition } from 'react'

import {
  Check,
  EllipsisVertical,
  Gavel,
  LoaderCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from 'lucide-react'

import { MemberRole } from '@prisma/client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/hooks/store/use-modal-store'
import { ServerWithMembersWithUsers } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { roleChangeMember } from '@/actions/role-change-member'
import { useRouter } from 'next/navigation'
import { kickMember } from '@/actions/kick-member'

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck
      name='shield-check'
      className='h-4 w-4 ml-2 text-indigo-500'
    />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlert
      name='shield-alert'
      className='h-4 w-4 ml-2 text-rose-500'
    />
  )
}

export const MembersModal = () => {
  const [isPending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState('')
  const router = useRouter()

  const { onOpen, isOpen, onClose, type, data } = useModal()
  const { server } = data as { server: ServerWithMembersWithUsers }

  const isModalOpen = isOpen && type === 'members'

  const onKick = (memberId: string) => {
    setLoadingId(memberId)

    startTransition(() => {
      kickMember(memberId, server.id)
        .then((data) => {
          if ('error' in data) {
            // TODO: обработка error
          } else {
            router.refresh()
            onOpen('members', { server: data })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
        .finally(() => {
          setLoadingId('')
        })
    })
  }

  const onRoleChange = (memberId: string, role: MemberRole) => {
    setLoadingId(memberId)

    startTransition(() => {
      roleChangeMember(memberId, role, server.id)
        .then((data) => {
          if ('error' in data) {
            // TODO: обработка error
          } else {
            router.refresh()
            onOpen('members', { server: data })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
        .finally(() => {
          setLoadingId('')
        })
    })
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Manage Members
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6 '>
          {server?.members?.map((member) => (
            <div
              key={member.id}
              className='flex items-center gap-x-2 mb-6'
            >
              <UserAvatar
                src={member.user.image}
                alt={member.user.name}
              />
              <div className='flex flex-col gap-y-1 '>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {member.user.name}
                  {roleIconMap[member.role]}
                </div>
                <p className='text-xs text-zinc-500'>{member.user.email}</p>
              </div>
              {server.userId !== member.userId && loadingId !== member.id && (
                <div className='ml-auto'>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical
                        name='ellipsis-vertical'
                        className='h-4 w-4 text-zinc-500'
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='left'>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='flex items-center'>
                          <ShieldQuestion
                            name='shield-question'
                            className='h-4 w-4 mr-2'
                          />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() =>
                                onRoleChange(member.id, MemberRole.GUEST)
                              }
                            >
                              <Shield
                                name='shield'
                                className='h-4 w-4 mr-2'
                              />
                              Guest
                              {member.role === MemberRole.GUEST && (
                                <Check
                                  name='check'
                                  className='h-4 w-4 ml-auto'
                                />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onRoleChange(member.id, MemberRole.MODERATOR)
                              }
                            >
                              <ShieldCheck
                                name='shield-check'
                                className='h-4 w-4 mr-2'
                              />
                              MODERATOR
                              {member.role === MemberRole.MODERATOR && (
                                <Check
                                  name='check'
                                  className='h-4 w-4 ml-auto'
                                />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel
                          name='gavel'
                          className='h-4 w-4 mr-2'
                        />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <LoaderCircle
                  name='loader-circle'
                  className='animate-spin text-zinc-500 ml-auto w-4 h-4'
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
