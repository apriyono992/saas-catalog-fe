import { z } from 'zod'

export const marketplaceLinkSchema = z.object({
  marketplaceName: z.string().min(1, 'Marketplace name is required').max(100, 'Must be 100 characters or fewer'),
  url: z.string().min(1, 'URL is required').max(500, 'Must be 500 characters or fewer').url('Enter a valid URL'),
})

export type MarketplaceLinkFormValues = z.infer<typeof marketplaceLinkSchema>
