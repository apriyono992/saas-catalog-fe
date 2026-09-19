import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Globe, Pencil, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import {
  useDeleteMarketplaceMutation,
  usePlatformMarketplacesQuery,
} from '../api/marketplaces.queries'
import { MarketplaceFormDialog } from '../components/marketplace-form-dialog'
import type { Marketplace } from '@/types/api/marketplace.types'

export default function PlatformMarketplacesPage() {
  const marketplacesQuery = usePlatformMarketplacesQuery()
  const deleteMutation = useDeleteMarketplaceMutation()

  const [formState, setFormState] = useState<{ open: boolean; marketplace: Marketplace | null }>({
    open: false,
    marketplace: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<Marketplace | null>(null)

  const columns: ColumnDef<Marketplace>[] = [
    {
      id: 'icon',
      header: 'Icon',
      cell: ({ row }) => {
        const m = row.original
        const isOther = m.slug === 'other'
        return (
          <div className="size-10 rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden p-1 shadow-2xs">
            {m.iconUrl ? (
              <img
                src={resolveAssetUrl(m.iconUrl)}
                alt={m.name}
                className="size-full object-contain"
              />
            ) : isOther ? (
              <Globe className="size-5 text-primary" />
            ) : (
              <ShoppingBag className="size-5 text-muted-foreground" />
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{row.original.name}</span>
          {row.original.isDefault && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              System
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Dibuat',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const m = row.original
        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Edit marketplace"
              onClick={() => setFormState({ open: true, marketplace: m })}
            >
              <Pencil className="size-4" />
            </Button>
            {!m.isDefault && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete marketplace"
                onClick={() => setDeleteTarget(m)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Marketplace"
        description="Kelola daftar platform marketplace dan icon yang tersedia untuk seluruh toko."
        action={
          <Button onClick={() => setFormState({ open: true, marketplace: null })}>
            <Plus className="size-4" />
            Tambah Marketplace
          </Button>
        }
      />

      {marketplacesQuery.isError ? (
        <ErrorState onRetry={() => marketplacesQuery.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={marketplacesQuery.data ?? []}
          isLoading={marketplacesQuery.isPending}
          emptyState={
            <EmptyState
              icon={ShoppingBag}
              title="Belum ada master marketplace"
              description="Tambahkan marketplace seperti Tokopedia, Shopee, atau platform lainnya."
              action={
                <Button size="sm" onClick={() => setFormState({ open: true, marketplace: null })}>
                  <Plus className="size-4" />
                  Tambah Marketplace
                </Button>
              }
            />
          }
        />
      )}

      <MarketplaceFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        marketplace={formState.marketplace}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Hapus "${deleteTarget?.name}"?`}
        description="Marketplace ini akan dihapus dari daftar opsi master marketplace platform."
        confirmLabel="Hapus"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success('Marketplace dihapus')
              setDeleteTarget(null)
            },
          })
        }}
      />
    </div>
  )
}
