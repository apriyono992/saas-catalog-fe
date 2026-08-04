import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { refreshSession } from '@/services/http/cms-client'
import { getProfile } from '@/services/cms/profile.api'

/**
 * Runs once when the CMS shell mounts. The access token never survives a
 * reload (memory-only), so this silently exchanges the persisted refresh
 * token for a fresh session before any guarded route renders.
 */
export function useSessionBootstrap() {
  const status = useAuthStore((s) => s.status)

  useEffect(() => {
    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken) {
      useAuthStore.getState().setStatus('unauthenticated')
      return
    }

    refreshSession()
      .then((tokens) => {
        useAuthStore.getState().setTokens(tokens)
        return getProfile()
      })
      .then((profile) => {
        useAuthStore.getState().setUser(profile)
        useAuthStore.getState().setStatus('authenticated')
      })
      .catch(() => {
        useAuthStore.getState().clearSession()
      })
  }, [])

  return status
}
