import { getTranslations } from 'next-intl/server'

import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/auth/login-button'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

export default async function Home() {
  const t = await getTranslations('Home')
  console.log('--------------3--------------')

  const gradientClass =
    'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'

  return (
    <main
      className={cn(
        'flex h-full flex-col items-center justify-center',
        gradientClass
      )}
    >
      <div className='space-y-6 text-center'>
        <h1
          className={cn(
            'text-6xl font-semibold text-white drop-shadow-md',
            font.className
          )}
        >
          🔐
        </h1>
        <p className='text-white text-lg'>{t('text')}</p>

        <div>
          <LoginButton>
            <Button
              variant='secondary'
              size='lg'
            >
              {t('btn')}
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
