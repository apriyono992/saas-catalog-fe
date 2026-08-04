import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProductImage, reorderProductImages, uploadProductImage } from '@/services/cms/product-images.api'
import { productKeys } from '@/features/admin/products/api/products.queries'

export function useUploadProductImageMutation(productId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) =>
      uploadProductImage(productId, file, onProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) }),
  })
}

export function useReorderProductImagesMutation(productId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (imageIds: string[]) => reorderProductImages(productId, { imageIds }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) }),
  })
}

export function useDeleteProductImageMutation(productId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (imageId: string) => deleteProductImage(productId, imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) }),
  })
}
