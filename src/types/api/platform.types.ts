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
  domain?: string
  adminEmail?: string
  adminPassword?: string
}

export interface UpdateTenantDto {
  name?: string
  status?: TenantStatus
  domain?: string
}

export interface PlatformStoreSettings {
  id: string
  tenantId: string
  description: string | null
  contactEmail: string | null
  contactPhone: string | null
  socialInstagram: string | null
  socialFacebook: string | null
  socialTiktok: string | null
  socialWhatsapp: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdatePlatformStoreSettingsDto {
  description?: string
  contactEmail?: string
  contactPhone?: string
  socialInstagram?: string
  socialFacebook?: string
  socialTiktok?: string
  socialWhatsapp?: string
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

