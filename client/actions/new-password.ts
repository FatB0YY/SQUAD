'use server'

import * as z from 'zod'
import bcryptjs from 'bcryptjs'
import { getTranslations } from 'next-intl/server'

import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { NewPasswordSchema } from '@/schemas'
import { db } from '@/lib/db'

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  const t = await getTranslations('NewPasswordServerAction')
  if (!token) {
    return { error: t('missingtoken') }
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: t('invalidfields') }
  }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { error: t('invalidtoken') }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: t('tokenhasexpired') }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'emaildoesnotexist' }
  }

  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(password, salt)

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  })

  return { success: t('success') }
}
