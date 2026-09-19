export interface Marketplace {
  id: string
  name: string
  slug: string
  iconUrl: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMarketplaceDto {
  name: string
  slug?: string
}

export interface UpdateMarketplaceDto {
  name?: string
  slug?: string
}
