import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listActivityLogs } from '@/services/cms/activity-logs.api'
import type { PaginationQuery } from '@/types/common.types'

export const activityLogKeys = {
  all: ['activity-logs'] as const,
  list: (query: PaginationQuery) => [...activityLogKeys.all, 'list', query] as const,
}

export function useActivityLogsQuery(query: PaginationQuery) {
  return useQuery({
    queryKey: activityLogKeys.list(query),
    queryFn: () => listActivityLogs(query),
    placeholderData: keepPreviousData,
  })
}
