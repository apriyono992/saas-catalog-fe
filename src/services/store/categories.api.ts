import { storeClient } from '@/services/http/store-client'
import type { CategoryListItem, StoreCategoryDetail } from '@/types/api/store.types'

export function getStoreCategories(rootOnly?: boolean) {
  return storeClient
    .get<CategoryListItem[]>('/store/categories', {
      params: rootOnly ? { rootOnly: 'true' } : undefined,
    })
    .then((res) => res.data)
}

export function getStoreCategoryDetail(slug: string) {
  return storeClient
    .get<StoreCategoryDetail>(`/store/categories/${slug}`)
    .then((res) => res.data)
}
