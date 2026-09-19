import { Link } from 'react-router-dom'
import { Heart, ImageOff, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { formatCurrency } from '@/utils/format-currency'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'
import { cn } from '@/lib/utils'
import type { ProductListItem } from '@/types/api/store.types'

// Placeholder until API exposes stock data
function getPlaceholderMeta(id: string) {
  const hash = [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return {
    soldOut: hash % 7 === 0,
    badge: hash % 5 === 0 ? 'Best Seller' : hash % 3 === 0 ? 'Popular' : null,
  }
}

export function ProductCard({ product }: { product: ProductListItem }) {
  const meta = getPlaceholderMeta(product.id)
  const favorited = useFavoritesStore((s) => s.ids.includes(product.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const profileQuery = useStoreProfileQuery()

  const defaultPct = Number(profileQuery.data?.defaultStrikePercentage ?? 35)

  // Explicit strikePrice, or fallback calculate from store's default percentage
  const effectiveStrikePrice =
    product.strikePrice && Number(product.strikePrice) > 0
      ? product.strikePrice
      : defaultPct > 0 && Number(product.basePrice) > 0
        ? Math.round(Number(product.basePrice) * (1 + defaultPct / 100)).toFixed(2)
        : null

  const hasStrike =
    effectiveStrikePrice &&
    Number(effectiveStrikePrice) > Number(product.basePrice)

  const discountPercent = hasStrike
    ? Math.round(
        ((Number(effectiveStrikePrice) - Number(product.basePrice)) /
          Number(effectiveStrikePrice)) *
          100
      )
    : 0

  return (
    <div className="store-card group relative flex h-full flex-col rounded-2xl border border-border/70 bg-card p-3 sm:p-4 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40">
      {/* Top Image area */}
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden rounded-xl bg-muted/20 aspect-square mb-3">
        {product.thumbnailUrl ? (
          <img
            src={resolveAssetUrl(product.thumbnailUrl)}
            alt={product.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/50">
            <ImageOff className="size-8" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {meta.soldOut ? (
            <Badge className="bg-foreground text-background text-[10px] px-2 py-0.5 font-semibold">
              Sold out
            </Badge>
          ) : hasStrike ? (
            <span className="rounded-md bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 font-bold tracking-wide">
              -{discountPercent}%
            </span>
          ) : meta.badge ? (
            <span className="rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] px-2 py-0.5 font-bold tracking-wide uppercase">
              {meta.badge}
            </span>
          ) : product.category?.name ? (
            <span className="rounded-md bg-muted/90 text-muted-foreground text-[10px] px-2 py-0.5 font-medium">
              {product.category.name}
            </span>
          ) : null}
        </div>

        {/* Favorite toggle */}
        <button
          type="button"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorited}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-background/85 text-foreground shadow-xs backdrop-blur transition-all hover:scale-110 hover:bg-background"
        >
          <Heart className={cn('size-3.5', favorited && 'fill-destructive text-destructive')} />
        </button>
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col justify-between space-y-3">
        <div className="space-y-1">
          <Link
            to={`/products/${product.slug}`}
            className="block text-sm font-semibold tracking-tight text-foreground line-clamp-2 hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-bold text-foreground">
              {formatCurrency(product.basePrice)}
            </span>
            {hasStrike && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(effectiveStrikePrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button styled ala Image 2 */}
        <Link
          to={`/products/${product.slug}`}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs transition-transform active:scale-98 hover:opacity-90"
        >
          Lihat Detail
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
