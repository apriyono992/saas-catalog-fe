import { z } from 'zod'

export const createAdminSchema = z.object({
  tenantId: z.string().min(1, 'Tenant is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type CreateAdminFormValues = z.infer<typeof createAdminSchema>

export const updateAdminSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
})
export type UpdateAdminFormValues = z.infer<typeof updateAdminSchema>

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
