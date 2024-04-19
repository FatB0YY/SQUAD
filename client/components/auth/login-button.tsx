'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

interface LoginButtonProps {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
}

export const LoginButton = ({
  children,
  asChild,
  mode = 'redirect'
}: LoginButtonProps) => {
  const router = useRouter()
  const activeLocale = useLocale()

  const onClick = () => {
    router.push('/auth/signin')
  }

  if (mode === 'modal') {
    return <span>TODO: Implement modal</span>
  }

  return (
    <span
      onClick={onClick}
      className='cursor-pointer'
    >
      {children}
    </span>
  )
}
