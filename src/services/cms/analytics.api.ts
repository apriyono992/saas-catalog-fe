import { cmsClient } from '@/services/http/cms-client'
import type {
  AnalyticsDateRangeQuery,
  ClicksByMarketplace,
  ClicksByProduct,
  ClicksTotal,
} from '@/types/api/analytics.types'

export function getClicksTotal(query: AnalyticsDateRangeQuery) {
  return cmsClient.get<ClicksTotal>('/cms/analytics/clicks', { params: query }).then((res) => res.data)
}

export function getClicksByProduct(query: AnalyticsDateRangeQuery) {
  return cmsClient
    .get<ClicksByProduct[]>('/cms/analytics/clicks/by-product', { params: query })
    .then((res) => res.data)
}

export function getClicksByMarketplace(query: AnalyticsDateRangeQuery) {
  return cmsClient
    .get<ClicksByMarketplace[]>('/cms/analytics/clicks/by-marketplace', { params: query })
    .then((res) => res.data)
}
