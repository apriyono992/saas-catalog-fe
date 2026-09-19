import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, FolderTree } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import { CategoryGrid } from '@/features/store/shared/components/category-grid'
import { useStoreProductsQuery } from '@/features/store/catalog/api/catalog.queries'
import { useStoreCategoryDetailQuery } from '@/features/store/category/api/categories.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const PAGE_SIZE = 20

function titleCase(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState(1)

  const categoryDetailQuery = useStoreCategoryDetailQuery(slug)
  const productsQuery = useStoreProductsQuery({ page, limit: PAGE_SIZE, category: slug })

  const category = categoryDetailQuery.data
  const categoryName = category?.name ?? (slug ? titleCase(slug) : 'Kategori')

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs Navigation with Full Ancestors Chain */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <Link to="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
        <Link to="/categories" className="hover:text-foreground transition-colors">
          Semua Kategori
        </Link>

        {category?.ancestors?.map((anc) => (
          <div key={anc.id} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
            <Link
              to={`/category/${anc.slug}`}
              className="hover:text-foreground transition-colors truncate max-w-[140px]"
            >
              {anc.name}
            </Link>
          </div>
        ))}

        <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
        <span className="font-semibold text-foreground truncate max-w-[180px]">
          {categoryDetailQuery.isPending ? 'Memuat…' : categoryName}
        </span>
      </nav>

      {/* Category Header Card */}
      <div className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-8 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FolderTree className="size-4" />
              </span>
              {category?.depth && (
                <Badge variant="outline" className="text-[10px] font-mono">
                  Level {category.depth} of 5
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              {categoryDetailQuery.isPending ? <Skeleton className="h-10 w-64" /> : categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {productsQuery.data?.meta.total !== undefined
                ? `${productsQuery.data.meta.total} produk ditemukan dalam kategori ini`
                : 'Menampilkan produk dan subkategori'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {typeof category?.productCount === 'number' && (
              <Badge variant="outline" className="w-fit h-auto py-1 px-3 text-xs font-semibold text-primary">
                {category.productCount} Total Produk
              </Badge>
            )}
            {category?.children && category.children.length > 0 && (
              <Badge variant="secondary" className="w-fit h-auto py-1 px-3 text-xs">
                {category.children.length} Subkategori
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Subcategories Section (if any children exist) */}
      {category?.children && category.children.length > 0 && (
        <section className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-8 shadow-2xs transition-colors space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Pilih Subkategori {categoryName}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pilih subkategori di bawah ini untuk melihat produk yang lebih spesifik.
            </p>
          </div>

          <CategoryGrid
            categories={category.children.map((c) => ({
              ...c,
              parentId: category.id,
            }))}
            isLoading={false}
          />
        </section>
      )}

      {/* Products in this Category */}
      <section className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-8 shadow-2xs transition-colors space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Koleksi Produk {categoryName}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar produk yang tersedia di kategori ini dan seluruh subkategorinya.
          </p>
        </div>

        {productsQuery.isError ? (
          <ErrorState onRetry={() => productsQuery.refetch()} />
        ) : (
          <>
            <ProductGrid
              products={productsQuery.data?.data ?? []}
              isLoading={productsQuery.isPending}
              emptyMessage={`Belum ada produk di kategori ${categoryName}.`}
            />
            <PaginationBar
              page={page}
              totalPages={productsQuery.data?.meta.totalPages ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  )
}
