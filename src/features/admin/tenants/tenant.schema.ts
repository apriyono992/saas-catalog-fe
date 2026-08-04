import { z } from 'zod'

export const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Must be 255 characters or fewer'),
})

export type TenantFormValues = z.infer<typeof tenantSchema>
