'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import Image from 'next/image'
import Google from '@/public/google.svg'
import { Github } from 'lucide-react'

export const Social = () => {
  const onClick = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT
      })
    } catch (error) {
      console.error('Error: ', error)
    }
  }

  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size='lg'
        className='w-full'
        variant='outline'
        onClick={() => onClick('google')}
      >
        <Image
          src={Google}
          alt='Google'
        />
      </Button>
      <Button
        size='lg'
        className='w-full'
        variant='outline'
        onClick={() => onClick('github')}
      >
        <Github className='w-6 h-6' />
      </Button>
    </div>
  )
}
