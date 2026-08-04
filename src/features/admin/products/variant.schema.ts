import { z } from 'zod'

export const variantTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
})

export type VariantTypeFormValues = z.infer<typeof variantTypeSchema>

export const variantOptionSchema = z.object({
  value: z.string().min(1, 'Value is required').max(100, 'Value must be 100 characters or fewer'),
})

export type VariantOptionFormValues = z.infer<typeof variantOptionSchema>
