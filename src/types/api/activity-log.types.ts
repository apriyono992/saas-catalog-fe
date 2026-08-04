export interface ActivityLog {
  id: string
  tenantId: string
  userId: string
  action: string
  entity: string
  entityId: string
  metadata: Record<string, unknown> | null
  createdAt: string
  user: { id: string; email: string }
}
