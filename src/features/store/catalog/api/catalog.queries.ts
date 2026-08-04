import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listStoreProducts } from '@/services/store/products.api'
import type { StoreProductsQuery } from '@/types/api/store.types'

export const storeProductKeys = {
  all: ['store-products'] as const,
  list: (query: StoreProductsQuery) => [...storeProductKeys.all, 'list', query] as const,
}

export function useStoreProductsQuery(query: StoreProductsQuery) {
  return useQuery({
    queryKey: storeProductKeys.list(query),
    queryFn: () => listStoreProducts(query),
    placeholderData: keepPreviousData,
  })
}
