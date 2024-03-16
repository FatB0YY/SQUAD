import { type DefaultSession } from 'next-auth'
import 'next-auth/jwt'

import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    role: UserRole
    isTwoFactorEnable: boolean
    isOAuth: boolean
  }

  interface Session extends DefaultSession {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    isTwoFactorEnable: boolean
    isOAuth: boolean
  }
}
