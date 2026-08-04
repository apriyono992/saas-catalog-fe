import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createMarketplaceLink,
  deleteMarketplaceLink,
  updateMarketplaceLink,
} from '@/services/cms/marketplace-links.api'
import { productKeys } from '@/features/admin/products/api/products.queries'
import type { CreateMarketplaceLinkDto, UpdateMarketplaceLinkDto } from '@/types/api/product.types'

function useInvalidateProduct(productId: string) {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) })
}

export function useCreateMarketplaceLinkMutation(productId: string) {
  const invalidate = useInvalidateProduct(productId)
  return useMutation({
    mutationFn: (dto: CreateMarketplaceLinkDto) => createMarketplaceLink(productId, dto),
    onSuccess: invalidate,
  })
}

export function useUpdateMarketplaceLinkMutation(productId: string) {
  const invalidate = useInvalidateProduct(productId)
  return useMutation({
    mutationFn: ({ linkId, dto }: { linkId: string; dto: UpdateMarketplaceLinkDto }) =>
      updateMarketplaceLink(productId, linkId, dto),
    onSuccess: invalidate,
  })
}

export function useDeleteMarketplaceLinkMutation(productId: string) {
  const invalidate = useInvalidateProduct(productId)
  return useMutation({
    mutationFn: (linkId: string) => deleteMarketplaceLink(productId, linkId),
    onSuccess: invalidate,
  })
}
