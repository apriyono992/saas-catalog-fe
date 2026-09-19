import { Boxes } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        'flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4',
        collapsed && 'justify-center px-0'
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <Boxes className="size-4.5" />
      </span>
      <span className={cn('truncate text-base font-semibold tracking-tight', collapsed && 'sr-only')}>
        Catalog CMS
      </span>
    </div>
  )
}
