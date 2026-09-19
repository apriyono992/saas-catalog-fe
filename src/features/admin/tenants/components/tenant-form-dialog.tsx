import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
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
    values: {
      name: tenant?.name ?? '',
      domain: '',
      adminEmail: '',
      adminPassword: '',
      adminPasswordConfirm: '',
    },
  })
  const createMutation = useCreateTenantMutation()
  const updateMutation = useUpdateTenantMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  function onSubmit(values: TenantFormValues) {
    if (isEditing) {
      const dto = {
        name: values.name,
        domain: values.domain?.trim() || undefined,
      }
      updateMutation.mutate(
        { id: tenant.id, dto },
        {
          onSuccess: () => {
            toast.success('Tenant updated')
            onOpenChange(false)
          },
        }
      )
    } else {
      const dto = {
        name: values.name,
        domain: values.domain?.trim() || undefined,
        adminEmail: values.adminEmail?.trim() || undefined,
        adminPassword: values.adminPassword?.trim() || undefined,
      }
      createMutation.mutate(dto, {
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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

            <Field data-invalid={!!form.formState.errors.domain}>
              <FieldLabel htmlFor="tenant-domain">
                Domain <span className="text-muted-foreground font-normal">(optional)</span>
              </FieldLabel>
              <Input
                id="tenant-domain"
                placeholder="tokosaya.com"
                aria-invalid={!!form.formState.errors.domain}
                {...form.register('domain')}
              />
              <FieldError errors={[form.formState.errors.domain]} />
              {isEditing && (
                <FieldDescription>Adding a domain here will create a new domain entry for this tenant.</FieldDescription>
              )}
            </Field>

            {!isEditing && (
              <>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">
                    Admin account <span className="text-muted-foreground font-normal">(optional)</span>
                  </p>
                </div>

                <Field data-invalid={!!form.formState.errors.adminEmail}>
                  <FieldLabel htmlFor="tenant-admin-email">Email</FieldLabel>
                  <Input
                    id="tenant-admin-email"
                    type="email"
                    placeholder="admin@tokosaya.com"
                    aria-invalid={!!form.formState.errors.adminEmail}
                    {...form.register('adminEmail')}
                  />
                  <FieldError errors={[form.formState.errors.adminEmail]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.adminPassword}>
                  <FieldLabel htmlFor="tenant-admin-password">Password</FieldLabel>
                  <PasswordInput
                    id="tenant-admin-password"
                    aria-invalid={!!form.formState.errors.adminPassword}
                    {...form.register('adminPassword')}
                  />
                  <FieldError errors={[form.formState.errors.adminPassword]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.adminPasswordConfirm}>
                  <FieldLabel htmlFor="tenant-admin-password-confirm">Confirm password</FieldLabel>
                  <PasswordInput
                    id="tenant-admin-password-confirm"
                    aria-invalid={!!form.formState.errors.adminPasswordConfirm}
                    {...form.register('adminPasswordConfirm')}
                  />
                  <FieldError errors={[form.formState.errors.adminPasswordConfirm]} />
                </Field>
              </>
            )}
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
