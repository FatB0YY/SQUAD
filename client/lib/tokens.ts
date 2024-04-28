/**
 * generatePasswordResetToken - токен-восстановления-пароля:
 * задает дату когда токен истекает,
 * далее если находит токен-восстановления-пароля в бд, удаляет его,
 * далее создает в бд новый токен-восстановления-пароля и возвращает его
 *
 * generateVerificationToken - такой же принцип, только теперь токен-подтверждения-почты
 *
 * generateTwoFactorToken - такой же принцип, только теперь 2FA-токен
 */

import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { getVerificationTokenByEmail } from '@/data/verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()

  // Mon Mar 04 2024 19:10:22 GMT+0300 (Москва, стандартное время)
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()

  // Mon Mar 04 2024 19:10:22 GMT+0300 (Москва, стандартное время)
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return verificationToken
}

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()

  // 5 минут
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return twoFactorToken
}
