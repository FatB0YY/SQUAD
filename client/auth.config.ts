import bcryptjs from 'bcryptjs'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { NextResponse } from 'next/server'
import type { NextAuthConfig } from 'next-auth'

import { LoginSchema } from '@/schemas'
import { getUserByEmail, getUserById } from '@/data/user'
import { DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from '@/routes'
import { locales } from '@/navigation'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { db } from '@/lib/db'
import { getAccountByUserId } from './data/account'

const publicPagesPathnameRegex = RegExp(
  `^(/(${locales.join('|')}))?(${[...publicRoutes, ...authRoutes]
    .flatMap((p) => (p === '/' ? ['', '/'] : p))
    .join('|')})/?$`,
  'i'
)

const authPagesPathnameRegex = RegExp(
  `^(/(${locales.join('|')}))?(${authRoutes
    .flatMap((p) => (p === '/' ? ['', '/'] : p))
    .join('|')})/?$`,
  'i'
)

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
      // еще раз проверяем правильность заполнения полей
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
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      // Разрешить OAuth без проверки электронной почты
      if (account?.provider !== 'credentials') {
        return true
      }

      const existingUser = await getUserById(user.id as string)

      // Запретить вход без подтверждения электронной почты
      if (!existingUser?.emailVerified) {
        return false
      }

      if (existingUser.isTwoFactorEnable) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        )

        if (!twoFactorConfirmation) {
          return false
        }

        // Удалить 2FA при след входе
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        })
      }

      return true
    },
    authorized: async ({ auth, request }) => {
      const { nextUrl } = request

      const isAuthenticated = !!auth
      const isPublicPage = publicPagesPathnameRegex.test(nextUrl.pathname)
      const isAuthPage = authPagesPathnameRegex.test(nextUrl.pathname)

      // редирект если isAuthenticated и это isAuthPage
      if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }

      // редирект если не isAuthenticated или это не isPublicPage
      if (!(isAuthenticated || isPublicPage)) {
        return NextResponse.redirect(
          // new URL(`/signin?callbackUrl=${nextUrl.pathname}`, nextUrl)
          new URL('/auth/signin', nextUrl)
        )
      }

      return isAuthenticated || isPublicPage
    },
    session: async ({ token, session }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }

      if (session.user) {
        session.user.isTwoFactorEnable = token.isTwoFactorEnable
      }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth
      }

      return session
    },
    jwt: async ({ token }) => {
      // означает что вышел из системы
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnable = existingUser.isTwoFactorEnable

      return token
    }
  }
} satisfies NextAuthConfig
