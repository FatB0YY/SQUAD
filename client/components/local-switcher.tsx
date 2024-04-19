'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'

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
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        disabled={isPending}
        className='flex'
      >
        <Languages className='w-4 h-4 mr-2' /> Язык
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuCheckboxItem
            checked={localActive === 'ru'}
            onClick={() => onValueChange('ru')}
          >
            Русский
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={localActive === 'en'}
            onClick={() => onValueChange('en')}
          >
            English
          </DropdownMenuCheckboxItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
