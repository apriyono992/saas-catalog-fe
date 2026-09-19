import type { TenantStatus } from '@/types/common.types'

export interface StoreCategoryRef {
  id: string
  name: string
  slug: string
}

export interface CategoryListItem {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  parentId: string | null
  childrenCount?: number
}

export interface StoreCategoryDetail {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  parentId: string | null
  depth: number
  ancestors: { id: string; name: string; slug: string }[]
  children: { id: string; name: string; slug: string; imageUrl: string | null }[]
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
  bannerUrl: string | null
  navbarColor: string | null
  buttonColor: string | null
  buttonTextColor: string | null
  categoryTitle: string | null
  cardColor: string | null
  cardSectionColor: string | null
  defaultStrikePercentage: string | null
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
  strikePrice: string | null
  thumbnailUrl: string | null
  category: StoreCategoryRef | null
}

export interface PopularProduct extends ProductListItem {
  clickCount: number
}

export interface ProductVariantTypeView {
  name: string
  options: string[]
}

export interface ProductMarketplaceLinkView {
  id: string
  marketplaceName: string
  iconUrl: string | null
}

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: string
  strikePrice: string | null
  images: string[]
  category: StoreCategoryRef | null
  categories: StoreCategoryRef[]
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
