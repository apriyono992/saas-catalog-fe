import { z } from 'zod'

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(150, 'Name must be 150 characters or fewer'),
  slug: z
    .string()
    .max(160, 'Slug must be 160 characters or fewer')
    .regex(slugPattern, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
