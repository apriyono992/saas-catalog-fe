import { cmsClient } from '@/services/http/cms-client'
import type { ChangePasswordDto, Profile, UpdateProfileDto } from '@/types/api/profile.types'

export function getProfile() {
  return cmsClient.get<Profile>('/cms/profile').then((res) => res.data)
}

export function updateProfile(dto: UpdateProfileDto) {
  return cmsClient.patch<Profile>('/cms/profile', dto).then((res) => res.data)
}

export function changePassword(dto: ChangePasswordDto) {
  return cmsClient.post('/cms/profile/change-password', dto)
}
