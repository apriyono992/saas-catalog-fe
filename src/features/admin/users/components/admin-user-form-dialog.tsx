import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  createAdminSchema,
  updateAdminSchema,
  type CreateAdminFormValues,
  type UpdateAdminFormValues,
} from '@/features/admin/users/user.schema'
import { useCreateAdminUserMutation, useUpdateAdminUserMutation } from '@/features/admin/users/api/platform-users.queries'
import { useTenantsQuery } from '@/features/admin/tenants/api/tenants.queries'
import type { AdminProfile } from '@/types/api/platform.types'

interface AdminUserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: AdminProfile | null
}

export function AdminUserFormDialog({ open, onOpenChange, user }: AdminUserFormDialogProps) {
  const isEditing = !!user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit admin' : 'New admin'}</DialogTitle>
        </DialogHeader>
        {isEditing ? (
          <EditAdminForm user={user} onDone={() => onOpenChange(false)} />
        ) : (
          <CreateAdminForm onDone={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function CreateAdminForm({ onDone }: { onDone: () => void }) {
  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { tenantId: '', email: '', password: '' },
  })
  const tenantsQuery = useTenantsQuery()
  const createMutation = useCreateAdminUserMutation()

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => {
        createMutation.mutate(values, {
          onSuccess: () => {
            toast.success('Admin created')
            onDone()
            form.reset()
          },
        })
      })}
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.tenantId}>
          <FieldLabel htmlFor="admin-tenant">Tenant</FieldLabel>
          <Controller
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="admin-tenant">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenantsQuery.data?.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[form.formState.errors.tenantId]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="admin-email">Email</FieldLabel>
          <Input id="admin-email" type="email" aria-invalid={!!form.formState.errors.email} {...form.register('email')} />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="admin-password">Password</FieldLabel>
          <PasswordInput
            id="admin-password"
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.password}
            {...form.register('password')}
          />
          <FieldError errors={[form.formState.errors.password]} />
        </Field>
      </FieldGroup>
      <DialogFooter className="mt-4">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}

function EditAdminForm({ user, onDone }: { user: AdminProfile; onDone: () => void }) {
  const form = useForm<UpdateAdminFormValues>({
    resolver: zodResolver(updateAdminSchema),
    values: { email: user.email },
  })
  const updateMutation = useUpdateAdminUserMutation()

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => {
        updateMutation.mutate(
          { id: user.id, dto: values },
          {
            onSuccess: () => {
              toast.success('Admin updated')
              onDone()
            },
          }
        )
      })}
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="admin-edit-email">Email</FieldLabel>
          <Input
            id="admin-edit-email"
            type="email"
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
      </FieldGroup>
      <DialogFooter className="mt-4">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}
