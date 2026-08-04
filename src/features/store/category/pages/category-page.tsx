import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import { useStoreProductsQuery } from '@/features/store/catalog/api/catalog.queries'
import { Skeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 20

function titleCase(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState(1)

  const productsQuery = useStoreProductsQuery({ page, limit: PAGE_SIZE, category: slug })
  const categoryName = productsQuery.data?.data[0]?.category?.name ?? (slug ? titleCase(slug) : '')

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/catalog" className="hover:text-foreground">
          Catalog
        </Link>
        <ChevronRight className="size-3.5" />
        {productsQuery.isPending ? <Skeleton className="h-4 w-24" /> : <span>{categoryName}</span>}
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">
        {productsQuery.isPending ? <Skeleton className="h-9 w-48" /> : categoryName}
      </h1>

      <div className="mt-8">
        {productsQuery.isError ? (
          <ErrorState onRetry={() => productsQuery.refetch()} />
        ) : (
          <>
            <ProductGrid
              products={productsQuery.data?.data ?? []}
              isLoading={productsQuery.isPending}
              emptyMessage="No products in this category yet."
            />
            <PaginationBar
              page={page}
              totalPages={productsQuery.data?.meta.totalPages ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  )
}
