import type { Role } from '@/types/common.types'

export interface Profile {
  id: string
  tenantId: string | null
  email: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileDto {
  email: string
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}
