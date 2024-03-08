import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from '@/auth.config'
import { db } from '@/lib/db'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      console.log('------ events linkAccount ------')

      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },
  ...authConfig
})
