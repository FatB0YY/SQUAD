import { auth as authMiddleware } from '@/auth'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from '@/navigation'
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
//   publicRoutes
// } from './routes'
// import NextAuth from 'next-auth'
// import authConfig from './auth.config'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
})

export default authMiddleware((req) => {
  return intlMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
