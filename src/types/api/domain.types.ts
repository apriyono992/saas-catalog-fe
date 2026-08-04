export interface Domain {
  id: string
  tenantId: string
  hostname: string
  isPrimary: boolean
  verifiedAt: string | null
  createdAt: string
}

export interface CreateDomainDto {
  hostname: string
}
