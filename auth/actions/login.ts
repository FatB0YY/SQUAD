'use server'

import * as z from 'zod'
import { AuthError } from 'next-auth'
import { getTranslations } from 'next-intl/server'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log('------ server-actions login ------')

  const validatedFields = LoginSchema.safeParse(values)
  const t = await getTranslations('LoginForm.loginErrorSuccessMessages')

  if (!validatedFields.success) {
    return { error: t('invalidFields') }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: t('emailDoesNotExist') }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: t('confirmationEmailSent') }
  }

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
