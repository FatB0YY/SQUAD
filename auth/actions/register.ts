'use server'

import * as z from 'zod'
import bcryptjs from 'bcryptjs'

import { RegisterSchema } from '@/schemas'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { getTranslations } from 'next-intl/server'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  const t = await getTranslations('RegisterForm.registerErrorSuccessMessages')

  if (!validatedFields.success) {
    return { error: t('invalidFields') }
  }

  const { email, name, password } = validatedFields.data

  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(password, salt)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: t('emailAlreadyInUse') }
  }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: t('emailsent') }
}
