import type { ProductStatus } from '@/types/common.types'
import type { StoreCategoryRef } from '@/types/api/store.types'

export interface Product {
  id: string
  tenantId: string
  categoryId: string | null
  name: string
  slug: string
  description: string | null
  basePrice: string | null
  strikePrice: string | null
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  sortOrder: number
  createdAt: string
}

export interface VariantType {
  id: string
  productId: string
  name: string
  sortOrder: number
}

export interface VariantOption {
  id: string
  variantTypeId: string
  value: string
  sortOrder: number
}

export interface MarketplaceLink {
  id: string
  productId: string
  marketplaceId?: string | null
  marketplaceName: string
  url: string
  sortOrder: number
  createdAt: string
  marketplace?: {
    id: string
    name: string
    slug: string
    iconUrl: string | null
  } | null
}

/** `GET /cms/products/:id` shape — includes nested relations. */
export interface ProductWithRelations extends Product {
  images: ProductImage[]
  category: StoreCategoryRef | null
  productCategories?: { category: StoreCategoryRef }[]
  categories?: StoreCategoryRef[]
  variantTypes: (VariantType & { options: VariantOption[] })[]
  marketplaceLinks: MarketplaceLink[]
}

export interface AdminListProductsQuery {
  page?: number
  limit?: number
  status?: ProductStatus
  search?: string
  categoryId?: string
}

export interface CreateProductDto {
  name: string
  slug?: string
  description?: string
  categoryId?: string
  categoryIds?: string[]
  basePrice?: string
  strikePrice?: string
}

export type UpdateProductDto = Partial<CreateProductDto>

export interface ReorderImagesDto {
  imageIds: string[]
}

export interface CreateVariantTypeDto {
  name: string
}

export interface UpdateVariantTypeDto {
  name?: string
  sortOrder?: number
}

export interface CreateVariantOptionDto {
  value: string
}

export interface UpdateVariantOptionDto {
  value?: string
  sortOrder?: number
}

export interface CreateMarketplaceLinkDto {
  marketplaceId?: string
  marketplaceName: string
  url: string
}

export interface UpdateMarketplaceLinkDto {
  marketplaceId?: string
  marketplaceName?: string
  url?: string
}
