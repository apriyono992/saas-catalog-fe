import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { tenantSchema, type TenantFormValues } from '@/features/admin/tenants/tenant.schema'
import { useCreateTenantMutation, useUpdateTenantMutation } from '@/features/admin/tenants/api/tenants.queries'
import type { Tenant } from '@/types/api/platform.types'

interface TenantFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant?: Tenant | null
}

export function TenantFormDialog({ open, onOpenChange, tenant }: TenantFormDialogProps) {
  const isEditing = !!tenant
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    values: { name: tenant?.name ?? '' },
  })
  const createMutation = useCreateTenantMutation()
  const updateMutation = useUpdateTenantMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  function onSubmit(values: TenantFormValues) {
    if (isEditing) {
      updateMutation.mutate(
        { id: tenant.id, dto: values },
        {
          onSuccess: () => {
            toast.success('Tenant updated')
            onOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success('Tenant created')
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit tenant' : 'New tenant'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="tenant-name">Name</FieldLabel>
              <Input id="tenant-name" aria-invalid={!!form.formState.errors.name} {...form.register('name')} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
