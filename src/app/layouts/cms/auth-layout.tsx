import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
