import { auth as authMiddleware } from '@/auth'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from '@/navigation'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
})

export default authMiddleware((req) => intlMiddleware(req))

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}

// Next.js fucking dick

// import NextAuth from 'next-auth'
// import createIntlMiddleware from 'next-intl/middleware'

// import authConfig from '@/auth.config'
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
//   publicRoutes
// } from '@/routes'

// import { locales } from '@/navigation'

// const { auth } = NextAuth(authConfig)

// const intlMiddleware = createIntlMiddleware({
//   defaultLocale: 'en',
//   locales: ['en', 'ru']
//   //   pathnames,
//   //   localePrefix
// })

// function stripLocaleFromPath(path: string) {
//   // This regex matches a leading slash, followed by two characters (locale), followed by another slash
//   const localePrefixPattern = /^\/[a-z]{2}(\/|$)/
//   return path.replace(localePrefixPattern, '/')
// }

// const authMiddleware = auth((req) => {
//   const { nextUrl } = req
//   const isLoggedIn = !!req.auth

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
//   // const isAuthRoute = authRoutes.includes(stripLocaleFromPath(nextUrl.pathname))
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname)

//   console.log(nextUrl.pathname)

//   if (isApiAuthRoute) {
//     return undefined
//   }

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
//     }
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     // let callbackUrl = nextUrl.pathname
//     // if (nextUrl.search) {
//     //   callbackUrl += nextUrl.search
//     // }

//     // const encodedCallbackUrl = encodeURIComponent(callbackUrl)

//     // return Response.redirect(
//     //   new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
//     // )
//     return Response.redirect(new URL('/auth/signin', nextUrl))
//   }
//   return intlMiddleware(req)
// })

// export default function middleware(req: any) {
//   const publicPathnameRegex = RegExp(
//     `^(/(${locales.join('|')}))?(${publicRoutes
//       .flatMap((p) => (p === '/' ? ['', '/'] : p))
//       .join('|')})/?$`,
//     'i'
//   )

//   const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

//   if (isPublicPage) {
//     return intlMiddleware(req)
//   } else {
//     return (authMiddleware as any)(req)
//   }
// }

// export const config = {
//   matcher: ['/((?!.+.[w]+$|_next).)', '/', '/(api|trpc)(.)', '/auth/:path*']
// }
