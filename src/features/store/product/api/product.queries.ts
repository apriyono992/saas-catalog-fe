import { useMutation, useQuery } from '@tanstack/react-query'
import { getRelatedProducts, getStoreProduct } from '@/services/store/products.api'
import { redirectToMarketplace } from '@/services/store/marketplace.api'

export const storeProductDetailKeys = {
  detail: (slug: string) => ['store-product-detail', slug] as const,
  related: (slug: string) => ['store-product-related', slug] as const,
}

export function useStoreProductQuery(slug: string | undefined) {
  return useQuery({
    queryKey: storeProductDetailKeys.detail(slug ?? ''),
    queryFn: () => getStoreProduct(slug!),
    enabled: !!slug,
  })
}

export function useRelatedProductsQuery(slug: string | undefined) {
  return useQuery({
    queryKey: storeProductDetailKeys.related(slug ?? ''),
    queryFn: () => getRelatedProducts(slug!),
    enabled: !!slug,
  })
}

export function useMarketplaceRedirectMutation() {
  return useMutation({
    mutationFn: (linkId: string) => redirectToMarketplace(linkId),
  })
}
