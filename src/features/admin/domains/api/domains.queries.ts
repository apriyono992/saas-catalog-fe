import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDomain, deleteDomain, listDomains, verifyDomain } from '@/services/cms/domains.api'
import type { CreateDomainDto } from '@/types/api/domain.types'

export const domainKeys = {
  all: ['domains'] as const,
  list: () => [...domainKeys.all, 'list'] as const,
}

export function useDomainsQuery() {
  return useQuery({
    queryKey: domainKeys.list(),
    queryFn: listDomains,
  })
}

export function useCreateDomainMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateDomainDto) => createDomain(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: domainKeys.list() }),
  })
}

export function useVerifyDomainMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => verifyDomain(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: domainKeys.list() }),
  })
}

export function useDeleteDomainMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDomain(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: domainKeys.list() }),
  })
}
