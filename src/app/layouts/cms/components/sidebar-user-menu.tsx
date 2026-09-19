import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/api/profile.types'

export function SidebarUserMenu({
  user,
  collapsed,
  onLogout,
  isLoggingOut,
}: {
  user: Profile | null
  collapsed: boolean
  onLogout: () => void
  isLoggingOut: boolean
}) {
  const navigate = useNavigate()

  return (
    <div className={cn('shrink-0 border-t border-sidebar-border p-2', collapsed && 'flex justify-center')}>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors',
                  'hover:bg-sidebar-accent',
                  'focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:outline-none',
                  collapsed && 'w-auto justify-center'
                )}
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback>{user?.email.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className={cn('flex min-w-0 flex-col', collapsed && 'sr-only')}>
                  <span className="truncate text-sm font-medium text-sidebar-foreground">{user?.email}</span>
                  <span className="truncate text-xs text-sidebar-foreground/60 capitalize">{user?.role}</span>
                </span>
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" hidden={!collapsed}>
            {user?.email}
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" side="top" className="w-56">
          <DropdownMenuLabel className="max-w-48 truncate font-normal text-muted-foreground">
            {user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout} disabled={isLoggingOut}>
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
