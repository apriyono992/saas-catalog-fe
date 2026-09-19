import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteStoreBanner,
  getStoreSettings,
  updateStoreSettings,
  updateStoreSettingsAppearance,
  updateStoreSettingsContact,
  updateStoreSettingsSocial,
  uploadStoreBanner,
} from '@/services/cms/store-settings.api'
import type {
  UpdateStoreSettingsAppearanceDto,
  UpdateStoreSettingsContactDto,
  UpdateStoreSettingsDto,
  UpdateStoreSettingsSocialDto,
} from '@/types/api/store-settings.types'

export const storeSettingsKeys = {
  all: ['store-settings'] as const,
}

export function useStoreSettingsQuery() {
  return useQuery({ queryKey: storeSettingsKeys.all, queryFn: getStoreSettings })
}

export function useUpdateStoreSettingsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateStoreSettingsDto) => updateStoreSettings(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeSettingsKeys.all }),
  })
}

export function useUpdateStoreSettingsContactMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateStoreSettingsContactDto) => updateStoreSettingsContact(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeSettingsKeys.all }),
  })
}

export function useUpdateStoreSettingsSocialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateStoreSettingsSocialDto) => updateStoreSettingsSocial(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeSettingsKeys.all }),
  })
}

export function useUpdateStoreSettingsAppearanceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateStoreSettingsAppearanceDto) => updateStoreSettingsAppearance(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeSettingsKeys.all }),
  })
}

export function useUploadStoreBannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadStoreBanner(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeSettingsKeys.all }),
  })
}

export function useDeleteStoreBannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteStoreBanner(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeSettingsKeys.all }),
  })
}

