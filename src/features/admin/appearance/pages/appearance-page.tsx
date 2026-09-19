import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useDeleteStoreBannerMutation,
  useStoreSettingsQuery,
  useUpdateStoreSettingsAppearanceMutation,
  useUploadStoreBannerMutation,
} from '@/features/admin/settings/api/settings.queries'
import { AppearanceForm } from '../components/appearance-form'

export default function AppearancePage() {
  const settingsQuery = useStoreSettingsQuery()
  const updateAppearanceMutation = useUpdateStoreSettingsAppearanceMutation()
  const uploadBannerMutation = useUploadStoreBannerMutation()
  const deleteBannerMutation = useDeleteStoreBannerMutation()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tampilan Toko (Appearance)"
        description="Atur warna tema website, banner utama, dan tombol storefront Anda."
      />

      {settingsQuery.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : settingsQuery.isError || !settingsQuery.data ? (
        <ErrorState onRetry={() => settingsQuery.refetch()} />
      ) : (
        <AppearanceForm
          settings={settingsQuery.data}
          isSaving={updateAppearanceMutation.isPending}
          onSave={(values) => {
            updateAppearanceMutation.mutate(values, {
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
    </div>
  )
}
