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
  bannerUrl: string | null
  navbarColor: string | null
  buttonColor: string | null
  buttonTextColor: string | null
  categoryTitle: string | null
  cardColor: string | null
  cardSectionColor: string | null
  defaultStrikePercentage: string | null
  storageDriver?: 'local' | 's3' | null
  s3Endpoint?: string | null
  s3Region?: string | null
  s3Bucket?: string | null
  s3AccessKeyId?: string | null
  s3SecretAccessKey?: string | null
  hasS3SecretAccessKey?: boolean
  s3PublicUrlBase?: string | null
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
  navbarColor?: string
  buttonColor?: string
  buttonTextColor?: string
  bannerUrl?: string
  categoryTitle?: string
  cardColor?: string
  cardSectionColor?: string
  defaultStrikePercentage?: string
  storageDriver?: 'local' | 's3'
  s3Endpoint?: string
  s3Region?: string
  s3Bucket?: string
  s3AccessKeyId?: string
  s3SecretAccessKey?: string
  s3PublicUrlBase?: string
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

