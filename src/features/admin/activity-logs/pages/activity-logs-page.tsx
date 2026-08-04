import { useState } from 'react'
import { format } from 'date-fns'
import { History, Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/page-header'
import { DataTable } from '@/components/common/data-table'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useActivityLogsQuery } from '@/features/admin/activity-logs/api/activity-logs.queries'
import type { ActivityLog } from '@/types/api/activity-log.types'

const PAGE_SIZE = 20

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1)
  const [metadataTarget, setMetadataTarget] = useState<ActivityLog | null>(null)
  const logsQuery = useActivityLogsQuery({ page, limit: PAGE_SIZE })

  const columns: ColumnDef<ActivityLog>[] = [
    { accessorKey: 'action', header: 'Action', cell: ({ row }) => <Badge variant="secondary">{row.original.action}</Badge> },
    { accessorKey: 'entity', header: 'Entity' },
    { accessorKey: 'user', header: 'User', cell: ({ row }) => row.original.user.email },
    {
      accessorKey: 'createdAt',
      header: 'When',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy HH:mm'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="View details"
            disabled={!row.original.metadata}
            onClick={() => setMetadataTarget(row.original)}
          >
            <Eye className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Activity logs" description="A record of changes made in this store." />

      {logsQuery.isError ? (
        <ErrorState onRetry={() => logsQuery.refetch()} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={logsQuery.data?.items ?? []}
            isLoading={logsQuery.isPending}
            emptyState={<EmptyState icon={History} title="No activity yet" />}
          />
          <PaginationBar
            page={page}
            totalPages={Math.ceil((logsQuery.data?.total ?? 0) / PAGE_SIZE)}
            onPageChange={setPage}
          />
        </>
      )}

      <Dialog open={!!metadataTarget} onOpenChange={(open) => !open && setMetadataTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {metadataTarget?.action} — {metadataTarget?.entity}
            </DialogTitle>
          </DialogHeader>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(metadataTarget?.metadata, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  )
}
