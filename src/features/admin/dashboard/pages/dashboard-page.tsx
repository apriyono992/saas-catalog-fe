import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { MousePointerClick, Package, FolderTree, Globe } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useClicksTotalQuery, useClicksByProductQuery } from '@/features/admin/analytics/api/analytics.queries'
import { useActivityLogsQuery } from '@/features/admin/activity-logs/api/activity-logs.queries'

export default function DashboardPage() {
  const totalQuery = useClicksTotalQuery({})
  const byProductQuery = useClicksByProductQuery({})
  const activityQuery = useActivityLogsQuery({ page: 1, limit: 5 })

  const topProduct = byProductQuery.data?.[0]

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your store." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <MousePointerClick className="size-4" />
              Total marketplace clicks
            </CardDescription>
            <CardTitle className="text-3xl">
              {totalQuery.isPending ? <Skeleton className="h-8 w-16" /> : (totalQuery.data?.total ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Package className="size-4" />
              Top product by clicks
            </CardDescription>
            <CardTitle className="truncate text-lg">
              {byProductQuery.isPending ? <Skeleton className="h-6 w-32" /> : (topProduct?.productName ?? '—')}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardContent className="flex flex-wrap gap-2 pt-6">
            <Link to="/products" className="flex-1">
              <Badge variant="secondary" className="w-full justify-center py-1.5">
                <Package className="size-3.5" />
                Products
              </Badge>
            </Link>
            <Link to="/categories" className="flex-1">
              <Badge variant="secondary" className="w-full justify-center py-1.5">
                <FolderTree className="size-3.5" />
                Categories
              </Badge>
            </Link>
            <Link to="/domains" className="flex-1">
              <Badge variant="secondary" className="w-full justify-center py-1.5">
                <Globe className="size-3.5" />
                Domains
              </Badge>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityQuery.isPending ? (
            <Skeleton className="h-32 w-full" />
          ) : activityQuery.data?.items.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <ul className="divide-y divide-border">
              {activityQuery.data?.items.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{log.user.email}</span>{' '}
                    <span className="text-muted-foreground">
                      {log.action} · {log.entity}
                    </span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {format(new Date(log.createdAt), 'MMM d, HH:mm')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
