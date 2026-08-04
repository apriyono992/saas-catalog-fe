import type { Role, TenantStatus } from '@/types/common.types'

export interface Tenant {
  id: string
  name: string
  status: TenantStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTenantDto {
  name: string
}

export interface UpdateTenantDto {
  name?: string
  status?: TenantStatus
}

export interface AdminProfile {
  id: string
  tenantId: string
  email: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAdminDto {
  tenantId: string
  email: string
  password: string
}

export interface UpdateAdminDto {
  email: string
}
