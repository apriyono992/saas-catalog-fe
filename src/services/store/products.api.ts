import { storeClient } from '@/services/http/store-client'
import type { PaginatedResponse } from '@/types/common.types'
import type { PopularProduct, ProductDetail, ProductListItem, StoreProductsQuery } from '@/types/api/store.types'

export function listStoreProducts(query: StoreProductsQuery) {
  return storeClient
    .get<PaginatedResponse<ProductListItem>>('/store/products', { params: query })
    .then((res) => res.data)
}

export function getPopularProducts(limit?: number) {
  return storeClient
    .get<PopularProduct[]>('/store/products/popular', { params: { limit } })
    .then((res) => res.data)
}

export function getStoreProduct(slug: string) {
  return storeClient.get<ProductDetail>(`/store/products/${slug}`).then((res) => res.data)
}

export function getRelatedProducts(slug: string) {
  return storeClient.get<ProductListItem[]>(`/store/products/${slug}/related`).then((res) => res.data)
}

export function listStoreProductsByIds(ids: string[]) {
  return storeClient.post<ProductListItem[]>('/store/products/by-ids', { ids }).then((res) => res.data)
}
