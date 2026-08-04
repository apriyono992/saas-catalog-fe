import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Pencil, Plus, UserX, Users as UsersIcon } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminUserFormDialog } from '@/features/admin/users/components/admin-user-form-dialog'
import { useAdminUsersQuery, useDisableAdminUserMutation } from '@/features/admin/users/api/platform-users.queries'
import { useTenantsQuery } from '@/features/admin/tenants/api/tenants.queries'
import type { AdminProfile } from '@/types/api/platform.types'

const ALL_TENANTS = 'all'

export default function PlatformUsersPage() {
  const [tenantFilter, setTenantFilter] = useState(ALL_TENANTS)
  const tenantsQuery = useTenantsQuery()
  const usersQuery = useAdminUsersQuery(tenantFilter === ALL_TENANTS ? undefined : tenantFilter)
  const disableMutation = useDisableAdminUserMutation()

  const [formState, setFormState] = useState<{ open: boolean; user: AdminProfile | null }>({
    open: false,
    user: null,
  })
  const [disableTarget, setDisableTarget] = useState<AdminProfile | null>(null)

  const tenantNameById = useMemo(
    () => new Map(tenantsQuery.data?.map((tenant) => [tenant.id, tenant.name])),
    [tenantsQuery.data]
  )

  const columns: ColumnDef<AdminProfile>[] = [
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => tenantNameById.get(row.original.tenantId) ?? '—',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) =>
        row.original.isActive ? (
          <StatusBadge label="Active" variant="success" />
        ) : (
          <StatusBadge label="Disabled" variant="destructive" />
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
            aria-label="Edit admin"
            onClick={() => setFormState({ open: true, user: row.original })}
          >
            <Pencil className="size-4" />
          </Button>
          {row.original.isActive && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Disable admin"
              onClick={() => setDisableTarget(row.original)}
            >
              <UserX className="size-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Admin users"
        description="Admin accounts across all tenants."
        action={
          <Button onClick={() => setFormState({ open: true, user: null })}>
            <Plus className="size-4" />
            New admin
          </Button>
        }
      />

      <div className="mb-4">
        <Select value={tenantFilter} onValueChange={setTenantFilter}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TENANTS}>All tenants</SelectItem>
            {tenantsQuery.data?.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                {tenant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {usersQuery.isError ? (
        <ErrorState onRetry={() => usersQuery.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={usersQuery.data ?? []}
          isLoading={usersQuery.isPending}
          emptyState={<EmptyState icon={UsersIcon} title="No admin accounts yet" />}
        />
      )}

      <AdminUserFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        user={formState.user}
      />

      <ConfirmDialog
        open={!!disableTarget}
        onOpenChange={(open) => !open && setDisableTarget(null)}
        title={`Disable "${disableTarget?.email}"?`}
        description="They will no longer be able to log in to the CMS."
        confirmLabel="Disable"
        destructive
        isLoading={disableMutation.isPending}
        onConfirm={() => {
          if (!disableTarget) return
          disableMutation.mutate(disableTarget.id, {
            onSuccess: () => {
              toast.success('Admin disabled')
              setDisableTarget(null)
            },
          })
        }}
      />
    </div>
  )
}
