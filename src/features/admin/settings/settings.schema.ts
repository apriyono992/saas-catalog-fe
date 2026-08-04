import { z } from 'zod'

export const generalSettingsSchema = z.object({
  description: z.string().optional().or(z.literal('')),
})
export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>

export const contactSettingsSchema = z.object({
  contactEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().max(50, 'Must be 50 characters or fewer').optional().or(z.literal('')),
})
export type ContactSettingsFormValues = z.infer<typeof contactSettingsSchema>

export const socialSettingsSchema = z.object({
  socialInstagram: z.string().max(255, 'Must be 255 characters or fewer').optional().or(z.literal('')),
  socialFacebook: z.string().max(255, 'Must be 255 characters or fewer').optional().or(z.literal('')),
  socialTiktok: z.string().max(255, 'Must be 255 characters or fewer').optional().or(z.literal('')),
  socialWhatsapp: z.string().max(50, 'Must be 50 characters or fewer').optional().or(z.literal('')),
})
export type SocialSettingsFormValues = z.infer<typeof socialSettingsSchema>
