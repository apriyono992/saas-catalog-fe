import { z } from 'zod'

const hexColorPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const appearanceSchema = z.object({
  navbarColor: z
    .string()
    .regex(hexColorPattern, 'Gunakan format hex color valid, contoh: #2d3336')
    .optional()
    .or(z.literal('')),
  buttonColor: z
    .string()
    .regex(hexColorPattern, 'Gunakan format hex color valid, contoh: #2563eb')
    .optional()
    .or(z.literal('')),
  buttonTextColor: z
    .string()
    .regex(hexColorPattern, 'Gunakan format hex color valid, contoh: #ffffff')
    .optional()
    .or(z.literal('')),
  categoryTitle: z
    .string()
    .max(255, 'Maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
  cardColor: z
    .string()
    .regex(hexColorPattern, 'Gunakan format hex color valid, contoh: #ffffff')
    .optional()
    .or(z.literal('')),
  cardSectionColor: z
    .string()
    .regex(hexColorPattern, 'Gunakan format hex color valid, contoh: #fbf8f5')
    .optional()
    .or(z.literal('')),
  defaultStrikePercentage: z
    .string()
    .regex(/^\d{1,3}$/, 'Masukkan persentase yang valid (0-100)')
    .optional()
    .or(z.literal('')),
})

export type AppearanceFormValues = z.infer<typeof appearanceSchema>
