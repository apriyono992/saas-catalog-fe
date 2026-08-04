import { ShieldAlert } from 'lucide-react'

export function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <ShieldAlert className="size-8 text-muted-foreground" />
      <h1 className="text-lg font-semibold">You don't have access to this page</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This section requires a different role than your account has.
      </p>
    </div>
  )
}
