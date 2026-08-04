import { cmsClient } from '@/services/http/cms-client'
import type { ItemsTotal } from '@/types/common.types'
import type {
  AdminListProductsQuery,
  CreateProductDto,
  Product,
  ProductWithRelations,
  UpdateProductDto,
} from '@/types/api/product.types'

export function listProducts(query: AdminListProductsQuery) {
  return cmsClient.get<ItemsTotal<Product>>('/cms/products', { params: query }).then((res) => res.data)
}

export function getProduct(id: string) {
  return cmsClient.get<ProductWithRelations>(`/cms/products/${id}`).then((res) => res.data)
}

export function createProduct(dto: CreateProductDto) {
  return cmsClient.post<Product>('/cms/products', dto).then((res) => res.data)
}

export function updateProduct(id: string, dto: UpdateProductDto) {
  return cmsClient.patch<Product>(`/cms/products/${id}`, dto).then((res) => res.data)
}

export function deleteProduct(id: string) {
  return cmsClient.delete(`/cms/products/${id}`)
}

export function publishProduct(id: string) {
  return cmsClient.post<Product>(`/cms/products/${id}/publish`).then((res) => res.data)
}

export function archiveProduct(id: string) {
  return cmsClient.post<Product>(`/cms/products/${id}/archive`).then((res) => res.data)
}
