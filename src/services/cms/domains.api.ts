import { cmsClient } from '@/services/http/cms-client'
import type { CreateDomainDto, Domain } from '@/types/api/domain.types'

export function listDomains() {
  return cmsClient.get<Domain[]>('/cms/domains').then((res) => res.data)
}

export function createDomain(dto: CreateDomainDto) {
  return cmsClient.post<Domain>('/cms/domains', dto).then((res) => res.data)
}

export function verifyDomain(id: string) {
  return cmsClient.post<Domain>(`/cms/domains/${id}/verify`).then((res) => res.data)
}

export function deleteDomain(id: string) {
  return cmsClient.delete(`/cms/domains/${id}`)
}
