'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const LocalSwitcher = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const localActive = useLocale()

  const onValueChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(`/${nextLocale}`)
    })
  }

  return (
    <Select
      defaultValue={localActive}
      onValueChange={onValueChange}
      disabled={isPending}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Theme' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='ru'>Русский</SelectItem>
        <SelectItem value='en'>English</SelectItem>
      </SelectContent>
    </Select>
  )
}
