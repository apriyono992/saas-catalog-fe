import { cmsClient } from '@/services/http/cms-client'
import type { ProductImage, ReorderImagesDto } from '@/types/api/product.types'

export function uploadProductImage(productId: string, file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData()
  formData.append('file', file)

  return cmsClient
    .post<ProductImage>(`/cms/products/${productId}/images`, formData, {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return
        onProgress(Math.round((event.loaded / event.total) * 100))
      },
    })
    .then((res) => res.data)
}

export function reorderProductImages(productId: string, dto: ReorderImagesDto) {
  return cmsClient.patch(`/cms/products/${productId}/images/reorder`, dto)
}

export function deleteProductImage(productId: string, imageId: string) {
  return cmsClient.delete(`/cms/products/${productId}/images/${imageId}`)
}
