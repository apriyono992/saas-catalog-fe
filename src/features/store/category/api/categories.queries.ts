import { useQuery } from '@tanstack/react-query'
import { getStoreCategories, getStoreCategoryDetail } from '@/services/store/categories.api'

export const storeCategoryKeys = {
  all: ['store-categories'] as const,
  list: (rootOnly?: boolean) => [...storeCategoryKeys.all, 'list', { rootOnly }] as const,
  detail: (slug: string) => [...storeCategoryKeys.all, 'detail', slug] as const,
}

export function useStoreCategoriesQuery(rootOnly?: boolean) {
  return useQuery({
    queryKey: storeCategoryKeys.list(rootOnly),
    queryFn: () => getStoreCategories(rootOnly),
  })
}

export function useStoreCategoryDetailQuery(slug: string | undefined) {
  return useQuery({
    queryKey: storeCategoryKeys.detail(slug ?? ''),
    queryFn: () => getStoreCategoryDetail(slug!),
    enabled: !!slug,
  })
}
