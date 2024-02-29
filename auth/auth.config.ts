import bcryptjs from 'bcryptjs'

import Credentials from 'next-auth/providers/credentials'

import type { NextAuthConfig } from 'next-auth'

import { LoginSchema } from '@/schemas'
import { getUserByEmail, getUserById } from '@/data/user'
import { DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from './routes'
import { locales } from './navigation'
import { NextResponse } from 'next/server'

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
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { nextUrl } = request

      // console.log(nextUrl.pathname)

      const isAuthenticated = !!auth
      const isPublicPage = publicPagesPathnameRegex.test(nextUrl.pathname)
      const isAuthPage = authPagesPathnameRegex.test(nextUrl.pathname)

      if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }

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
      }
      session.user.role = token.role

      return session
    },
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token
      }

      const existingUser = await getUserById(token.sub)

      if (!existingUser) {
        return token
      }

      token.role = existingUser.role

      return token
    }
  }
} satisfies NextAuthConfig
