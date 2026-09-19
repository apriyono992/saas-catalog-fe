import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useAuthStore } from '@/stores/auth-store'
import { useLogoutMutation } from '@/features/admin/auth/api/auth.mutations'
import { useSidebarCollapsed } from '@/hooks/use-sidebar-collapsed'
import { cn } from '@/lib/utils'
import { SidebarContent } from './components/sidebar-content'
import { getNavGroupsForRole } from './components/nav-config'

export function CmsLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { collapsed, toggle } = useSidebarCollapsed()
  const user = useAuthStore((s) => s.user)
  const logoutMutation = useLogoutMutation()

  const navGroups = getNavGroupsForRole(user?.role)

  return (
    <div className="flex min-h-svh">
      <aside
        className={cn(
          'hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out md:flex',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        <SidebarContent
          groups={navGroups}
          collapsed={collapsed}
          showCollapseToggle
          onToggleCollapse={toggle}
          user={user}
          onLogout={() => logoutMutation.mutate()}
          isLoggingOut={logoutMutation.isPending}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
              <SidebarContent
                groups={navGroups}
                collapsed={false}
                showCollapseToggle={false}
                user={user}
                onLogout={() => logoutMutation.mutate()}
                isLoggingOut={logoutMutation.isPending}
                onNavigate={() => setMobileNavOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
