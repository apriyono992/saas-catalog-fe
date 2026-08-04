export type Shell = 'store' | 'cms'

const DEV_SHELL_STORAGE_KEY = 'dev-shell-override'

function isShell(value: string | null): value is Shell {
  return value === 'store' || value === 'cms'
}

function resolveDevShell(): Shell {
  const queryShell = new URLSearchParams(window.location.search).get('shell')

  if (isShell(queryShell)) {
    localStorage.setItem(DEV_SHELL_STORAGE_KEY, queryShell)
    return queryShell
  }

  const stored = localStorage.getItem(DEV_SHELL_STORAGE_KEY)
  if (isShell(stored)) return stored

  return import.meta.env.VITE_DEV_DEFAULT_SHELL === 'cms' ? 'cms' : 'store'
}

/**
 * Both shells ship in one bundle deployed to one origin. Which one renders is
 * decided purely by which hostname the browser used to reach it — real tenant
 * domains and the CMS platform domain all point at the same origin.
 */
export function resolveShell(): Shell {
  if (import.meta.env.DEV) return resolveDevShell()

  return window.location.hostname === import.meta.env.VITE_CMS_APP_DOMAIN ? 'cms' : 'store'
}
