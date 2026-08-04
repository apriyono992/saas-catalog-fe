import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  activateTenant,
  createTenant,
  listTenants,
  suspendTenant,
  updateTenant,
} from '@/services/cms/platform-tenants.api'
import type { CreateTenantDto, UpdateTenantDto } from '@/types/api/platform.types'

export const tenantKeys = {
  all: ['platform-tenants'] as const,
  list: () => [...tenantKeys.all, 'list'] as const,
}

export function useTenantsQuery() {
  return useQuery({ queryKey: tenantKeys.list(), queryFn: listTenants })
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateTenantDto) => createTenant(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.list() }),
  })
}

export function useUpdateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTenantDto }) => updateTenant(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.list() }),
  })
}

export function useSuspendTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => suspendTenant(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.list() }),
  })
}

export function useActivateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activateTenant(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.list() }),
  })
}
