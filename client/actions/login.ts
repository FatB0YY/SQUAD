'use server'

import * as z from 'zod'
import { AuthError } from 'next-auth'
import { getTranslations } from 'next-intl/server'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens'
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)
  const t = await getTranslations('LoginForm.loginErrorSuccessMessages')

  if (!validatedFields.success) {
    return { error: t('invalidFields') }
  }

  const { email, password, twofacode } = validatedFields.data

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

  if (existingUser.isTwoFactorEnable && existingUser.email) {
    if (twofacode) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: t('invalidcode') }
      }

      if (twoFactorToken.token !== twofacode) {
        return { error: t('invalidcode') }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return { error: t('codeexpired') }
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
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
