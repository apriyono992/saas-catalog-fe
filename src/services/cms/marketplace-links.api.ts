import { cmsClient } from '@/services/http/cms-client'
import type { CreateMarketplaceLinkDto, MarketplaceLink, UpdateMarketplaceLinkDto } from '@/types/api/product.types'

export function listMarketplaceLinks(productId: string) {
  return cmsClient.get<MarketplaceLink[]>(`/cms/products/${productId}/marketplace-links`).then((res) => res.data)
}

export function createMarketplaceLink(productId: string, dto: CreateMarketplaceLinkDto) {
  return cmsClient.post<MarketplaceLink>(`/cms/products/${productId}/marketplace-links`, dto).then((res) => res.data)
}

export function updateMarketplaceLink(productId: string, linkId: string, dto: UpdateMarketplaceLinkDto) {
  return cmsClient
    .patch<MarketplaceLink>(`/cms/products/${productId}/marketplace-links/${linkId}`, dto)
    .then((res) => res.data)
}

export function deleteMarketplaceLink(productId: string, linkId: string) {
  return cmsClient.delete(`/cms/products/${productId}/marketplace-links/${linkId}`)
}
