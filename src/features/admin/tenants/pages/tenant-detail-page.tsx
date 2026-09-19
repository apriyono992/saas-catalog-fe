import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Globe, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState } from '@/components/common/error-state'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { StatusBadge } from '@/components/common/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  useTenantDomainsQuery,
  useTenantStoreSettingsQuery,
  useTenantsQuery,
  useUpdateTenantMutation,
  useUpdateTenantStoreSettingsMutation,
  useCreateTenantDomainMutation,
  useDeleteTenantDomainMutation,
  useUploadTenantBannerMutation,
  useDeleteTenantBannerMutation,
  useVerifyTenantDomainMutation,
} from '@/features/admin/tenants/api/tenants.queries'
import { AppearanceForm } from '@/features/admin/appearance/components/appearance-form'
import { domainSchema, type DomainFormValues } from '@/features/admin/domains/domain.schema'
import type { PlatformStoreSettings, UpdatePlatformStoreSettingsDto } from '@/types/api/platform.types'
import type { Domain } from '@/types/api/domain.types'

const infoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Must be 255 characters or fewer'),
})
type InfoFormValues = z.infer<typeof infoSchema>

const storeSettingsSchema = z.object({
  description: z.string().optional().or(z.literal('')),
  contactEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().max(50, 'Must be 50 characters or fewer').optional().or(z.literal('')),
  socialInstagram: z.string().max(255, 'Must be 255 characters or fewer').optional().or(z.literal('')),
  socialFacebook: z.string().max(255, 'Must be 255 characters or fewer').optional().or(z.literal('')),
  socialTiktok: z.string().max(255, 'Must be 255 characters or fewer').optional().or(z.literal('')),
  socialWhatsapp: z.string().max(50, 'Must be 50 characters or fewer').optional().or(z.literal('')),
})
type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const tenantsQuery = useTenantsQuery()
  const storeSettingsQuery = useTenantStoreSettingsQuery(id!)
  const domainsQuery = useTenantDomainsQuery(id!)

  const tenant = tenantsQuery.data?.find((t) => t.id === id)
  const isLoading = tenantsQuery.isPending || storeSettingsQuery.isPending || domainsQuery.isPending
  const isError = tenantsQuery.isError || storeSettingsQuery.isError || domainsQuery.isError

  const updateStoreSettingsMutation = useUpdateTenantStoreSettingsMutation(id!)
  const uploadBannerMutation = useUploadTenantBannerMutation(id!)
  const deleteBannerMutation = useDeleteTenantBannerMutation(id!)

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tenants">
            <ArrowLeft className="size-4" />
            Back to tenants
          </Link>
        </Button>
      </div>

      <PageHeader
        title={tenant?.name ?? 'Tenant detail'}
        description="Manage tenant info, domains, and store settings."
      />

      {isLoading ? (
        <Skeleton className="h-96 w-full max-w-xl" />
      ) : isError ? (
        <ErrorState
          onRetry={() => {
            tenantsQuery.refetch()
            storeSettingsQuery.refetch()
            domainsQuery.refetch()
          }}
        />
      ) : (
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="store-settings">Store settings</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="pt-4">
            {tenant && <InfoForm id={id!} name={tenant.name} />}
          </TabsContent>

          <TabsContent value="domains" className="pt-4">
            <DomainsTab id={id!} domains={domainsQuery.data ?? []} />
          </TabsContent>

          <TabsContent value="store-settings" className="pt-4">
            {storeSettingsQuery.data && (
              <StoreSettingsForm id={id!} settings={storeSettingsQuery.data} />
            )}
          </TabsContent>

          <TabsContent value="appearance" className="pt-4">
            {storeSettingsQuery.data && (
              <AppearanceForm
                settings={storeSettingsQuery.data}
                isSaving={updateStoreSettingsMutation.isPending}
                onSave={(values) => {
                  updateStoreSettingsMutation.mutate(values, {
                    onSuccess: () => toast.success('Tampilan toko berhasil disimpan'),
                  })
                }}
                onUploadBanner={(file) => {
                  uploadBannerMutation.mutate(file, {
                    onSuccess: () => toast.success('Banner toko berhasil diunggah'),
                  })
                }}
                isUploadingBanner={uploadBannerMutation.isPending}
                onDeleteBanner={() => {
                  deleteBannerMutation.mutate(undefined, {
                    onSuccess: () => toast.success('Banner toko berhasil dihapus'),
                  })
                }}
                isDeletingBanner={deleteBannerMutation.isPending}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function InfoForm({ id, name }: { id: string; name: string }) {
  const form = useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
    values: { name },
  })
  const updateMutation = useUpdateTenantMutation()

  return (
    <form
      className="max-w-xl"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        updateMutation.mutate(
          { id, dto: values },
          { onSuccess: () => toast.success('Tenant updated') }
        )
      })}
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="detail-tenant-name">Name</FieldLabel>
          <Input
            id="detail-tenant-name"
            aria-invalid={!!form.formState.errors.name}
            {...form.register('name')}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
          {updateMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </FieldGroup>
    </form>
  )
}

function DomainsTab({ id, domains }: { id: string; domains: Domain[] }) {
  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Domain | null>(null)
  const deleteMutation = useDeleteTenantDomainMutation(id)
  const verifyMutation = useVerifyTenantDomainMutation(id)

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
              disabled={verifyMutation.isPending}
              onClick={() =>
                verifyMutation.mutate(row.original.id, {
                  onSuccess: () => toast.success('Domain verified'),
                })
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
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add domain
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={domains}
        isLoading={false}
        emptyState={
          <EmptyState
            icon={Globe}
            title="No domains yet"
            description="Add a custom domain for this tenant."
            action={
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="size-4" />
                Add domain
              </Button>
            }
          />
        }
      />

      <AddDomainDialog tenantId={id} open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Remove "${deleteTarget?.hostname}"?`}
        description="Shoppers visiting this domain will no longer reach this tenant's store."
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

function AddDomainDialog({
  tenantId,
  open,
  onOpenChange,
}: {
  tenantId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: { hostname: '' },
  })
  const createMutation = useCreateTenantDomainMutation(tenantId)

  function onSubmit(values: DomainFormValues) {
    createMutation.mutate(values.hostname, {
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
              <FieldLabel htmlFor="platform-domain-hostname">Hostname</FieldLabel>
              <Input
                id="platform-domain-hostname"
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

function StoreSettingsForm({ id, settings }: { id: string; settings: PlatformStoreSettings }) {
  const form = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    values: {
      description: settings.description ?? '',
      contactEmail: settings.contactEmail ?? '',
      contactPhone: settings.contactPhone ?? '',
      socialInstagram: settings.socialInstagram ?? '',
      socialFacebook: settings.socialFacebook ?? '',
      socialTiktok: settings.socialTiktok ?? '',
      socialWhatsapp: settings.socialWhatsapp ?? '',
    },
  })
  const updateMutation = useUpdateTenantStoreSettingsMutation(id)

  function onSubmit(values: StoreSettingsFormValues) {
    const dto: UpdatePlatformStoreSettingsDto = {
      description: values.description?.trim() || undefined,
      contactEmail: values.contactEmail?.trim() || undefined,
      contactPhone: values.contactPhone?.trim() || undefined,
      socialInstagram: values.socialInstagram?.trim() || undefined,
      socialFacebook: values.socialFacebook?.trim() || undefined,
      socialTiktok: values.socialTiktok?.trim() || undefined,
      socialWhatsapp: values.socialWhatsapp?.trim() || undefined,
    }
    updateMutation.mutate(dto, { onSuccess: () => toast.success('Store settings updated') })
  }

  return (
    <form className="max-w-xl" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="ss-description">Description</FieldLabel>
          <Textarea id="ss-description" rows={4} {...form.register('description')} />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.contactEmail}>
          <FieldLabel htmlFor="ss-contact-email">Contact email</FieldLabel>
          <Input
            id="ss-contact-email"
            type="email"
            aria-invalid={!!form.formState.errors.contactEmail}
            {...form.register('contactEmail')}
          />
          <FieldError errors={[form.formState.errors.contactEmail]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.contactPhone}>
          <FieldLabel htmlFor="ss-contact-phone">Contact phone</FieldLabel>
          <Input id="ss-contact-phone" {...form.register('contactPhone')} />
          <FieldError errors={[form.formState.errors.contactPhone]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.socialInstagram}>
          <FieldLabel htmlFor="ss-instagram">Instagram</FieldLabel>
          <Input
            id="ss-instagram"
            placeholder="https://instagram.com/…"
            {...form.register('socialInstagram')}
          />
          <FieldError errors={[form.formState.errors.socialInstagram]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.socialFacebook}>
          <FieldLabel htmlFor="ss-facebook">Facebook</FieldLabel>
          <Input
            id="ss-facebook"
            placeholder="https://facebook.com/…"
            {...form.register('socialFacebook')}
          />
          <FieldError errors={[form.formState.errors.socialFacebook]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.socialTiktok}>
          <FieldLabel htmlFor="ss-tiktok">TikTok</FieldLabel>
          <Input
            id="ss-tiktok"
            placeholder="https://tiktok.com/@…"
            {...form.register('socialTiktok')}
          />
          <FieldError errors={[form.formState.errors.socialTiktok]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.socialWhatsapp}>
          <FieldLabel htmlFor="ss-whatsapp">WhatsApp</FieldLabel>
          <Input id="ss-whatsapp" placeholder="+62…" {...form.register('socialWhatsapp')} />
          <FieldError errors={[form.formState.errors.socialWhatsapp]} />
        </Field>

        <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
          {updateMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </FieldGroup>
    </form>
  )
}
