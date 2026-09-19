import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, FolderTree, Image as ImageIcon, Search, ChevronRight, X } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCategoriesQuery, useDeleteCategoryMutation } from '@/features/admin/categories/api/categories.queries'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/api/category.types'

interface CategoryTreeNode extends Category {
  childrenNodes: CategoryTreeNode[]
}

interface FlattenedCategory extends Category {
  depth: number
  hasChildren: boolean
  childrenCount: number
  isExpanded: boolean
}

function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const map = new Map<string, CategoryTreeNode>()
  categories.forEach((c) => {
    map.set(c.id, { ...c, childrenNodes: [] })
  })

  const roots: CategoryTreeNode[] = []
  categories.forEach((c) => {
    const node = map.get(c.id)!
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.childrenNodes.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

function nodeOrDescendantsMatch(node: CategoryTreeNode, search: string): boolean {
  if (node.name.toLowerCase().includes(search)) return true
  return node.childrenNodes.some((child) => nodeOrDescendantsMatch(child, search))
}

export default function CategoriesPage() {
  const navigate = useNavigate()
  const categoriesQuery = useCategoriesQuery()
  const deleteMutation = useDeleteCategoryMutation()

  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const categories = categoriesQuery.data ?? []
  const categoriesById = useMemo(
    () => new Map<string, Category>(categories.map((c) => [c.id, c])),
    [categories]
  )

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function expandAll() {
    const allParentIds = new Set<string>()
    categories.forEach((c) => {
      if (c.parentId) allParentIds.add(c.parentId)
    })
    setExpandedIds(allParentIds)
  }

  function collapseAll() {
    setExpandedIds(new Set())
  }

  const visibleCategories = useMemo<FlattenedCategory[]>(() => {
    const searchTrimmed = search.toLowerCase().trim()
    const result: FlattenedCategory[] = []

    function traverse(node: CategoryTreeNode, depth: number) {
      if (searchTrimmed && !nodeOrDescendantsMatch(node, searchTrimmed)) {
        return
      }

      const hasChildren = node.childrenNodes.length > 0
      const isExpanded = searchTrimmed ? true : expandedIds.has(node.id)

      result.push({
        ...node,
        depth,
        hasChildren,
        childrenCount: node.childrenNodes.length,
        isExpanded,
      })

      if (hasChildren && isExpanded) {
        node.childrenNodes.forEach((child) => traverse(child, depth + 1))
      }
    }

    categoryTree.forEach((root) => traverse(root, 0))
    return result
  }, [categoryTree, expandedIds, search])

  const columns: ColumnDef<FlattenedCategory>[] = [
    {
      id: 'image',
      header: '',
      cell: ({ row }) =>
        row.original.imageUrl ? (
          <img
            src={resolveAssetUrl(row.original.imageUrl)}
            alt=""
            className="size-8 rounded-lg object-cover border"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground border">
            <ImageIcon className="size-4" />
          </div>
        ),
    },
    {
      accessorKey: 'name',
      header: 'Nama Kategori',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div
            className="flex items-center gap-1.5 font-medium"
            style={{ paddingLeft: `${item.depth * 20}px` }}
          >
            {item.hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-muted text-muted-foreground transition-transform cursor-pointer"
                title={item.isExpanded ? 'Tutup subkategori' : 'Buka subkategori'}
              >
                <ChevronRight
                  className={cn(
                    'size-3.5 transition-transform duration-150',
                    item.isExpanded && 'rotate-90'
                  )}
                />
              </button>
            ) : item.depth > 0 ? (
              <span className="text-muted-foreground/60 font-mono ml-1 text-xs">↳</span>
            ) : (
              <span className="size-5 shrink-0" />
            )}

            <span>{item.name}</span>

            {item.hasChildren && !search && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 text-muted-foreground font-normal">
                {item.childrenCount} sub
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: 'parent',
      header: 'Hierarki / Induk',
      cell: ({ row }) => {
        const parentId = row.original.parentId
        if (!parentId) {
          return (
            <Badge variant="outline" className="text-[11px] font-semibold text-primary">
              Kategori Utama
            </Badge>
          )
        }
        const parent = categoriesById.get(parentId)
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Subkategori:</span>
            <strong className="text-foreground font-semibold">{parent?.name ?? 'Induk'}</strong>
          </div>
        )
      },
    },
    {
      id: 'productCount',
      header: 'Total Produk',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs font-semibold">
          {row.original.productCount ?? 0} Produk
        </Badge>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => <Badge variant="secondary">{row.original.slug}</Badge>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit category"
            title="Edit kategori"
            onClick={() => navigate(`/categories/${row.original.id}`)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete category"
            title="Hapus kategori"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteTarget(row.original)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your products into categories."
        action={
          <Button onClick={() => navigate('/categories/new')}>
            <Plus className="size-4" />
            New category
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari kategori…"
            className="pl-8 pr-7"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {!search && categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={expandAll}
            >
              Buka Semua
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={collapseAll}
            >
              Tutup Semua
            </Button>
          </div>
        )}
      </div>

      {categoriesQuery.isError ? (
        <ErrorState onRetry={() => categoriesQuery.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={visibleCategories}
          isLoading={categoriesQuery.isPending}
          emptyState={
            <EmptyState
              icon={FolderTree}
              title={search ? 'Kategori tidak ditemukan' : 'No categories yet'}
              description={
                search
                  ? `Tidak ada kategori yang cocok dengan "${search}".`
                  : 'Create your first category to start organizing products.'
              }
              action={
                !search ? (
                  <Button size="sm" onClick={() => navigate('/categories/new')}>
                    <Plus className="size-4" />
                    New category
                  </Button>
                ) : undefined
              }
            />
          }
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This can't be undone. Products in this category will become uncategorized."
        confirmLabel="Delete"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success('Category deleted')
              setDeleteTarget(null)
            },
          })
        }}
      />
    </div>
  )
}
