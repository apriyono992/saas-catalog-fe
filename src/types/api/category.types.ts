export interface Category {
  id: string
  tenantId: string
  name: string
  slug: string
  imageUrl: string | null
  parentId: string | null
  productCount?: number
  parent?: { id: string; name: string; slug: string } | null
  children?: Category[]
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  slug?: string
  parentId?: string | null
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>
