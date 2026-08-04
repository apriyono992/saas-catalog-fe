import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { login, logout } from '@/services/cms/auth.api'
import { getProfile } from '@/services/cms/profile.api'
import { useAuthStore } from '@/stores/auth-store'
import { getRoleLandingRoute } from '@/lib/role-routes'
import type { LoginDto } from '@/types/api/auth.types'

export function useLoginMutation() {
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const tokens = await login(dto)
      // getProfile() authenticates via the accessToken read from the store at
      // request time, so it must be set before this call — cleaned up again
      // on failure to avoid leaving a tokens-but-no-user inconsistent state.
      useAuthStore.getState().setTokens(tokens)
      try {
        const profile = await getProfile()
        return { tokens, profile }
      } catch (error) {
        useAuthStore.getState().clearSession()
        throw error
      }
    },
    meta: { skipGlobalErrorToast: true },
    onSuccess: ({ tokens, profile }) => {
      useAuthStore.getState().setSession({ ...tokens, user: profile })
      const from = (location.state as { from?: { pathname: string } } | null)?.from
      navigate(from?.pathname ?? getRoleLandingRoute(profile.role), { replace: true })
    },
  })
}

export function useLogoutMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        // Safe to call even if already invalid — best-effort per API docs.
        await logout(refreshToken).catch(() => {})
      }
    },
    meta: { skipGlobalErrorToast: true },
    onSettled: () => {
      useAuthStore.getState().clearSession()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}
