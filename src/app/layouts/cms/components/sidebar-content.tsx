import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { SidebarBrand } from './sidebar-brand'
import { SidebarNav } from './sidebar-nav'
import { SidebarUserMenu } from './sidebar-user-menu'
import type { NavGroup } from './nav-config'
import type { Profile } from '@/types/api/profile.types'

export function SidebarContent({
  groups,
  collapsed,
  showCollapseToggle,
  onToggleCollapse,
  user,
  onLogout,
  isLoggingOut,
  onNavigate,
}: {
  groups: NavGroup[]
  collapsed: boolean
  showCollapseToggle: boolean
  onToggleCollapse?: () => void
  user: Profile | null
  onLogout: () => void
  isLoggingOut: boolean
  onNavigate?: () => void
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        <SidebarBrand collapsed={collapsed} />

        {showCollapseToggle && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex shrink-0 items-center gap-2 border-b border-sidebar-border px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors',
              'hover:bg-sidebar-accent hover:text-sidebar-foreground',
              'focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:outline-none',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? <PanelLeftOpen className="size-4 shrink-0" /> : <PanelLeftClose className="size-4 shrink-0" />}
            <span className={cn(collapsed && 'sr-only')}>{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        )}

        <SidebarNav groups={groups} collapsed={collapsed} onNavigate={onNavigate} />

        <SidebarUserMenu user={user} collapsed={collapsed} onLogout={onLogout} isLoggingOut={isLoggingOut} />
      </div>
    </TooltipProvider>
  )
}
