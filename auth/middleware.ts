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

export default authMiddleware((req) => intlMiddleware(req))

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}

// Next.js fucking dick

// const { auth } = NextAuth(authConfig)

// export default auth((req) => {
//   const { nextUrl } = req
//   const isLoggedIn = !!req.auth

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname)

//   if (isApiAuthRoute) {
//     return undefined
//   }

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
//     }

//     return undefined
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     return Response.redirect(new URL('/auth/login', nextUrl))
//   }

//   return undefined
// })

// // Optionally, don't invoke Middleware on some paths
// // Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

// // список роутов, которые будут вызывать auth выше.
// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
// }
