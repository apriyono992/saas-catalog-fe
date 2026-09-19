import { useCallback, useState } from 'react'

const STORAGE_KEY = 'catalog-ui-sidebar-collapsed'

function readStoredCollapsed(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(readStoredCollapsed)

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  return { collapsed, toggle }
}
