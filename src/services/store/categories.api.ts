import { storeClient } from '@/services/http/store-client'
import type { CategoryListItem } from '@/types/api/store.types'

export function getStoreCategories() {
  return storeClient.get<CategoryListItem[]>('/store/categories').then((res) => res.data)
}
