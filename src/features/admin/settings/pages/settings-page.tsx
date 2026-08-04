import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  contactSettingsSchema,
  generalSettingsSchema,
  socialSettingsSchema,
  type ContactSettingsFormValues,
  type GeneralSettingsFormValues,
  type SocialSettingsFormValues,
} from '@/features/admin/settings/settings.schema'
import {
  useStoreSettingsQuery,
  useUpdateStoreSettingsContactMutation,
  useUpdateStoreSettingsMutation,
  useUpdateStoreSettingsSocialMutation,
} from '@/features/admin/settings/api/settings.queries'
import type { StoreSettings } from '@/types/api/store-settings.types'

export default function SettingsPage() {
  const settingsQuery = useStoreSettingsQuery()

  return (
    <div>
      <PageHeader title="Store settings" description="Information shown on your public storefront." />

      {settingsQuery.isPending ? (
        <Skeleton className="h-64 w-full max-w-xl" />
      ) : settingsQuery.isError || !settingsQuery.data ? (
        <ErrorState onRetry={() => settingsQuery.refetch()} />
      ) : (
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="pt-4">
            <GeneralSettingsForm settings={settingsQuery.data} />
          </TabsContent>
          <TabsContent value="contact" className="pt-4">
            <ContactSettingsForm settings={settingsQuery.data} />
          </TabsContent>
          <TabsContent value="social" className="pt-4">
            <SocialSettingsForm settings={settingsQuery.data} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function GeneralSettingsForm({ settings }: { settings: StoreSettings }) {
  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    values: { description: settings.description ?? '' },
  })
  const updateMutation = useUpdateStoreSettingsMutation()

  return (
    <form
      className="max-w-xl"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        updateMutation.mutate(values, { onSuccess: () => toast.success('Store description updated') })
      })}
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="settings-description">Description</FieldLabel>
          <Textarea id="settings-description" rows={4} {...form.register('description')} />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>
        <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
          {updateMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </FieldGroup>
    </form>
  )
}

function ContactSettingsForm({ settings }: { settings: StoreSettings }) {
  const form = useForm<ContactSettingsFormValues>({
    resolver: zodResolver(contactSettingsSchema),
    values: { contactEmail: settings.contactEmail ?? '', contactPhone: settings.contactPhone ?? '' },
  })
  const updateMutation = useUpdateStoreSettingsContactMutation()

  return (
    <form
      className="max-w-xl"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        updateMutation.mutate(values, { onSuccess: () => toast.success('Contact info updated') })
      })}
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.contactEmail}>
          <FieldLabel htmlFor="settings-contact-email">Contact email</FieldLabel>
          <Input
            id="settings-contact-email"
            type="email"
            aria-invalid={!!form.formState.errors.contactEmail}
            {...form.register('contactEmail')}
          />
          <FieldError errors={[form.formState.errors.contactEmail]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.contactPhone}>
          <FieldLabel htmlFor="settings-contact-phone">Contact phone</FieldLabel>
          <Input id="settings-contact-phone" {...form.register('contactPhone')} />
          <FieldError errors={[form.formState.errors.contactPhone]} />
        </Field>
        <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
          {updateMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </FieldGroup>
    </form>
  )
}

function SocialSettingsForm({ settings }: { settings: StoreSettings }) {
  const form = useForm<SocialSettingsFormValues>({
    resolver: zodResolver(socialSettingsSchema),
    values: {
      socialInstagram: settings.socialInstagram ?? '',
      socialFacebook: settings.socialFacebook ?? '',
      socialTiktok: settings.socialTiktok ?? '',
      socialWhatsapp: settings.socialWhatsapp ?? '',
    },
  })
  const updateMutation = useUpdateStoreSettingsSocialMutation()

  return (
    <form
      className="max-w-xl"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        updateMutation.mutate(values, { onSuccess: () => toast.success('Social links updated') })
      })}
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.socialInstagram}>
          <FieldLabel htmlFor="settings-instagram">Instagram</FieldLabel>
          <Input id="settings-instagram" placeholder="https://instagram.com/…" {...form.register('socialInstagram')} />
          <FieldError errors={[form.formState.errors.socialInstagram]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.socialFacebook}>
          <FieldLabel htmlFor="settings-facebook">Facebook</FieldLabel>
          <Input id="settings-facebook" placeholder="https://facebook.com/…" {...form.register('socialFacebook')} />
          <FieldError errors={[form.formState.errors.socialFacebook]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.socialTiktok}>
          <FieldLabel htmlFor="settings-tiktok">TikTok</FieldLabel>
          <Input id="settings-tiktok" placeholder="https://tiktok.com/@…" {...form.register('socialTiktok')} />
          <FieldError errors={[form.formState.errors.socialTiktok]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.socialWhatsapp}>
          <FieldLabel htmlFor="settings-whatsapp">WhatsApp</FieldLabel>
          <Input id="settings-whatsapp" placeholder="+62…" {...form.register('socialWhatsapp')} />
          <FieldError errors={[form.formState.errors.socialWhatsapp]} />
        </Field>
        <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
          {updateMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </FieldGroup>
    </form>
  )
}
