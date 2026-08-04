import { storeClient } from '@/services/http/store-client'
import type { PaginatedResponse } from '@/types/common.types'
import type { ProductDetail, ProductListItem, StoreProductsQuery } from '@/types/api/store.types'

export function listStoreProducts(query: StoreProductsQuery) {
  return storeClient
    .get<PaginatedResponse<ProductListItem>>('/store/products', { params: query })
    .then((res) => res.data)
}

export function getStoreProduct(slug: string) {
  return storeClient.get<ProductDetail>(`/store/products/${slug}`).then((res) => res.data)
}

export function getRelatedProducts(slug: string) {
  return storeClient.get<ProductListItem[]>(`/store/products/${slug}/related`).then((res) => res.data)
}
