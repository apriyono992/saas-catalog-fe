import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  activateTenant,
  createTenant,
  createTenantDomain,
  deleteTenantDomain,
  getTenantStoreSettings,
  listTenantDomains,
  listTenants,
  suspendTenant,
  updateTenant,
  updateTenantStoreSettings,
} from '@/services/cms/platform-tenants.api'
import type { CreateTenantDto, UpdatePlatformStoreSettingsDto, UpdateTenantDto } from '@/types/api/platform.types'

export const tenantKeys = {
  all: ['platform-tenants'] as const,
  list: () => [...tenantKeys.all, 'list'] as const,
  storeSettings: (id: string) => [...tenantKeys.all, 'store-settings', id] as const,
  domains: (id: string) => [...tenantKeys.all, 'domains', id] as const,
}

export function useTenantsQuery() {
  return useQuery({ queryKey: tenantKeys.list(), queryFn: listTenants })
}

export function useTenantStoreSettingsQuery(id: string) {
  return useQuery({
    queryKey: tenantKeys.storeSettings(id),
    queryFn: () => getTenantStoreSettings(id),
  })
}

export function useTenantDomainsQuery(id: string) {
  return useQuery({
    queryKey: tenantKeys.domains(id),
    queryFn: () => listTenantDomains(id),
  })
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

export function useUpdateTenantStoreSettingsMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdatePlatformStoreSettingsDto) => updateTenantStoreSettings(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.storeSettings(id) }),
  })
}

export function useCreateTenantDomainMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (hostname: string) => createTenantDomain(tenantId, hostname),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.domains(tenantId) }),
  })
}

export function useDeleteTenantDomainMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (domainId: string) => deleteTenantDomain(tenantId, domainId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantKeys.domains(tenantId) }),
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
