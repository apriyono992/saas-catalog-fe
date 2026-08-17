import { useQuery } from '@tanstack/react-query'
import { getStoreCategories } from '@/services/store/categories.api'

export const storeCategoryKeys = {
  all: ['store-categories'] as const,
}

export function useStoreCategoriesQuery() {
  return useQuery({
    queryKey: storeCategoryKeys.all,
    queryFn: getStoreCategories,
  })
}
