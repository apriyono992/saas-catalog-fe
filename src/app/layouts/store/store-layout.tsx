import { useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalog', label: 'Catalog', end: false },
  { to: '/categories', label: 'Categories', end: false },
  { to: '/about', label: 'About', end: false },
]

function NavLinks({
  onNavigate,
  className,
  tone = 'default',
}: {
  onNavigate?: () => void
  className?: string
  tone?: 'default' | 'onDark'
}) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tone === 'onDark'
                ? cn(
                    'text-white/70 hover:text-white dark:text-muted-foreground dark:hover:text-foreground',
                    isActive && 'text-white dark:text-foreground'
                  )
                : cn('text-muted-foreground hover:text-foreground', isActive && 'text-foreground'),
              className
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}

export function StoreLayout() {
  const profileQuery = useStoreProfileQuery()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const storeName = profileQuery.data?.name ?? 'Store'
  const favoriteCount = useFavoritesStore((s) => s.ids.length)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  function handleSearchSubmit(event: FormEvent, closeSheet?: boolean) {
    event.preventDefault()
    navigate(search.trim() ? `/catalog?search=${encodeURIComponent(search.trim())}` : '/catalog')
    if (closeSheet) setMobileNavOpen(false)
  }

  return (
    <div
      className="storefront-root flex min-h-svh flex-col"
      style={
        !isDark && profileQuery.data
          ? ({
              ...(profileQuery.data.buttonColor ? { '--primary': profileQuery.data.buttonColor } : {}),
              ...(profileQuery.data.buttonTextColor
                ? { '--primary-foreground': profileQuery.data.buttonTextColor }
                : {}),
            } as React.CSSProperties)
          : undefined
      }
    >
      {!isDark && (
        <style>{`
          ${profileQuery.data?.buttonColor ? `
            html:not(.dark) .storefront-root button.bg-primary,
            html:not(.dark) .storefront-root a.bg-primary,
            html:not(.dark) .storefront-root [data-variant="default"],
            html:not(.dark) .storefront-root .bg-primary {
              background-color: ${profileQuery.data.buttonColor} !important;
              color: ${profileQuery.data.buttonTextColor || '#ffffff'} !important;
            }
          ` : ''}
          ${profileQuery.data?.cardColor ? `
            html:not(.dark) .storefront-root .store-card {
              background-color: ${profileQuery.data.cardColor} !important;
            }
          ` : ''}
          ${profileQuery.data?.cardSectionColor ? `
            html:not(.dark) .storefront-root .store-card-section {
              background-color: ${profileQuery.data.cardSectionColor} !important;
            }
          ` : ''}
        `}</style>
      )}

      <header
        className="sticky top-0 z-40 border-b border-white/10 bg-[#2d3336] backdrop-blur dark:border-border dark:bg-background/95 dark:supports-backdrop-filter:bg-background/60 transition-colors"
        style={!isDark && profileQuery.data?.navbarColor ? { backgroundColor: profileQuery.data.navbarColor } : undefined}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link
            to="/"
            className="shrink-0 truncate text-base font-semibold tracking-tight text-white dark:text-foreground"
          >
            {storeName}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLinks tone="onDark" />
          </nav>

          <form
            onSubmit={handleSearchSubmit}
            className="relative ml-auto hidden w-full max-w-xs md:block"
          >
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-white/60 dark:text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products…"
              className="border-white/20 bg-white/10 pl-8 text-white placeholder:text-white/50 focus-visible:border-white/40 dark:border-input dark:bg-input/30 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:border-ring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <Button variant="outline" size="icon" asChild className="relative shrink-0">
            <Link to="/favorites" aria-label="Favorites">
              <Heart className="size-4" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {favoriteCount}
                </span>
              )}
            </Link>
          </Button>

          <ThemeToggle />

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto md:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 p-4">
                <form onSubmit={(e) => handleSearchSubmit(e, true)} className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products…"
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
                <nav className="flex flex-col gap-1">
                  <NavLinks onNavigate={() => setMobileNavOpen(false)} className="px-3 py-2" />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
