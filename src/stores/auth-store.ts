import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/types/api/profile.types'

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated'

interface AuthState {
  status: AuthStatus
  accessToken: string | null
  refreshToken: string | null
  user: Profile | null
  setStatus: (status: AuthStatus) => void
  setSession: (session: { accessToken: string; refreshToken: string; user: Profile }) => void
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  setUser: (user: Profile) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'idle',
      accessToken: null,
      refreshToken: null,
      user: null,
      setStatus: (status) => set({ status }),
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user, status: 'authenticated' }),
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null, status: 'unauthenticated' }),
    }),
    {
      name: 'catalog-auth',
      // Only the refresh token survives a reload — the access token stays in
      // memory, and `user`/`status` are re-hydrated via the silent-refresh boot check.
      partialize: (state) => ({ refreshToken: state.refreshToken }),
    }
  )
)
