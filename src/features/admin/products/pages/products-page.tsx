import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Package, Search, MoreHorizontal, Rocket, Archive } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { formatCurrency } from '@/utils/format-currency'
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
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null)

  const productsQuery = useProductsQuery({
    page,
    limit: 20,
    status: status === 'all' ? undefined : status,
    search: debouncedSearch || undefined,
  })
  const deleteMutation = useDeleteProductMutation()

  const columns: ColumnDef<ProductType>[] = [
    { accessorKey: 'name', header: 'Name' },
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
          <SelectTrigger className="w-40">
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
        description="This can't be undone. Only draft products can be deleted."
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
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Product actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>

          {(product.status === 'draft' || product.status === 'archived') && (
            <DropdownMenuItem
              onClick={() =>
                publishMutation.mutate(undefined, { onSuccess: () => toast.success('Product published') })
              }
            >
              <Rocket className="size-4" />
              Publish
            </DropdownMenuItem>
          )}

          {product.status === 'published' && (
            <DropdownMenuItem
              onClick={() =>
                archiveMutation.mutate(undefined, { onSuccess: () => toast.success('Product archived') })
              }
            >
              <Archive className="size-4" />
              Archive
            </DropdownMenuItem>
          )}

          {product.status === 'draft' && (
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
