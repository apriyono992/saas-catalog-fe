import { cmsClient } from '@/services/http/cms-client'
import type { AdminProfile, CreateAdminDto, UpdateAdminDto } from '@/types/api/platform.types'

export function listAdminUsers(tenantId?: string) {
  return cmsClient
    .get<AdminProfile[]>('/cms/platform/users', { params: tenantId ? { tenantId } : undefined })
    .then((res) => res.data)
}

export function createAdminUser(dto: CreateAdminDto) {
  return cmsClient.post<AdminProfile>('/cms/platform/users', dto).then((res) => res.data)
}

export function updateAdminUser(id: string, dto: UpdateAdminDto) {
  return cmsClient.patch<AdminProfile>(`/cms/platform/users/${id}`, dto).then((res) => res.data)
}

export function disableAdminUser(id: string) {
  return cmsClient.post<AdminProfile>(`/cms/platform/users/${id}/disable`).then((res) => res.data)
}
