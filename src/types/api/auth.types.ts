import type { Role } from '@/types/common.types'

export interface LoginDto {
  email: string
  password: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AccessTokenPayload {
  sub: string
  tenantId: string | null
  role: Role
}
