import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { KeyRound, Pencil, Plus, Trash2, Users as UsersIcon } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { AdminUserFormDialog } from '@/features/admin/users/components/admin-user-form-dialog'
import {
  useAdminUsersQuery,
  useDeleteAdminUserMutation,
  useResetAdminPasswordMutation,
  useSetAdminStatusMutation,
} from '@/features/admin/users/api/platform-users.queries'
import { useTenantsQuery } from '@/features/admin/tenants/api/tenants.queries'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/admin/users/user.schema'
import type { AdminProfile } from '@/types/api/platform.types'

const ALL_TENANTS = 'all'

export default function PlatformUsersPage() {
  const [tenantFilter, setTenantFilter] = useState(ALL_TENANTS)
  const tenantsQuery = useTenantsQuery()
  const usersQuery = useAdminUsersQuery(tenantFilter === ALL_TENANTS ? undefined : tenantFilter)
  const setStatusMutation = useSetAdminStatusMutation()
  const deleteMutation = useDeleteAdminUserMutation()

  const [formState, setFormState] = useState<{ open: boolean; user: AdminProfile | null }>({
    open: false,
    user: null,
  })
  const [resetTarget, setResetTarget] = useState<AdminProfile | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProfile | null>(null)

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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.original.isActive}
            disabled={setStatusMutation.isPending}
            onCheckedChange={(checked) =>
              setStatusMutation.mutate(
                { id: row.original.id, isActive: checked },
                {
                  onSuccess: () =>
                    toast.success(checked ? 'Admin activated' : 'Admin disabled'),
                }
              )
            }
          />
          <span className="text-xs text-muted-foreground">
            {row.original.isActive ? 'Active' : 'Disabled'}
          </span>
        </div>
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
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Reset password"
            onClick={() => setResetTarget(row.original)}
          >
            <KeyRound className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete admin"
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

      {resetTarget && (
        <ResetPasswordDialog
          user={resetTarget}
          open={!!resetTarget}
          onOpenChange={(open) => !open && setResetTarget(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.email}"?`}
        description="This user will be soft-deleted and will no longer be able to log in."
        confirmLabel="Delete"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success('Admin deleted')
              setDeleteTarget(null)
            },
          })
        }}
      />
    </div>
  )
}

function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AdminProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })
  const resetMutation = useResetAdminPasswordMutation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPassword, setPendingPassword] = useState('')

  function onValidSubmit(values: ResetPasswordFormValues) {
    setPendingPassword(values.newPassword)
    setConfirmOpen(true)
  }

  function handleConfirmReset() {
    resetMutation.mutate(
      { id: user.id, newPassword: pendingPassword },
      {
        onSuccess: () => {
          toast.success('Password updated')
          setConfirmOpen(false)
          onOpenChange(false)
          form.reset()
        },
      }
    )
  }

  return (
    <>
      <Dialog open={open && !confirmOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password for {user.email}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onValidSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.newPassword}>
                <FieldLabel htmlFor="reset-new-password">New password</FieldLabel>
                <PasswordInput
                  id="reset-new-password"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.newPassword}
                  {...form.register('newPassword')}
                />
                <FieldError errors={[form.formState.errors.newPassword]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.confirmPassword}>
                <FieldLabel htmlFor="reset-confirm-password">Confirm new password</FieldLabel>
                <PasswordInput
                  id="reset-confirm-password"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.confirmPassword}
                  {...form.register('confirmPassword')}
                />
                <FieldError errors={[form.formState.errors.confirmPassword]} />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Ubah</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Yakin ingin diubah?"
        description={`Password untuk "${user.email}" akan langsung diganti dengan password baru.`}
        confirmLabel="Ya, ubah password"
        isLoading={resetMutation.isPending}
        onConfirm={handleConfirmReset}
      />
    </>
  )
}
