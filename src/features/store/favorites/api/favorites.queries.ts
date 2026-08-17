import { useQuery } from '@tanstack/react-query'
import { listStoreProductsByIds } from '@/services/store/products.api'

export const storeProductsByIdsKeys = {
  list: (ids: string[]) => ['store-products-by-ids', ids] as const,
}

export function useStoreProductsByIdsQuery(ids: string[]) {
  return useQuery({
    queryKey: storeProductsByIdsKeys.list(ids),
    queryFn: () => listStoreProductsByIds(ids),
    enabled: ids.length > 0,
  })
}
