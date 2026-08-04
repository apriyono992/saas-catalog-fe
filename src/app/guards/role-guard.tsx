import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { ForbiddenPage } from '@/components/common/forbidden-page'
import type { Role } from '@/types/common.types'

export function RoleGuard({ allow }: { allow: Role[] }) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allow.includes(user.role)) {
    return <ForbiddenPage />
  }

  return <Outlet />
}
