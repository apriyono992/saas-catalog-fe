import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCategoriesQuery, useDeleteCategoryMutation } from '@/features/admin/categories/api/categories.queries'
import { CategoryFormDialog } from '@/features/admin/categories/components/category-form-dialog'
import type { Category } from '@/types/api/category.types'

export default function CategoriesPage() {
  const categoriesQuery = useCategoriesQuery()
  const deleteMutation = useDeleteCategoryMutation()

  const [formState, setFormState] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const columns: ColumnDef<Category>[] = [
    { accessorKey: 'name', header: 'Name' },
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
            onClick={() => setFormState({ open: true, category: row.original })}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete category"
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
          <Button onClick={() => setFormState({ open: true, category: null })}>
            <Plus className="size-4" />
            New category
          </Button>
        }
      />

      {categoriesQuery.isError ? (
        <ErrorState onRetry={() => categoriesQuery.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={categoriesQuery.data ?? []}
          isLoading={categoriesQuery.isPending}
          emptyState={
            <EmptyState
              icon={FolderTree}
              title="No categories yet"
              description="Create your first category to start organizing products."
              action={
                <Button size="sm" onClick={() => setFormState({ open: true, category: null })}>
                  <Plus className="size-4" />
                  New category
                </Button>
              }
            />
          }
        />
      )}

      <CategoryFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        category={formState.category}
      />

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
