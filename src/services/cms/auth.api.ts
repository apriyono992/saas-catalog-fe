import { cmsClient } from '@/services/http/cms-client'
import type { AuthTokens, LoginDto } from '@/types/api/auth.types'

export function login(dto: LoginDto) {
  return cmsClient.post<AuthTokens>('/cms/auth/login', dto).then((res) => res.data)
}

export function logout(refreshToken: string) {
  return cmsClient.post('/cms/auth/logout', { refreshToken })
}
