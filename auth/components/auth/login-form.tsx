'use client'

import * as z from 'zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { LoginSchema } from '@/schemas'
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
import { login } from '@/actions/login'

export const LoginForm = () => {
  const t = useTranslations('LoginForm')

  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? t('providerEmailError')
      : ''

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(undefined)
    setSuccess(undefined)

    startTransition(() => {
      // !server actions! - заменить на axios
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset()
            setError(data.error)
          }

          if (data?.success) {
            form.reset()
            setSuccess(data.success)
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          setError(t('loginErrorSuccessMessages.somethingWentWrong'))
        })
    })
  }

  return (
    <CardWrapper
      headerLabel={t('headerLabel')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref={`signup`}
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            {showTwoFactor && (
              <FormField
                control={form.control}
                name='twofacode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('twofactorcode')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='123456'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('emailfield')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='john.doe@example.com'
                          type='email'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('passwordfiled')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='********'
                          type='password'
                        />
                      </FormControl>
                      <Button
                        size='sm'
                        variant='link'
                        asChild
                        className='px-0 font-normal'
                      >
                        <Link href='/auth/reset'>{t('forgotPassword')}</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >
            {showTwoFactor ? t('confirmbtn') : t('submitbtn')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
