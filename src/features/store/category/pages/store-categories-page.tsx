import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, FolderTree, ImageOff } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useStoreCategoriesQuery } from '@/features/store/category/api/categories.queries'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import type { CategoryListItem } from '@/types/api/store.types'

interface CategoryNode extends CategoryListItem {
  children: CategoryNode[]
}

export default function StoreCategoriesPage() {
  const categoriesQuery = useStoreCategoriesQuery(false) // fetch all categories

  const categoryTree = useMemo<CategoryNode[]>(() => {
    if (!categoriesQuery.data) return []

    const all = categoriesQuery.data
    const map = new Map<string, CategoryNode>()

    for (const c of all) {
      map.set(c.id, { ...c, children: [] })
    }

    const roots: CategoryNode[] = []

    for (const c of all) {
      const node = map.get(c.id)!
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(node)
      } else {
        roots.push(node)
      }
    }

    return roots
  }, [categoriesQuery.data])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Semua Kategori</span>
      </nav>

      {/* Header Banner Section */}
      <div className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-10 shadow-2xs transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FolderTree className="size-5" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Jelajahi Semua Kategori
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Temukan produk berdasarkan kategori utama dan subkategori sesuai kebutuhan Anda.
        </p>
      </div>

      {categoriesQuery.isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : categoriesQuery.isError ? (
        <ErrorState onRetry={() => categoriesQuery.refetch()} />
      ) : categoryTree.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          Belum ada kategori yang tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryTree.map((root) => (
            <div
              key={root.id}
              className="store-card rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-2xs transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Root category info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-16 rounded-xl bg-[#f6f2eb] dark:bg-muted/50 p-2 flex items-center justify-center shrink-0 overflow-hidden border">
                    {root.imageUrl ? (
                      <img
                        src={resolveAssetUrl(root.imageUrl)}
                        alt={root.name}
                        className="size-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageOff className="size-6 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/category/${root.slug}`}
                      className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {root.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {root.children.length > 0
                        ? `${root.children.length} subkategori tersedia`
                        : 'Kategori utama'}
                    </p>
                  </div>
                </div>

                {/* Subcategories (Level 2+) */}
                {root.children.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Subkategori
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {root.children.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/category/${sub.slug}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-border/80 bg-muted/40 hover:bg-muted hover:border-primary/50 text-foreground transition-all"
                        >
                          <span>{sub.name}</span>
                          {sub.children.length > 0 && (
                            <Badge variant="secondary" className="size-4 p-0 flex items-center justify-center text-[9px] rounded-full">
                              {sub.children.length}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View all products link */}
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/category/${root.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Lihat Produk di {root.name}
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
