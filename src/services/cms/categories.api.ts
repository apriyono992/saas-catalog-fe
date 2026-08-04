import { cmsClient } from '@/services/http/cms-client'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/api/category.types'

export function listCategories() {
  return cmsClient.get<Category[]>('/cms/categories').then((res) => res.data)
}

export function createCategory(dto: CreateCategoryDto) {
  return cmsClient.post<Category>('/cms/categories', dto).then((res) => res.data)
}

export function updateCategory(id: string, dto: UpdateCategoryDto) {
  return cmsClient.patch<Category>(`/cms/categories/${id}`, dto).then((res) => res.data)
}

export function deleteCategory(id: string) {
  return cmsClient.delete(`/cms/categories/${id}`)
}
