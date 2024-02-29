'use server'

import * as z from 'zod'

import { signIn, signOut } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getTranslations } from 'next-intl/server'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)
  const t = await getTranslations('LoginForm.loginErrorSuccessMessages')

  if (!validatedFields.success) {
    return { error: t('invalidFields') }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn('credentials', {
      email,
      password,
      // redirectTo: calbackUrl || DEFAULT_LOGIN_REDIRECT
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })

    return { success: t('success') }
  } catch (error) {
    console.error(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            error: t('invalidCredentials')
          }
        }
        default: {
          return { error: t('somethingWentWrong') }
        }
      }
    }

    throw error
  }
}
