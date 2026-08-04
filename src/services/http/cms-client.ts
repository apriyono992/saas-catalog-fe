import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import type { AuthTokens } from '@/types/api/auth.types'

const AUTH_ROUTE_PREFIX = '/cms/auth/'

export const cmsClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Bare instance for the refresh call itself — must never carry the
// interceptors below, or a failed refresh would recursively trigger another.
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

cmsClient.interceptors.request.use((config) => {
  if (!config.url?.includes(AUTH_ROUTE_PREFIX)) {
    const token = useAuthStore.getState().accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<AuthTokens> | null = null

export function refreshSession(): Promise<AuthTokens> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) return Promise.reject(new Error('No refresh token available'))

  refreshPromise ??= refreshClient
    .post<AuthTokens>('/cms/auth/refresh', { refreshToken })
    .then((res) => res.data)
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

cmsClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined
    const isAuthRoute = originalRequest?.url?.includes(AUTH_ROUTE_PREFIX)
    const shouldAttemptRefresh =
      error.response?.status === 401 && originalRequest && !isAuthRoute && !originalRequest._retry

    if (!shouldAttemptRefresh) {
      throw error
    }

    originalRequest._retry = true

    try {
      const tokens = await refreshSession()
      useAuthStore.getState().setTokens(tokens)
      originalRequest.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
      return cmsClient(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().clearSession()
      window.location.assign('/login')
      throw refreshError
    }
  }
)
