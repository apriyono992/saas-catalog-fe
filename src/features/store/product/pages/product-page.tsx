import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Globe,
  Heart,
  ImageOff,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import {
  useMarketplaceRedirectMutation,
  useRelatedProductsQuery,
  useStoreProductQuery,
} from '@/features/store/product/api/product.queries'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { formatCurrency } from '@/utils/format-currency'
import { getApiErrorMessage } from '@/services/http/error'
import { useFavoritesStore } from '@/stores/favorites-store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const productQuery = useStoreProductQuery(slug)
  const relatedQuery = useRelatedProductsQuery(slug)
  const redirectMutation = useMarketplaceRedirectMutation()
  const profileQuery = useStoreProfileQuery()
  const [activeImage, setActiveImage] = useState(0)

  const favorited = useFavoritesStore((s) => (productQuery.data ? s.ids.includes(productQuery.data.id) : false))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  if (productQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    )
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <ErrorState onRetry={() => productQuery.refetch()} />
      </div>
    )
  }

  const product = productQuery.data
  const defaultPct = Number(profileQuery.data?.defaultStrikePercentage ?? 35)

  const effectiveStrikePrice =
    product.strikePrice && Number(product.strikePrice) > 0
      ? product.strikePrice
      : defaultPct > 0 && product.basePrice && Number(product.basePrice) > 0
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

  function handleMarketplaceClick(linkId: string) {
    redirectMutation.mutate(linkId, {
      onSuccess: ({ url }) => {
        window.open(url, '_blank', 'noopener,noreferrer')
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error))
      },
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 space-y-10">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <Link to="/catalog" className="hover:text-foreground transition-colors">
          Katalog
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <Link
              to={`/category/${product.category.slug}`}
              className="hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-none"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground truncate max-w-[160px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Section Card Wrapper */}
      <div className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-5 sm:p-8 lg:p-10 shadow-2xs transition-colors">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Image Gallery Card */}
          <div className="lg:col-span-6">
            <div className="store-card rounded-2xl border border-border/70 bg-card p-3 sm:p-4 shadow-xs">
              {/* Main Image Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/20 flex items-center justify-center group">
                {product.images.length > 0 ? (
                  <img
                    src={resolveAssetUrl(product.images[activeImage])}
                    alt={product.name}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground/50">
                    <ImageOff className="size-16" />
                  </div>
                )}

                {/* Discount Badge */}
                {hasStrike && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="rounded-lg bg-destructive text-destructive-foreground text-xs px-2.5 py-1 font-bold shadow-xs">
                      Hemat {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="mt-3.5 flex gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={cn(
                        'size-16 sm:size-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all p-0.5 bg-muted/20',
                        index === activeImage
                          ? 'border-primary ring-2 ring-primary/20 scale-102'
                          : 'border-border/80 opacity-70 hover:opacity-100'
                      )}
                    >
                      <img
                        src={resolveAssetUrl(image)}
                        alt=""
                        className="size-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Details & Buying Options Card */}
          <div className="lg:col-span-6">
            <div className="store-card rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
              {/* Category tag & Wishlist Button */}
              <div className="flex items-center justify-between gap-3">
                {product.category ? (
                  <Link to={`/category/${product.category.slug}`}>
                    <Badge variant="secondary" className="hover:bg-muted font-medium text-xs">
                      {product.category.name}
                    </Badge>
                  </Link>
                ) : (
                  <span />
                )}
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                  aria-pressed={favorited}
                  onClick={() => toggleFavorite(product.id)}
                  className="size-9 rounded-full shrink-0 shadow-2xs hover:scale-105 transition-transform"
                >
                  <Heart
                    className={cn('size-4 transition-colors', favorited && 'fill-destructive text-destructive')}
                  />
                </Button>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Highlight Box */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                  {formatCurrency(product.basePrice)}
                </span>
                {hasStrike && (
                  <>
                    <span className="text-base text-muted-foreground line-through font-normal">
                      {formatCurrency(effectiveStrikePrice!)}
                    </span>
                    <span className="rounded-md bg-destructive text-destructive-foreground text-xs px-2 py-0.5 font-bold shadow-2xs">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Deskripsi Produk
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Variants */}
              {product.variantTypes.length > 0 && (
                <div className="space-y-3.5 pt-2 border-t border-border/60">
                  {product.variantTypes.map((variantType) => (
                    <div key={variantType.name} className="space-y-2">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        {variantType.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variantType.options.map((option) => (
                          <span
                            key={option}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border border-border bg-background hover:border-primary/50 transition-colors cursor-pointer"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Marketplace Buying Options */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary" />
                  <p className="text-sm font-bold text-foreground">
                    Beli Sekarang Melalui Marketplace:
                  </p>
                </div>

                {product.marketplaceLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.marketplaceLinks.map((link) => (
                      <Button
                        key={link.id}
                        variant="outline"
                        disabled={redirectMutation.isPending}
                        onClick={() => handleMarketplaceClick(link.id)}
                        className="h-11 justify-between px-3.5 rounded-xl border-border hover:border-primary/60 hover:bg-muted/50 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="size-6 rounded-md bg-muted/60 flex items-center justify-center shrink-0 p-0.5 border">
                            {link.iconUrl ? (
                              <img
                                src={resolveAssetUrl(link.iconUrl)}
                                alt=""
                                className="size-full object-contain"
                              />
                            ) : (
                              <Globe className="size-3.5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-semibold text-xs truncate">
                            {link.marketplaceName}
                          </span>
                        </div>
                        <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-1.5" />
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic py-1">
                    Hubungi toko untuk informasi pemesanan produk ini.
                  </p>
                )}
              </div>

              {/* Trust Features Badges */}
              <div className="pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
                  <ShieldCheck className="size-4 text-primary shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                    Produk Original
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                    Kualitas Terjamin
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
                  <Truck className="size-4 text-primary shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                    Pengiriman Cepat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {(relatedQuery.data?.length ?? 0) > 0 && (
        <section className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-8 shadow-2xs transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Produk Terkait Lainnya
            </h2>
            <Link
              to="/catalog"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Lihat semua
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ProductGrid products={relatedQuery.data ?? []} />
        </section>
      )}
    </div>
  )
}
