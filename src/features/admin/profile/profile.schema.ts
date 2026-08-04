import { z } from 'zod'

export const updateProfileSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
})
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
