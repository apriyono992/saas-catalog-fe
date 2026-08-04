import type { Role } from '@/types/common.types'

/** Where each role lands right after login (or when hitting `/login` already authenticated). */
export function getRoleLandingRoute(role: Role): string {
  return role === 'superadmin' ? '/tenants' : '/dashboard'
}
