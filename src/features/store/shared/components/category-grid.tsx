import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { CategoryCard } from '@/features/store/shared/components/category-card'
import type { CategoryListItem } from '@/types/api/store.types'

interface CategoryGridProps {
  categories: CategoryListItem[]
  isLoading?: boolean
  emptyMessage?: string
}

export function CategoryGrid({ categories, isLoading, emptyMessage = 'No categories found.' }: CategoryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    )
  }
  if (categories.length === 0) return <EmptyState title={emptyMessage} />
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
