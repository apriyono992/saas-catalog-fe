import { z } from 'zod'

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const marketplaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Must be 100 characters or fewer'),
  slug: z
    .string()
    .max(100, 'Must be 100 characters or fewer')
    .regex(slugPattern, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
})

export type MarketplaceFormValues = z.infer<typeof marketplaceSchema>
