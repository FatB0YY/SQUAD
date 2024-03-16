import { getTranslations } from 'next-intl/server'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

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
        <ExclamationTriangleIcon className='text-destructive' />
      </div>
    </CardWrapper>
  )
}
