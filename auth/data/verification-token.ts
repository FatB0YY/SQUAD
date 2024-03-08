import { db } from '@/lib/db'

export const getVarificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }
    })

    return verificationToken
  } catch (error) {
    console.error('Error', error)
    return null
  }
}

export const getVarificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token }
    })

    return verificationToken
  } catch (error) {
    console.error('Error', error)
    return null
  }
}
