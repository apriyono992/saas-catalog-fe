export type Shell = 'store' | 'cms'

const DEV_SHELL_STORAGE_KEY = 'dev-shell-override'

function isShell(value: string | null): value is Shell {
  return value === 'store' || value === 'cms'
}

function stripDevShellPathPrefix(shell: Shell) {
  const { pathname, search, hash } = window.location
  const rest = pathname.slice(`/${shell}`.length) || '/'
  window.history.replaceState(null, '', `${rest}${search}${hash}`)
}

function resolveDevShell(): Shell {
  const queryShell = new URLSearchParams(window.location.search).get('shell')

  if (isShell(queryShell)) {
    localStorage.setItem(DEV_SHELL_STORAGE_KEY, queryShell)
    return queryShell
  }

  // e.g. http://localhost:5173/cms — friendlier than ?shell=cms for non-technical testers.
  const pathShell = window.location.pathname.split('/')[1]
  if (isShell(pathShell)) {
    localStorage.setItem(DEV_SHELL_STORAGE_KEY, pathShell)
    stripDevShellPathPrefix(pathShell)
    return pathShell
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
