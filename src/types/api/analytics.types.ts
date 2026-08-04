export interface AnalyticsDateRangeQuery {
  from?: string
  to?: string
}

export interface ClicksTotal {
  total: number
}

export interface ClicksByProduct {
  productId: string
  productName: string
  productSlug: string
  count: number
}

export interface ClicksByMarketplace {
  marketplaceName: string
  count: number
}
