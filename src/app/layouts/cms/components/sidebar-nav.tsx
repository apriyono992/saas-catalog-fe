import { NavLink } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { NavGroup, NavItem } from './nav-config'

function NavItemLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center gap-2.5 rounded-md py-2 pr-2.5 pl-3 text-sm font-medium text-sidebar-foreground/70 transition-colors',
              'hover:bg-sidebar-accent hover:text-sidebar-foreground',
              'focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:outline-none',
              isActive && 'bg-sidebar-accent font-semibold text-sidebar-primary',
              collapsed && 'justify-center px-0'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'absolute inset-y-1 left-0 w-0.5 scale-y-0 rounded-full bg-sidebar-primary transition-transform duration-200 ease-out',
                  isActive && 'scale-y-100'
                )}
              />
              <item.icon className={cn('size-4 shrink-0', isActive && 'text-sidebar-primary')} />
              <span className={cn('truncate', collapsed && 'sr-only')}>{item.label}</span>
            </>
          )}
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right" hidden={!collapsed}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}

function NavGroupSection({
  group,
  collapsed,
  onNavigate,
}: {
  group: NavGroup
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <div role="group" aria-label={group.label} className="flex flex-col gap-1">
      {group.label && !collapsed && (
        <span className="px-3 pb-1 text-[11px] font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
          {group.label}
        </span>
      )}
      {group.label && collapsed && <Separator className="mx-2 mb-1 bg-sidebar-border" />}
      {group.items.map((item) => (
        <NavItemLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
      ))}
    </div>
  )
}

export function SidebarNav({
  groups,
  collapsed,
  onNavigate,
}: {
  groups: NavGroup[]
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <nav aria-label="Primary" className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
      {groups.map((group, index) => (
        <NavGroupSection key={group.label ?? index} group={group} collapsed={collapsed} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}
