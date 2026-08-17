import { Link } from 'react-router-dom'
import { Heart, ImageOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { formatCurrency } from '@/utils/format-currency'
import { useFavoritesStore } from '@/stores/favorites-store'
import { cn } from '@/lib/utils'
import type { ProductListItem } from '@/types/api/store.types'

// TEMP: placeholder until the API exposes stock data.
function getPlaceholderMeta(id: string) {
  const hash = [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return {
    soldOut: hash % 7 === 0,
  }
}

export function ProductCard({ product }: { product: ProductListItem }) {
  const meta = getPlaceholderMeta(product.id)
  const favorited = useFavoritesStore((s) => s.ids.includes(product.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

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
        {meta.soldOut && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-foreground text-background">Sold out</Badge>
          </div>
        )}
        <button
          type="button"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorited}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={cn('size-4', favorited && 'fill-destructive text-destructive')} />
        </button>
      </Link>
      <CardContent className="space-y-1.5 p-3">
        <Link to={`/products/${product.slug}`} className="block truncate font-medium hover:underline">
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.basePrice)}</p>
      </CardContent>
    </Card>
  )
}
