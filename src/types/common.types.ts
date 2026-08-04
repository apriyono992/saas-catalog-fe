export type Role = 'admin' | 'superadmin'
export type TenantStatus = 'active' | 'suspended'
export type ProductStatus = 'draft' | 'published' | 'archived'

export interface ApiErrorShape {
  statusCode: number
  message: string | string[]
  path: string
  timestamp: string
}

export interface PaginationQuery {
  page?: number
  limit?: number
}

/** Shape used by list endpoints that return `{ items, total }`. */
export interface ItemsTotal<T> {
  items: T[]
  total: number
}

/** Shape used by the storefront product listing: `{ data, meta }`. */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
