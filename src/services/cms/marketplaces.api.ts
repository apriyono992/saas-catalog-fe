import { cmsClient } from '@/services/http/cms-client'
import type {
  CreateMarketplaceDto,
  Marketplace,
  UpdateMarketplaceDto,
} from '@/types/api/marketplace.types'

export function listPlatformMarketplaces() {
  return cmsClient.get<Marketplace[]>('/cms/platform/marketplaces').then((res) => res.data)
}

export function createPlatformMarketplace(dto: CreateMarketplaceDto) {
  return cmsClient.post<Marketplace>('/cms/platform/marketplaces', dto).then((res) => res.data)
}

export function updatePlatformMarketplace(id: string, dto: UpdateMarketplaceDto) {
  return cmsClient.patch<Marketplace>(`/cms/platform/marketplaces/${id}`, dto).then((res) => res.data)
}

export function deletePlatformMarketplace(id: string) {
  return cmsClient.delete(`/cms/platform/marketplaces/${id}`)
}

export function uploadPlatformMarketplaceIcon(id: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return cmsClient
    .post<Marketplace>(`/cms/platform/marketplaces/${id}/icon`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export function deletePlatformMarketplaceIcon(id: string) {
  return cmsClient.delete(`/cms/platform/marketplaces/${id}/icon`)
}

export function listMarketplaces() {
  return cmsClient.get<Marketplace[]>('/cms/marketplaces').then((res) => res.data)
}
