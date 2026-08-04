import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createVariantOption,
  createVariantType,
  deleteVariantOption,
  deleteVariantType,
} from '@/services/cms/product-variants.api'
import { productKeys } from '@/features/admin/products/api/products.queries'
import type { CreateVariantOptionDto, CreateVariantTypeDto } from '@/types/api/product.types'

function useInvalidateProduct(productId: string) {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) })
}

export function useCreateVariantTypeMutation(productId: string) {
  const invalidate = useInvalidateProduct(productId)
  return useMutation({
    mutationFn: (dto: CreateVariantTypeDto) => createVariantType(productId, dto),
    onSuccess: invalidate,
  })
}

export function useDeleteVariantTypeMutation(productId: string) {
  const invalidate = useInvalidateProduct(productId)
  return useMutation({
    mutationFn: (typeId: string) => deleteVariantType(productId, typeId),
    onSuccess: invalidate,
  })
}

export function useCreateVariantOptionMutation(productId: string) {
  const invalidate = useInvalidateProduct(productId)
  return useMutation({
    mutationFn: ({ typeId, dto }: { typeId: string; dto: CreateVariantOptionDto }) =>
      createVariantOption(productId, typeId, dto),
    onSuccess: invalidate,
  })
}

export function useDeleteVariantOptionMutation(productId: string) {
  const invalidate = useInvalidateProduct(productId)
  return useMutation({
    mutationFn: ({ typeId, optionId }: { typeId: string; optionId: string }) =>
      deleteVariantOption(productId, typeId, optionId),
    onSuccess: invalidate,
  })
}
