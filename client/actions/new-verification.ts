'use server'

import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { getTranslations } from 'next-intl/server'

export const newVerification = async (token: string) => {
  const t = await getTranslations('NewVerification')
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: t('tokenDoesNotExists') }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: t('tokenDoesExpired') }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: t('emailDoesNotExist') }
  }

  await db.user.update({
    where: {
      id: existingUser.id
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email
    }
  })

  await db.verificationToken.delete({
    where: { id: existingToken.id }
  })

  return { success: t('emailVerified') }
}
