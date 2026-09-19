import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminUser,
  deleteAdminUser,
  disableAdminUser,
  listAdminUsers,
  resetAdminPassword,
  setAdminStatus,
  updateAdminUser,
} from '@/services/cms/platform-users.api'
import type { CreateAdminDto, UpdateAdminDto } from '@/types/api/platform.types'

export const adminUserKeys = {
  all: ['platform-users'] as const,
  list: (tenantId?: string) => [...adminUserKeys.all, 'list', tenantId ?? 'all'] as const,
}

export function useAdminUsersQuery(tenantId?: string) {
  return useQuery({
    queryKey: adminUserKeys.list(tenantId),
    queryFn: () => listAdminUsers(tenantId),
  })
}

export function useCreateAdminUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateAdminDto) => createAdminUser(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAdminDto }) => updateAdminUser(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useResetAdminPasswordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      resetAdminPassword(id, newPassword),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useSetAdminStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setAdminStatus(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useDisableAdminUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => disableAdminUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}
