import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Globe, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { domainSchema, type DomainFormValues } from '@/features/admin/domains/domain.schema'
import {
  useCreateDomainMutation,
  useDeleteDomainMutation,
  useDomainsQuery,
  useVerifyDomainMutation,
} from '@/features/admin/domains/api/domains.queries'
import type { Domain } from '@/types/api/domain.types'

export default function DomainsPage() {
  const domainsQuery = useDomainsQuery()
  const verifyMutation = useVerifyDomainMutation()
  const deleteMutation = useDeleteDomainMutation()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Domain | null>(null)

  const columns: ColumnDef<Domain>[] = [
    {
      accessorKey: 'hostname',
      header: 'Hostname',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.hostname}
          {row.original.isPrimary && <Badge variant="secondary">Primary</Badge>}
        </div>
      ),
    },
    {
      accessorKey: 'verifiedAt',
      header: 'Status',
      cell: ({ row }) =>
        row.original.verifiedAt ? (
          <StatusBadge label="Verified" variant="success" />
        ) : (
          <StatusBadge label="Pending" variant="warning" />
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Added',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          {!row.original.verifiedAt && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Verify domain"
              onClick={() =>
                verifyMutation.mutate(row.original.id, { onSuccess: () => toast.success('Domain verified') })
              }
            >
              <ShieldCheck className="size-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete domain"
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
        title="Domains"
        description="Custom domains that resolve to your store."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Add domain
          </Button>
        }
      />

      {domainsQuery.isError ? (
        <ErrorState onRetry={() => domainsQuery.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={domainsQuery.data ?? []}
          isLoading={domainsQuery.isPending}
          emptyState={
            <EmptyState
              icon={Globe}
              title="No domains yet"
              description="Add a custom domain so shoppers can reach your store."
              action={
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="size-4" />
                  Add domain
                </Button>
              }
            />
          }
        />
      )}

      <DomainFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Remove "${deleteTarget?.hostname}"?`}
        description="Shoppers visiting this domain will no longer reach your store."
        confirmLabel="Remove"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success('Domain removed')
              setDeleteTarget(null)
            },
          })
        }}
      />
    </div>
  )
}

function DomainFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<DomainFormValues>({ resolver: zodResolver(domainSchema), defaultValues: { hostname: '' } })
  const createMutation = useCreateDomainMutation()

  function onSubmit(values: DomainFormValues) {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Domain added')
        onOpenChange(false)
        form.reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add domain</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.hostname}>
              <FieldLabel htmlFor="domain-hostname">Hostname</FieldLabel>
              <Input
                id="domain-hostname"
                placeholder="tokosaya.com"
                aria-invalid={!!form.formState.errors.hostname}
                {...form.register('hostname')}
              />
              <FieldError errors={[form.formState.errors.hostname]} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
