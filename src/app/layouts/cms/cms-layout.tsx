import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Menu,
  LayoutDashboard,
  User,
  LogOut,
  FolderTree,
  Package,
  Globe,
  Settings,
  BarChart3,
  History,
  Building2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useAuthStore } from '@/stores/auth-store'
import { useLogoutMutation } from '@/features/admin/auth/api/auth.mutations'
import { cn } from '@/lib/utils'

const ADMIN_NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: FolderTree },
  { to: '/domains', label: 'Domains', icon: Globe },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/activity-logs', label: 'Activity logs', icon: History },
]

const SUPERADMIN_NAV_ITEMS = [
  { to: '/tenants', label: 'Tenants', icon: Building2 },
  { to: '/users', label: 'Admin users', icon: Users },
]

const COMMON_NAV_ITEMS = [{ to: '/profile', label: 'Profile', icon: User }]

function NavList({ items, onNavigate }: { items: typeof ADMIN_NAV_ITEMS; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              isActive && 'bg-muted text-foreground'
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function CmsLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logoutMutation = useLogoutMutation()

  const navItems = [...(user?.role === 'superadmin' ? SUPERADMIN_NAV_ITEMS : ADMIN_NAV_ITEMS), ...COMMON_NAV_ITEMS]

  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-56 shrink-0 border-r border-border md:block">
        <div className="flex h-14 items-center border-b border-border px-4 text-base font-semibold">
          Catalog CMS
        </div>
        <NavList items={navItems} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-14 items-center border-b border-border px-4 text-base font-semibold">
                Catalog CMS
              </div>
              <NavList items={navItems} onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
                  <Avatar className="size-8">
                    <AvatarFallback>{user?.email.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="max-w-48 truncate font-normal text-muted-foreground">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
