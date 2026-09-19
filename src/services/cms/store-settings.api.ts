import { cmsClient } from '@/services/http/cms-client'
import type {
  StoreSettings,
  UpdateStoreSettingsAppearanceDto,
  UpdateStoreSettingsContactDto,
  UpdateStoreSettingsDto,
  UpdateStoreSettingsSocialDto,
} from '@/types/api/store-settings.types'

export function getStoreSettings() {
  return cmsClient.get<StoreSettings>('/cms/store-settings').then((res) => res.data)
}

export function updateStoreSettings(dto: UpdateStoreSettingsDto) {
  return cmsClient.patch<StoreSettings>('/cms/store-settings', dto).then((res) => res.data)
}

export function updateStoreSettingsContact(dto: UpdateStoreSettingsContactDto) {
  return cmsClient.patch<StoreSettings>('/cms/store-settings/contact', dto).then((res) => res.data)
}

export function updateStoreSettingsSocial(dto: UpdateStoreSettingsSocialDto) {
  return cmsClient.patch<StoreSettings>('/cms/store-settings/social', dto).then((res) => res.data)
}

export function updateStoreSettingsAppearance(dto: UpdateStoreSettingsAppearanceDto) {
  return cmsClient.patch<StoreSettings>('/cms/store-settings/appearance', dto).then((res) => res.data)
}

export function uploadStoreBanner(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return cmsClient
    .post<StoreSettings>('/cms/store-settings/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export function deleteStoreBanner() {
  return cmsClient.delete('/cms/store-settings/banner')
}
