import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ProductCard } from '@/features/store/shared/components/product-card'
import type { ProductListItem } from '@/types/api/store.types'

interface ProductGridProps {
  products: ProductListItem[]
  isLoading?: boolean
  emptyMessage?: string
}

export function ProductGrid({ products, isLoading, emptyMessage = 'No products found.' }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <EmptyState title={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
