import type { TenantStatus } from '@/types/common.types'

export interface StoreCategoryRef {
  id: string
  name: string
  slug: string
}

export interface StoreProfile {
  name: string
  description: string | null
  contactEmail: string | null
  contactPhone: string | null
  socialInstagram: string | null
  socialFacebook: string | null
  socialTiktok: string | null
  socialWhatsapp: string | null
}

export interface ResolvedTenant {
  tenantId: string
  tenantStatus: TenantStatus
}

export interface ProductListItem {
  id: string
  name: string
  slug: string
  basePrice: string
  thumbnailUrl: string | null
  category: StoreCategoryRef | null
}

export interface ProductVariantTypeView {
  name: string
  options: string[]
}

export interface ProductMarketplaceLinkView {
  id: string
  marketplaceName: string
}

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: string
  images: string[]
  category: StoreCategoryRef | null
  variantTypes: ProductVariantTypeView[]
  marketplaceLinks: ProductMarketplaceLinkView[]
}

export interface StoreProductsQuery {
  page?: number
  limit?: number
  category?: string
  search?: string
}

export interface MarketplaceRedirectResponse {
  url: string
}
