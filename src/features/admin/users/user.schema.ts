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
