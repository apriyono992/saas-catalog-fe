export interface StoreSettings {
  id: string
  tenantId: string
  description: string | null
  contactEmail: string | null
  contactPhone: string | null
  socialInstagram: string | null
  socialFacebook: string | null
  socialTiktok: string | null
  socialWhatsapp: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateStoreSettingsDto {
  description?: string
}

export interface UpdateStoreSettingsContactDto {
  contactEmail?: string
  contactPhone?: string
}

export interface UpdateStoreSettingsSocialDto {
  socialInstagram?: string
  socialFacebook?: string
  socialTiktok?: string
  socialWhatsapp?: string
}
