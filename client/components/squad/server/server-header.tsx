'use client'

import { VscChevronDown, VscSettingsGear } from 'react-icons/vsc'
import {
  LuUserPlus,
  LuUsers,
  LuPlusCircle,
  LuTrash,
  LuLogOut
} from 'react-icons/lu'

import { MemberRole } from '@prisma/client'
import { ServerWithMembersWithUsers } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/hooks/store/use-modal-store'

interface ServerHeaderProps {
  server: ServerWithMembersWithUsers
  role?: MemberRole
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR
  const isGuest = role === MemberRole.GUEST

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className='focus:outline-none'
        asChild
      >
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg:zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <VscChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { server })}
            className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
          >
            Invite People
            <LuUserPlus className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
            Server Settings
            <VscSettingsGear className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
            Manage Members
            <LuUsers className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
            Create Channel
            <LuPlusCircle className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
            Delete Server
            <LuTrash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
            Leave Server
            <LuLogOut className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
