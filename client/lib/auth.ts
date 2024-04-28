/**
 * currentUser - возвращает session из next-auth (см auth.config.ts -> callbacks.session)
 * currentRole - возвращает роль пользователя, НЕ участника сервера!!!
 */

import { auth } from '@/auth'

export const currentUser = async () => {
  const session = await auth()

  return session?.user
}

export const currentRole = async () => {
  const session = await auth()

  return session?.user.role
}
