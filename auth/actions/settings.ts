'use server'

import * as z from 'zod'
import bcryptjs from 'bcryptjs'
import { unstable_update } from '@/auth'

import { db } from '@/lib/db'
import { SettingsSchema } from '@/schemas'
import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await getUserById(user.id as string)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  if (user.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnable = undefined
  }

  // в целом проверка на то, если юзер хочет указать чужой email
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in user!' }
    }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: 'Verification email sent!' }
  }

  // те же самые проверки с password
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcryptjs.compare(
      values.password,
      dbUser.password
    )

    if (!passwordMatch) {
      return { error: 'Incorrect password!' }
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(values.password, salt)

    values.password = hashedPassword
    values.newPassword = undefined
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: { ...values }
  })

  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnable: updatedUser.isTwoFactorEnable,
      role: updatedUser.role
    }
  })

  return { success: 'Settings Updated!' }
}
