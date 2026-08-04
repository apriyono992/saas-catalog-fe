import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import { useStoreProductsQuery } from '@/features/store/catalog/api/catalog.queries'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

const PAGE_SIZE = 20

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '')
  const debouncedSearch = useDebouncedValue(search)

  const productsQuery = useStoreProductsQuery({ page, limit: PAGE_SIZE, search: debouncedSearch || undefined })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Catalog</h1>

      <div className="relative mt-6 mb-8 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products…"
          className="pl-8"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {productsQuery.isError ? (
        <ErrorState onRetry={() => productsQuery.refetch()} />
      ) : (
        <>
          <ProductGrid products={productsQuery.data?.data ?? []} isLoading={productsQuery.isPending} />
          <PaginationBar
            page={page}
            totalPages={productsQuery.data?.meta.totalPages ?? 0}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
