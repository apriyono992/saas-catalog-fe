import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getStoreSettings,
  updateStoreSettings,
  updateStoreSettingsContact,
  updateStoreSettingsSocial,
} from '@/services/cms/store-settings.api'
import type {
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
