'use client'

import { UserRole } from '@prisma/client'
import { useCurrentRole } from '@/hooks/use-current-role'
import { FormError } from '@/components/form-error'
import { useTranslations } from 'next-intl'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRole
}

/**
 * hoc
 */
export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole()
  const t = useTranslations('RoleGate')

  if (role !== allowedRole) {
    return <FormError message={t('error')} />
  }

  return <>{children}</>
}
