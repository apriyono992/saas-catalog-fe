import { useQuery } from '@tanstack/react-query'
import { getClicksByMarketplace, getClicksByProduct, getClicksTotal } from '@/services/cms/analytics.api'
import type { AnalyticsDateRangeQuery } from '@/types/api/analytics.types'

export const analyticsKeys = {
  all: ['analytics'] as const,
  total: (query: AnalyticsDateRangeQuery) => [...analyticsKeys.all, 'total', query] as const,
  byProduct: (query: AnalyticsDateRangeQuery) => [...analyticsKeys.all, 'by-product', query] as const,
  byMarketplace: (query: AnalyticsDateRangeQuery) => [...analyticsKeys.all, 'by-marketplace', query] as const,
}

export function useClicksTotalQuery(query: AnalyticsDateRangeQuery) {
  return useQuery({ queryKey: analyticsKeys.total(query), queryFn: () => getClicksTotal(query) })
}

export function useClicksByProductQuery(query: AnalyticsDateRangeQuery) {
  return useQuery({ queryKey: analyticsKeys.byProduct(query), queryFn: () => getClicksByProduct(query) })
}

export function useClicksByMarketplaceQuery(query: AnalyticsDateRangeQuery) {
  return useQuery({ queryKey: analyticsKeys.byMarketplace(query), queryFn: () => getClicksByMarketplace(query) })
}
