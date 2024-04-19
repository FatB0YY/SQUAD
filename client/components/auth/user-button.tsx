import { LogOut, User } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LocalSwitcher } from '@/components/local-switcher'
import { LogoutButton } from '@/components/auth/logout-button'
import { currentUser } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'

export const UserButton = async () => {
  const t = await getTranslations('UserButton')
  const user = await currentUser()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src={user?.image || undefined}
              alt={user?.name || undefined}
            />
            <AvatarFallback className='bg-indigo-500'>
              <User
                name='User'
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
          <LocalSwitcher />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
