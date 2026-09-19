import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Package, Search, Rocket, Archive } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { PaginationBar } from '@/components/common/pagination-bar'
import { StatusBadge, type StatusVariant } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { formatCurrency } from '@/utils/format-currency'
import { useCategoriesQuery } from '@/features/admin/categories/api/categories.queries'
import {
  useArchiveProductMutation,
  useDeleteProductMutation,
  usePublishProductMutation,
  useProductsQuery,
} from '@/features/admin/products/api/products.queries'
import type { Product as ProductType } from '@/types/api/product.types'
import type { ProductStatus } from '@/types/common.types'

const STATUS_VARIANT: Record<ProductStatus, StatusVariant> = {
  draft: 'muted',
  published: 'success',
  archived: 'warning',
}

const STATUS_OPTIONS: { value: ProductStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export default function ProductsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<ProductStatus | 'all'>('all')
  const [categoryId, setCategoryId] = useState<string>('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null)

  const categoriesQuery = useCategoriesQuery()
  const categories = categoriesQuery.data ?? []
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  function getDepth(cat: (typeof categories)[0]): number {
    let d = 0
    let curr = cat.parentId ? categoryMap.get(cat.parentId) : null
    while (curr && d < 10) {
      d++
      curr = curr.parentId ? categoryMap.get(curr.parentId) : null
    }
    return d
  }

  const productsQuery = useProductsQuery({
    page,
    limit: 20,
    status: status === 'all' ? undefined : status,
    categoryId: categoryId === 'all' ? undefined : categoryId,
    search: debouncedSearch || undefined,
  })
  const deleteMutation = useDeleteProductMutation()

  const columns: ColumnDef<ProductType>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const catId = row.original.categoryId
        const cat = catId ? categoryMap.get(catId) : null
        return cat ? (
          <span className="text-xs font-medium text-foreground">{cat.name}</span>
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        )
      },
    },
    { accessorKey: 'slug', header: 'Slug' },
    {
      accessorKey: 'basePrice',
      header: 'Price',
      cell: ({ row }) => formatCurrency(row.original.basePrice),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge label={row.original.status} variant={STATUS_VARIANT[row.original.status]} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <ProductRowActions product={row.original} onDelete={() => setDeleteTarget(row.original)} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog."
        action={
          <Button onClick={() => navigate('/products/new')}>
            <Plus className="size-4" />
            New product
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
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

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as ProductStatus | 'all')
            setPage(1)
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryId}
          onValueChange={(value) => {
            setCategoryId(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => {
              const depth = getDepth(cat)
              return (
                <SelectItem key={cat.id} value={cat.id}>
                  {depth > 0 ? `${'— '.repeat(depth)}↳ ` : ''}
                  {cat.name}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {productsQuery.isError ? (
        <ErrorState onRetry={() => productsQuery.refetch()} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={productsQuery.data?.items ?? []}
            isLoading={productsQuery.isPending}
            emptyState={
              <EmptyState
                icon={Package}
                title="No products yet"
                description="Create your first product to start building your catalog."
                action={
                  <Button size="sm" onClick={() => navigate('/products/new')}>
                    <Plus className="size-4" />
                    New product
                  </Button>
                }
              />
            }
          />
          <PaginationBar
            page={page}
            totalPages={Math.ceil((productsQuery.data?.total ?? 0) / 20)}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="Produk yang dihapus tidak akan ditampilkan lagi di katalog dan etalase."
        confirmLabel="Delete"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success('Product deleted')
              setDeleteTarget(null)
            },
          })
        }}
      />
    </div>
  )
}

function ProductRowActions({ product, onDelete }: { product: ProductType; onDelete: () => void }) {
  const navigate = useNavigate()
  const publishMutation = usePublishProductMutation(product.id)
  const archiveMutation = useArchiveProductMutation(product.id)

  return (
    <div className="flex justify-end gap-1">
      {product.status === 'published' ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Archive product"
          title="Arsipkan produk"
          disabled={archiveMutation.isPending}
          onClick={() =>
            archiveMutation.mutate(undefined, {
              onSuccess: () => toast.success('Produk diarsipkan'),
            })
          }
        >
          <Archive className="size-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Publish product"
          title="Publikasikan produk"
          disabled={publishMutation.isPending}
          onClick={() =>
            publishMutation.mutate(undefined, {
              onSuccess: () => toast.success('Produk dipublikasikan'),
            })
          }
        >
          <Rocket className="size-4" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit product"
        title="Edit produk"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <Pencil className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete product"
        title="Hapus produk"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
