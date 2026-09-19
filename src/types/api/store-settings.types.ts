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
  bannerUrl: string | null
  navbarColor: string | null
  buttonColor: string | null
  buttonTextColor: string | null
  categoryTitle: string | null
  cardColor: string | null
  cardSectionColor: string | null
  defaultStrikePercentage: string | null
  storageDriver?: 'local' | 's3' | null
  s3Endpoint?: string | null
  s3Region?: string | null
  s3Bucket?: string | null
  s3AccessKeyId?: string | null
  s3SecretAccessKey?: string | null
  hasS3SecretAccessKey?: boolean
  s3PublicUrlBase?: string | null
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

export interface UpdateStoreSettingsAppearanceDto {
  navbarColor?: string
  buttonColor?: string
  buttonTextColor?: string
  bannerUrl?: string
  categoryTitle?: string
  cardColor?: string
  cardSectionColor?: string
  defaultStrikePercentage?: string
}
