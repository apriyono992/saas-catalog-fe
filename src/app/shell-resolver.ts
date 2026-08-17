export type Shell = 'store' | 'cms'

/**
 * Both shells ship in one bundle deployed to one origin. Which one renders
 * is decided purely by the URL path — /cms (and everything under it) is the
 * admin panel, everything else is the public storefront — the same rule on
 * every domain, in dev and production alike.
 */
export function resolveShell(): Shell {
  const { pathname } = window.location
  return pathname === '/cms' || pathname.startsWith('/cms/') ? 'cms' : 'store'
}
