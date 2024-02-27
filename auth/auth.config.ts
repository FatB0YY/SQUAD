import bcryptjs from 'bcryptjs'

import Credentials from 'next-auth/providers/credentials'

import type { NextAuthConfig } from 'next-auth'

import { LoginSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'

// возможно здесь идет установка нужных провайдеров (входов, github, google , credentials)
export default {
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const validatedFileds = LoginSchema.safeParse(credentials)

        if (validatedFileds.success) {
          const { email, password } = validatedFileds.data

          const user = await getUserByEmail(email)

          // если вход был выполнен через Google или Github
          // у пользователя не будет password, тогда
          // мы не используем authorize по credentials.
          if (!user || !user.password) {
            return null
          }

          const passwordsMatch = await bcryptjs.compare(password, user.password)

          if (passwordsMatch) {
            return user
          }
        }
        return null
      }
    })
  ]
} satisfies NextAuthConfig
