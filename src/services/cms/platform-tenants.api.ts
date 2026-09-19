import { cmsClient } from '@/services/http/cms-client'
import type {
  CreateTenantDto,
  PlatformStoreSettings,
  Tenant,
  UpdatePlatformStoreSettingsDto,
  UpdateTenantDto,
} from '@/types/api/platform.types'
import type { Domain } from '@/types/api/domain.types'

export function listTenants() {
  return cmsClient.get<Tenant[]>('/cms/platform/tenants').then((res) => res.data)
}

export function createTenant(dto: CreateTenantDto) {
  return cmsClient.post<Tenant>('/cms/platform/tenants', dto).then((res) => res.data)
}

export function updateTenant(id: string, dto: UpdateTenantDto) {
  return cmsClient.patch<Tenant>(`/cms/platform/tenants/${id}`, dto).then((res) => res.data)
}

export function suspendTenant(id: string) {
  return cmsClient.post<Tenant>(`/cms/platform/tenants/${id}/suspend`).then((res) => res.data)
}

export function activateTenant(id: string) {
  return cmsClient.post<Tenant>(`/cms/platform/tenants/${id}/activate`).then((res) => res.data)
}

export function getTenantStoreSettings(id: string) {
  return cmsClient
    .get<PlatformStoreSettings>(`/cms/platform/tenants/${id}/store-settings`)
    .then((res) => res.data)
}

export function updateTenantStoreSettings(id: string, dto: UpdatePlatformStoreSettingsDto) {
  return cmsClient
    .patch<PlatformStoreSettings>(`/cms/platform/tenants/${id}/store-settings`, dto)
    .then((res) => res.data)
}

export function listTenantDomains(id: string) {
  return cmsClient.get<Domain[]>(`/cms/platform/tenants/${id}/domains`).then((res) => res.data)
}

export function createTenantDomain(id: string, hostname: string) {
  return cmsClient
    .post<Domain>(`/cms/platform/tenants/${id}/domains`, { hostname })
    .then((res) => res.data)
}

export function deleteTenantDomain(tenantId: string, domainId: string) {
  return cmsClient.delete(`/cms/platform/tenants/${tenantId}/domains/${domainId}`)
}

export function verifyTenantDomain(tenantId: string, domainId: string) {
  return cmsClient
    .post<Domain>(`/cms/platform/tenants/${tenantId}/domains/${domainId}/verify`)
    .then((res) => res.data)
}

export function uploadTenantBanner(tenantId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return cmsClient
    .post<PlatformStoreSettings>(`/cms/platform/tenants/${tenantId}/store-settings/banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export function deleteTenantBanner(tenantId: string) {
  return cmsClient.delete(`/cms/platform/tenants/${tenantId}/store-settings/banner`)
}
