import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Building2, Plus, Ban, CheckCircle2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { TenantFormDialog } from '@/features/admin/tenants/components/tenant-form-dialog'
import {
  useActivateTenantMutation,
  useSuspendTenantMutation,
  useTenantsQuery,
} from '@/features/admin/tenants/api/tenants.queries'
import type { Tenant } from '@/types/api/platform.types'

export default function TenantsPage() {
  const tenantsQuery = useTenantsQuery()
  const suspendMutation = useSuspendTenantMutation()
  const activateMutation = useActivateTenantMutation()
  const navigate = useNavigate()

  const [formState, setFormState] = useState<{ open: boolean; tenant: Tenant | null }>({
    open: false,
    tenant: null,
  })
  const [suspendTarget, setSuspendTarget] = useState<Tenant | null>(null)

  const columns: ColumnDef<Tenant>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          label={row.original.status}
          variant={row.original.status === 'active' ? 'success' : 'destructive'}
        />
      ),
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
            aria-label="Tenant settings"
            onClick={() => navigate(`/tenants/${row.original.id}`)}
          >
            <Eye className="size-4" />
          </Button>
          {row.original.status === 'active' ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Suspend tenant"
              onClick={() => setSuspendTarget(row.original)}
            >
              <Ban className="size-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Activate tenant"
              onClick={() =>
                activateMutation.mutate(row.original.id, { onSuccess: () => toast.success('Tenant activated') })
              }
            >
              <CheckCircle2 className="size-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Tenants"
        description="All stores on this platform."
        action={
          <Button onClick={() => setFormState({ open: true, tenant: null })}>
            <Plus className="size-4" />
            New tenant
          </Button>
        }
      />

      {tenantsQuery.isError ? (
        <ErrorState onRetry={() => tenantsQuery.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={tenantsQuery.data ?? []}
          isLoading={tenantsQuery.isPending}
          emptyState={
            <EmptyState
              icon={Building2}
              title="No tenants yet"
              description="Create the first tenant to start onboarding stores."
              action={
                <Button size="sm" onClick={() => setFormState({ open: true, tenant: null })}>
                  <Plus className="size-4" />
                  New tenant
                </Button>
              }
            />
          }
        />
      )}

      <TenantFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        tenant={formState.tenant}
      />

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title={`Suspend "${suspendTarget?.name}"?`}
        description="Their storefront and CMS access will stop working until reactivated."
        confirmLabel="Suspend"
        destructive
        isLoading={suspendMutation.isPending}
        onConfirm={() => {
          if (!suspendTarget) return
          suspendMutation.mutate(suspendTarget.id, {
            onSuccess: () => {
              toast.success('Tenant suspended')
              setSuspendTarget(null)
            },
          })
        }}
      />
    </div>
  )
}
