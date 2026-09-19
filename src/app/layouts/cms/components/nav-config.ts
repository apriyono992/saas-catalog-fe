import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  Palette,
  BarChart3,
  History,
  Building2,
  Users,
  Store,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/types/common.types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/products', label: 'Products', icon: Package },
      { to: '/categories', label: 'Categories', icon: FolderTree },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/activity-logs', label: 'Activity logs', icon: History },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings },
      { to: '/appearance', label: 'Appearance', icon: Palette },
    ],
  },
]

export const SUPERADMIN_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { to: '/tenants', label: 'Tenants', icon: Building2 },
      { to: '/users', label: 'Admin users', icon: Users },
      { to: '/marketplaces', label: 'Marketplaces', icon: Store },
    ],
  },
]

export function getNavGroupsForRole(role: Role | undefined): NavGroup[] {
  return role === 'superadmin' ? SUPERADMIN_NAV_GROUPS : ADMIN_NAV_GROUPS
}
