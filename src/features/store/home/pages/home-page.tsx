import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/error-state'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import { useStoreProductsQuery } from '@/features/store/catalog/api/catalog.queries'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'

export default function HomePage() {
  const profileQuery = useStoreProfileQuery()
  const productsQuery = useStoreProductsQuery({ page: 1, limit: 8 })

  return (
    <div>
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          {profileQuery.isPending ? (
            <Skeleton className="mx-auto h-10 w-80" />
          ) : (
            <h1 className="text-4xl font-semibold tracking-tight">{profileQuery.data?.name ?? 'Welcome'}</h1>
          )}
          {profileQuery.data?.description && (
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{profileQuery.data.description}</p>
          )}
          <Button asChild className="mt-6">
            <Link to="/catalog">
              Browse catalog
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">New arrivals</h2>
          <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        {productsQuery.isError ? (
          <ErrorState onRetry={() => productsQuery.refetch()} />
        ) : (
          <ProductGrid products={productsQuery.data?.data ?? []} isLoading={productsQuery.isPending} />
        )}
      </section>
    </div>
  )
}
