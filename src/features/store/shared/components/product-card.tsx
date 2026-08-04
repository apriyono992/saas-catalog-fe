import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { formatCurrency } from '@/utils/format-currency'
import type { ProductListItem } from '@/types/api/store.types'

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="aspect-square bg-muted">
          {product.thumbnailUrl ? (
            <img
              src={resolveAssetUrl(product.thumbnailUrl)}
              alt={product.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-8" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="space-y-1.5 p-3">
        {product.category && (
          <Link to={`/category/${product.category.slug}`}>
            <Badge variant="secondary" className="text-xs hover:bg-secondary/80">
              {product.category.name}
            </Badge>
          </Link>
        )}
        <Link to={`/products/${product.slug}`} className="block truncate font-medium hover:underline">
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.basePrice)}</p>
      </CardContent>
    </Card>
  )
}
