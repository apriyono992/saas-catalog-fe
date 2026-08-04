import { z } from 'zod'

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/
const pricePattern = /^\d+(\.\d{1,2})?$/

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or fewer'),
  slug: z
    .string()
    .max(280, 'Slug must be 280 characters or fewer')
    .regex(slugPattern, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  categoryId: z.string().optional(),
  basePrice: z
    .string()
    .regex(pricePattern, 'Enter a valid price, e.g. 150000 or 150000.50')
    .optional()
    .or(z.literal('')),
})

export type ProductFormValues = z.infer<typeof productSchema>
