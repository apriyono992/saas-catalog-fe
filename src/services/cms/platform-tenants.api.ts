import { cmsClient } from '@/services/http/cms-client'
import type { CreateTenantDto, Tenant, UpdateTenantDto } from '@/types/api/platform.types'

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
