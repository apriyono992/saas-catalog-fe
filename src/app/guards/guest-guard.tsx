import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { getRoleLandingRoute } from '@/lib/role-routes'

export function GuestGuard() {
  const user = useAuthStore((s) => s.user)

  if (user) {
    return <Navigate to={getRoleLandingRoute(user.role)} replace />
  }

  return <Outlet />
}
