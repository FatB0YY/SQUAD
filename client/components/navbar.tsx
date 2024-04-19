'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

import { Button } from '@/components/ui/button'
import { UserButton } from '@/components/auth/user-button'

export const Navbar = () => {
  const pathname = usePathname()
  const activeLocale = useLocale()

  return (
    <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-md'>
      <div className='flex gap-x-2'>
        <Button
          asChild
          variant={
            pathname === `/${activeLocale}/server` ? 'default' : 'outline'
          }
        >
          <Link href='/server'>Server</Link>
        </Button>
        <Button
          asChild
          variant={
            pathname === `/${activeLocale}/client` ? 'default' : 'outline'
          }
        >
          <Link href='/client'>Client</Link>
        </Button>
        <Button
          asChild
          variant={
            pathname === `/${activeLocale}/admin` ? 'default' : 'outline'
          }
        >
          <Link href='/admin'>Admin</Link>
        </Button>
        <Button
          asChild
          variant={
            pathname === `/${activeLocale}/servers` ? 'default' : 'outline'
          }
        >
          <Link href='/servers'>Servers</Link>
        </Button>
        <Button
          asChild
          variant={
            pathname === `/${activeLocale}/settings` ? 'default' : 'outline'
          }
        >
          <Link href='/settings'>Settings</Link>
        </Button>
      </div>

      <UserButton />
    </nav>
  )
}
