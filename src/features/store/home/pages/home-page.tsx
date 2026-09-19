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
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import type { CategoryListItem, ProductListItem } from '@/types/api/store.types'

function CategorySection({
  title,
  categories,
  isPending,
  isError,
  onRetry,
}: {
  title: string
  categories: CategoryListItem[]
  isPending: boolean
  isError: boolean
  onRetry: () => void
}) {
  if (!isPending && !isError && categories.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="store-card-section rounded-3xl border border-border/60 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-8 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pilih kategori untuk melihat koleksi produk terbaik kami
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit self-start sm:self-auto gap-1">
            <Link to="/categories">
              Semua Kategori
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        {isError ? <ErrorState onRetry={onRetry} /> : <CategoryGrid categories={categories.slice(0, 8)} isLoading={isPending} />}
      </div>
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
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="store-card-section rounded-3xl border border-border/60 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-8 shadow-2xs transition-colors">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          <Link to="/catalog" className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Lihat semua
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {isError ? <ErrorState onRetry={onRetry} /> : <ProductGrid products={products} isLoading={isPending} />}
      </div>
    </section>
  )
}

export default function HomePage() {
  const profileQuery = useStoreProfileQuery()
  const productsQuery = useStoreProductsQuery({ page: 1, limit: 8 })
  const popularQuery = useStorePopularProductsQuery(8)
  const categoriesQuery = useStoreCategoriesQuery(true)

  return (
    <div>
      {profileQuery.data?.bannerUrl ? (
        <section className="relative border-b border-border overflow-hidden">
          <div className="relative w-full h-72 sm:h-96">
            <img
              src={resolveAssetUrl(profileQuery.data.bannerUrl)}
              alt={profileQuery.data.name ?? 'Store Banner'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
              <div className="mx-auto max-w-4xl px-4 text-center text-white">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                  {profileQuery.data.name ?? 'Welcome'}
                </h1>
                {profileQuery.data.description && (
                  <p className="mx-auto mt-3 max-w-xl text-white/90 text-sm sm:text-base drop-shadow-xs">
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
            </div>
          </div>
        </section>
      ) : (
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
      )}

      <CategorySection
        title={profileQuery.data?.categoryTitle || 'Kategori'}
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
