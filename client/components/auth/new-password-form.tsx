'use client'

import * as z from 'zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import { NewPasswordSchema } from '@/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { newPassword } from '@/actions/new-password'

export const NewPasswordForm = () => {
  const t = useTranslations('NewPasswordForm')

  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError(undefined)
    setSuccess(undefined)

    startTransition(() => {
      // !server actions! - заменить на axios
      newPassword(values, token)
        .then((data) => {
          setError(data?.error)
          setSuccess(data?.success)
        })
        .catch((error) => {
          console.error('Error!!!!!!', error)
        })
    })
  }

  return (
    <CardWrapper
      headerLabel={t('headerLabel')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref={'signin'}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('passwordfield')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='******'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >
            {t('newpasswordbtn')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
