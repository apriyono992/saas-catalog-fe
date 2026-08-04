import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusVariant = 'success' | 'warning' | 'destructive' | 'muted'

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  muted: 'bg-muted text-muted-foreground',
}

interface StatusBadgeProps {
  label: string
  variant?: StatusVariant
}

export function StatusBadge({ label, variant = 'muted' }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('capitalize', VARIANT_CLASSES[variant])}>
      {label}
    </Badge>
  )
}
