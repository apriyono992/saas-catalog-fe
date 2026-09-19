import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPlatformMarketplace,
  deletePlatformMarketplace,
  deletePlatformMarketplaceIcon,
  listMarketplaces,
  listPlatformMarketplaces,
  updatePlatformMarketplace,
  uploadPlatformMarketplaceIcon,
} from '@/services/cms/marketplaces.api'
import type { CreateMarketplaceDto, UpdateMarketplaceDto } from '@/types/api/marketplace.types'

export const marketplaceKeys = {
  all: ['marketplaces'] as const,
  platformList: () => [...marketplaceKeys.all, 'platform-list'] as const,
  list: () => [...marketplaceKeys.all, 'list'] as const,
}

export function usePlatformMarketplacesQuery() {
  return useQuery({
    queryKey: marketplaceKeys.platformList(),
    queryFn: listPlatformMarketplaces,
  })
}

export function useMarketplacesQuery() {
  return useQuery({
    queryKey: marketplaceKeys.list(),
    queryFn: listMarketplaces,
  })
}

export function useCreateMarketplaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateMarketplaceDto) => createPlatformMarketplace(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}

export function useUpdateMarketplaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMarketplaceDto }) =>
      updatePlatformMarketplace(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}

export function useDeleteMarketplaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePlatformMarketplace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}

export function useUploadMarketplaceIconMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadPlatformMarketplaceIcon(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}

export function useDeleteMarketplaceIconMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePlatformMarketplaceIcon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}
