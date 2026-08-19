import { cmsClient } from '@/services/http/cms-client'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/api/category.types'

export function listCategories() {
  return cmsClient.get<Category[]>('/cms/categories').then((res) => res.data)
}

export function getCategory(id: string) {
  return cmsClient.get<Category>(`/cms/categories/${id}`).then((res) => res.data)
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

export function uploadCategoryImage(id: string, file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData()
  formData.append('file', file)

  return cmsClient
    .post<Category>(`/cms/categories/${id}/image`, formData, {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return
        onProgress(Math.round((event.loaded / event.total) * 100))
      },
    })
    .then((res) => res.data)
}

export function deleteCategoryImage(id: string) {
  return cmsClient.delete(`/cms/categories/${id}/image`)
}
