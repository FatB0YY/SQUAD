import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { getUserById } from '@/data/user'
import authConfig from '@/auth.config'
import { db } from '@/lib/db'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  // callbacks: {},

  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },

  ...authConfig
})
