import { z } from 'zod'

const domainPattern = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i

export const tenantSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255, 'Must be 255 characters or fewer'),
    domain: z
      .string()
      .max(255, 'Must be 255 characters or fewer')
      .regex(domainPattern, 'Enter a valid domain, e.g. tokosaya.com')
      .optional()
      .or(z.literal('')),
    adminEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
    adminPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
    adminPasswordConfirm: z.string().optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    const hasEmail = !!val.adminEmail?.trim()
    const hasPassword = !!val.adminPassword?.trim()

    if (hasEmail && !hasPassword) {
      ctx.addIssue({ code: 'custom', path: ['adminPassword'], message: 'Password is required when email is set' })
    }
    if (hasPassword && !hasEmail) {
      ctx.addIssue({ code: 'custom', path: ['adminEmail'], message: 'Email is required when password is set' })
    }
    if (hasPassword && val.adminPassword !== val.adminPasswordConfirm) {
      ctx.addIssue({ code: 'custom', path: ['adminPasswordConfirm'], message: 'Passwords do not match' })
    }
  })

export type TenantFormValues = z.infer<typeof tenantSchema>
