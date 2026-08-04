import { cmsClient } from '@/services/http/cms-client'
import type {
  CreateVariantOptionDto,
  CreateVariantTypeDto,
  UpdateVariantOptionDto,
  UpdateVariantTypeDto,
  VariantOption,
  VariantType,
} from '@/types/api/product.types'

export function listVariantTypes(productId: string) {
  return cmsClient.get<VariantType[]>(`/cms/products/${productId}/variant-types`).then((res) => res.data)
}

export function createVariantType(productId: string, dto: CreateVariantTypeDto) {
  return cmsClient.post<VariantType>(`/cms/products/${productId}/variant-types`, dto).then((res) => res.data)
}

export function updateVariantType(productId: string, typeId: string, dto: UpdateVariantTypeDto) {
  return cmsClient.patch<VariantType>(`/cms/products/${productId}/variant-types/${typeId}`, dto).then((res) => res.data)
}

export function deleteVariantType(productId: string, typeId: string) {
  return cmsClient.delete(`/cms/products/${productId}/variant-types/${typeId}`)
}

export function listVariantOptions(productId: string, typeId: string) {
  return cmsClient
    .get<VariantOption[]>(`/cms/products/${productId}/variant-types/${typeId}/options`)
    .then((res) => res.data)
}

export function createVariantOption(productId: string, typeId: string, dto: CreateVariantOptionDto) {
  return cmsClient
    .post<VariantOption>(`/cms/products/${productId}/variant-types/${typeId}/options`, dto)
    .then((res) => res.data)
}

export function updateVariantOption(
  productId: string,
  typeId: string,
  optionId: string,
  dto: UpdateVariantOptionDto
) {
  return cmsClient
    .patch<VariantOption>(`/cms/products/${productId}/variant-types/${typeId}/options/${optionId}`, dto)
    .then((res) => res.data)
}

export function deleteVariantOption(productId: string, typeId: string, optionId: string) {
  return cmsClient.delete(`/cms/products/${productId}/variant-types/${typeId}/options/${optionId}`)
}
