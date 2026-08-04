import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { changePassword, getProfile, updateProfile } from '@/services/cms/profile.api'
import { useAuthStore } from '@/stores/auth-store'
import type { ChangePasswordDto, UpdateProfileDto } from '@/types/api/profile.types'

export const profileKeys = {
  all: ['profile'] as const,
}

export function useProfileQuery() {
  return useQuery({ queryKey: profileKeys.all, queryFn: getProfile })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfile(dto),
    onSuccess: (profile) => {
      useAuthStore.getState().setUser(profile)
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => changePassword(dto),
    // A wrong current password is shown inline next to the field, not as a global toast.
    meta: { skipGlobalErrorToast: true },
  })
}
