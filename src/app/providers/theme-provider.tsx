import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ThemeContext, type ResolvedTheme, type Theme } from '@/app/providers/theme-context'

const STORAGE_KEY = 'catalog-ui-theme'
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

function subscribeToSystemTheme(callback: () => void) {
  const media = window.matchMedia(DARK_MEDIA_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light'
}

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme, getSystemTheme)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, resolvedTheme])

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
}
