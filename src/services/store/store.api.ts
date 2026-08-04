import { storeClient } from '@/services/http/store-client'
import type { StoreProfile } from '@/types/api/store.types'

export function getStoreProfile() {
  return storeClient.get<StoreProfile>('/store').then((res) => res.data)
}
