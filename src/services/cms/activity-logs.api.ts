import { cmsClient } from '@/services/http/cms-client'
import type { ItemsTotal, PaginationQuery } from '@/types/common.types'
import type { ActivityLog } from '@/types/api/activity-log.types'

export function listActivityLogs(query: PaginationQuery) {
  return cmsClient.get<ItemsTotal<ActivityLog>>('/cms/activity-logs', { params: query }).then((res) => res.data)
}
