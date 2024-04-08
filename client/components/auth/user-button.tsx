'use client'

import { LogOut, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LocalSwitcher } from '@/components/local-switcher'
import { LogoutButton } from '@/components/auth/logout-button'

export const UserButton = () => {
  const t = useTranslations('UserButton')
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback className='bg-[#4d8ffd]'>
            <User
              name='user'
              className='text-white'
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-40'
        align='end'
      >
        <LogoutButton>
          <DropdownMenuItem className='cursor-pointer'>
            <LogOut
              name='log-out'
              className='h-4 w-4 mr-2'
            />
            {t('logout')}
          </DropdownMenuItem>
        </LogoutButton>
        <DropdownMenuItem>
          <LocalSwitcher />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
