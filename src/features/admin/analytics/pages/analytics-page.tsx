import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { MousePointerClick } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { DateRangePicker } from '@/components/common/date-range-picker'
import { EmptyState } from '@/components/common/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  useClicksByMarketplaceQuery,
  useClicksByProductQuery,
  useClicksTotalQuery,
} from '@/features/admin/analytics/api/analytics.queries'

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const query = { from: range?.from?.toISOString(), to: range?.to?.toISOString() }

  const totalQuery = useClicksTotalQuery(query)
  const byProductQuery = useClicksByProductQuery(query)
  const byMarketplaceQuery = useClicksByMarketplaceQuery(query)

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Marketplace link clicks from your storefront."
        action={<DateRangePicker value={range} onChange={setRange} />}
      />

      <Card className="mb-6 max-w-xs">
        <CardHeader>
          <CardDescription>Total clicks</CardDescription>
          <CardTitle className="text-3xl">
            {totalQuery.isPending ? <Skeleton className="h-8 w-16" /> : (totalQuery.data?.total ?? 0)}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clicks by product</CardTitle>
          </CardHeader>
          <CardContent>
            {byProductQuery.isPending ? (
              <Skeleton className="h-40 w-full" />
            ) : byProductQuery.data?.length === 0 ? (
              <EmptyState icon={MousePointerClick} title="No clicks yet" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byProductQuery.data?.map((row) => (
                    <TableRow key={row.productId}>
                      <TableCell>{row.productName}</TableCell>
                      <TableCell className="text-right">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clicks by marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            {byMarketplaceQuery.isPending ? (
              <Skeleton className="h-40 w-full" />
            ) : byMarketplaceQuery.data?.length === 0 ? (
              <EmptyState icon={MousePointerClick} title="No clicks yet" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marketplace</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byMarketplaceQuery.data?.map((row) => (
                    <TableRow key={row.marketplaceName}>
                      <TableCell>{row.marketplaceName}</TableCell>
                      <TableCell className="text-right">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
