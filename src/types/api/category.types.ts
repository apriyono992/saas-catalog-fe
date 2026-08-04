export interface Category {
  id: string
  tenantId: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  slug?: string
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>
