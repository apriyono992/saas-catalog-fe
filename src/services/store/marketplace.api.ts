import { storeClient } from '@/services/http/store-client'
import type { MarketplaceRedirectResponse } from '@/types/api/store.types'

export function redirectToMarketplace(linkId: string) {
  return storeClient
    .post<MarketplaceRedirectResponse>(`/store/marketplace/${linkId}/redirect`)
    .then((res) => res.data)
}
