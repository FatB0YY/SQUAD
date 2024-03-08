import { getVarificationTokenByEmail } from '@/data/verification-token'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()

  // Mon Mar 04 2024 19:10:22 GMT+0300 (Москва, стандартное время)
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVarificationTokenByEmail(email)

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
