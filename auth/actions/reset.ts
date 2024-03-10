'use server'

import * as z from 'zod'
import { getTranslations } from 'next-intl/server'

import { ResetSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  console.log('------ server-actions reset ------')

  const validatedFields = ResetSchema.safeParse(values)
  const t = await getTranslations('ResetServerAction')

  if (!validatedFields.success) {
    return { error: t('invalidEmail') }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { error: t('emailNotFound') }
  }

  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  return { success: t('success') }
}
