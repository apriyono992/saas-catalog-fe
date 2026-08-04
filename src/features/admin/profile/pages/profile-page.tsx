import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState } from '@/components/common/error-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordFormValues,
  type UpdateProfileFormValues,
} from '@/features/admin/profile/profile.schema'
import {
  useChangePasswordMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} from '@/features/admin/profile/api/profile.queries'
import { getApiErrorMessage } from '@/services/http/error'
import type { Profile } from '@/types/api/profile.types'

export default function ProfilePage() {
  const profileQuery = useProfileQuery()

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Profile" description="Manage your account." />

      {profileQuery.isPending ? (
        <Skeleton className="h-48 w-full" />
      ) : profileQuery.isError || !profileQuery.data ? (
        <ErrorState onRetry={() => profileQuery.refetch()} />
      ) : (
        <>
          <AccountCard profile={profileQuery.data} />
          <ChangePasswordCard />
        </>
      )}
    </div>
  )
}

function AccountCard({ profile }: { profile: Profile }) {
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: { email: profile.email },
  })
  const updateMutation = useUpdateProfileMutation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          <Badge variant="secondary" className="capitalize">
            {profile.role}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={form.handleSubmit((values) => {
            updateMutation.mutate(values, { onSuccess: () => toast.success('Email updated') })
          })}
        >
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input
                id="profile-email"
                type="email"
                aria-invalid={!!form.formState.errors.email}
                {...form.register('email')}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>
            <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
              {updateMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ChangePasswordCard() {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  })
  const changePasswordMutation = useChangePasswordMutation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={form.handleSubmit((values) => {
            changePasswordMutation.mutate(values, {
              onSuccess: () => {
                toast.success('Password changed')
                form.reset()
              },
            })
          })}
        >
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.currentPassword}>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!form.formState.errors.currentPassword}
                {...form.register('currentPassword')}
              />
              <FieldError errors={[form.formState.errors.currentPassword]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.newPassword}>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!form.formState.errors.newPassword}
                {...form.register('newPassword')}
              />
              <FieldError errors={[form.formState.errors.newPassword]} />
              {changePasswordMutation.isError && (
                <FieldError>{getApiErrorMessage(changePasswordMutation.error)}</FieldError>
              )}
            </Field>
            <Button type="submit" disabled={changePasswordMutation.isPending} className="w-fit">
              {changePasswordMutation.isPending ? 'Saving…' : 'Change password'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
