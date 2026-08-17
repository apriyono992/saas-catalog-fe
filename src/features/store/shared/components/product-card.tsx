import { Link } from 'react-router-dom'
import { ImageOff, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { formatCurrency } from '@/utils/format-currency'
import type { ProductListItem } from '@/types/api/store.types'

const PLACEHOLDER_SWATCHES = ['#1f2937', '#78716c', '#b45309', '#334155', '#7f1d1d']

// TEMP: placeholder until the API exposes stock/rating/variant-color data.
function getPlaceholderMeta(id: string) {
  const hash = [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return {
    isNew: hash % 5 === 0,
    soldOut: hash % 7 === 0,
    rating: (3.5 + (hash % 15) / 10).toFixed(1),
    swatch: PLACEHOLDER_SWATCHES[hash % PLACEHOLDER_SWATCHES.length],
  }
}

export function ProductCard({ product }: { product: ProductListItem }) {
  const meta = getPlaceholderMeta(product.id)

  return (
    <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link to={`/products/${product.slug}`} className="relative block">
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
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {meta.isNew && <Badge className="bg-primary text-primary-foreground">New</Badge>}
          {meta.soldOut && <Badge className="bg-foreground text-background">Sold out</Badge>}
        </div>
      </Link>
      <CardContent className="space-y-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.slug}`} className="truncate font-medium hover:underline">
            {product.name}
          </Link>
          <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {meta.rating}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.basePrice)}</p>
        <span
          className="inline-block size-3.5 rounded-full border border-border"
          style={{ backgroundColor: meta.swatch }}
        />
      </CardContent>
    </Card>
  )
}
