'use client'

import { ActionTooltip } from '@/components/action-tooltip'
import { useModal } from '@/hooks/store/use-modal-store'
import { ServerWithMembersWithUsers } from '@/types'
import { ChannelType, MemberRole } from '@prisma/client'
import { Plus, Settings } from 'lucide-react'

interface ServerSectionProps {
  label: string
  memberRole?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: ServerWithMembersWithUsers
}

export const ServerSection = ({
  label,
  sectionType,
  channelType,
  memberRole,
  server
}: ServerSectionProps) => {
  const { onOpen } = useModal()

  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
        {label}
      </p>
      {memberRole !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip
          label='Create Channel'
          side='top'
        >
          <button
            onClick={() => onOpen('createChannel', { channelType, server })}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Plus
              name='plus'
              className='h-4 w-4'
            />
          </button>
        </ActionTooltip>
      )}
      {memberRole === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip
          label='Manage Members'
          side='top'
        >
          <button
            onClick={() => onOpen('members', { server })}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Settings
              name='settings'
              className='h-4 w-4'
            />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}
