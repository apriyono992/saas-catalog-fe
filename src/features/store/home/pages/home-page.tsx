import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/error-state'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import {
  useStoreMostClickedProductsQuery,
  useStoreProductsQuery,
} from '@/features/store/catalog/api/catalog.queries'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'
import type { UseQueryResult } from '@tanstack/react-query'
import type { PaginatedResponse } from '@/types/common.types'
import type { ProductListItem } from '@/types/api/store.types'

function ProductSection({
  title,
  query,
}: {
  title: string
  query: UseQueryResult<PaginatedResponse<ProductListItem>>
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </div>
      {query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : (
        <ProductGrid products={query.data?.data ?? []} isLoading={query.isPending} />
      )}
    </section>
  )
}

export default function HomePage() {
  const profileQuery = useStoreProfileQuery()
  const productsQuery = useStoreProductsQuery({ page: 1, limit: 8 })
  const mostClickedQuery = useStoreMostClickedProductsQuery({ page: 1, limit: 8 })

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

      <ProductSection title="New arrivals" query={productsQuery} />
      <ProductSection title="Paling banyak diklik" query={mostClickedQuery} />
    </div>
  )
}
