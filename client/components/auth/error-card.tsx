import { getTranslations } from 'next-intl/server'
import { TriangleAlert } from 'lucide-react'

import { CardWrapper } from '@/components/auth/card-wrapper'

export const ErrorCard = async () => {
  const t = await getTranslations('Home')

  return (
    <CardWrapper
      headerLabel={t('error')}
      backButtonHref='/auth/login'
      backButtonLabel={t('backBtn')}
    >
      <div className='w-full flex  justify-center items-center '>
        <TriangleAlert
          name='triangle-alert'
          className='text-destructive'
        />
      </div>
    </CardWrapper>
  )
}
