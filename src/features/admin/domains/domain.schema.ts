import { z } from 'zod'

const domainPattern = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i

export const domainSchema = z.object({
  hostname: z
    .string()
    .min(1, 'Hostname is required')
    .max(255, 'Must be 255 characters or fewer')
    .regex(domainPattern, 'Enter a valid domain, e.g. tokosaya.com'),
})

export type DomainFormValues = z.infer<typeof domainSchema>
