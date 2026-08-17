import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/error-state'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import { CategoryGrid } from '@/features/store/shared/components/category-grid'
import {
  useStorePopularProductsQuery,
  useStoreProductsQuery,
} from '@/features/store/catalog/api/catalog.queries'
import { useStoreCategoriesQuery } from '@/features/store/category/api/categories.queries'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'
import type { CategoryListItem, ProductListItem } from '@/types/api/store.types'

function CategorySection({
  categories,
  isPending,
  isError,
  onRetry,
}: {
  categories: CategoryListItem[]
  isPending: boolean
  isError: boolean
  onRetry: () => void
}) {
  if (!isPending && !isError && categories.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">Kategori</h2>
      {isError ? <ErrorState onRetry={onRetry} /> : <CategoryGrid categories={categories} isLoading={isPending} />}
    </section>
  )
}

function ProductSection({
  title,
  products,
  isPending,
  isError,
  onRetry,
}: {
  title: string
  products: ProductListItem[]
  isPending: boolean
  isError: boolean
  onRetry: () => void
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </div>
      {isError ? <ErrorState onRetry={onRetry} /> : <ProductGrid products={products} isLoading={isPending} />}
    </section>
  )
}

export default function HomePage() {
  const profileQuery = useStoreProfileQuery()
  const productsQuery = useStoreProductsQuery({ page: 1, limit: 8 })
  const popularQuery = useStorePopularProductsQuery(8)
  const categoriesQuery = useStoreCategoriesQuery()

  return (
    <div>
      <section className="border-b border-white/10 bg-[#2d3336] py-16 dark:border-border dark:bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 text-center">
          {profileQuery.isPending ? (
            <Skeleton className="mx-auto h-10 w-80 bg-white/10 dark:bg-muted" />
          ) : (
            <h1 className="text-4xl font-semibold tracking-tight text-white dark:text-foreground">
              {profileQuery.data?.name ?? 'Welcome'}
            </h1>
          )}
          {profileQuery.data?.description && (
            <p className="mx-auto mt-3 max-w-xl text-white/70 dark:text-muted-foreground">
              {profileQuery.data.description}
            </p>
          )}
          <Button asChild className="mt-6">
            <Link to="/catalog">
              Browse catalog
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <CategorySection
        categories={categoriesQuery.data ?? []}
        isPending={categoriesQuery.isPending}
        isError={categoriesQuery.isError}
        onRetry={() => categoriesQuery.refetch()}
      />
      <ProductSection
        title="New arrivals"
        products={productsQuery.data?.data ?? []}
        isPending={productsQuery.isPending}
        isError={productsQuery.isError}
        onRetry={() => productsQuery.refetch()}
      />
      <ProductSection
        title="Paling banyak diklik"
        products={popularQuery.data ?? []}
        isPending={popularQuery.isPending}
        isError={popularQuery.isError}
        onRetry={() => popularQuery.refetch()}
      />
    </div>
  )
}
