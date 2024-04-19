import { auth as authMiddleware } from '@/auth'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from '@/navigation'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
})

export default authMiddleware((req) => {
  return intlMiddleware(req)
})

export const config = {
  // Skip all paths that aren't pages that you'd like to internationalize
  matcher: ['/((?!api|_next|monitoring|.*\\..*).*)']
}
