import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ImageOff, ExternalLink } from 'lucide-react'
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
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { formatCurrency } from '@/utils/format-currency'
import { getApiErrorMessage } from '@/services/http/error'
import { toast } from 'sonner'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const productQuery = useStoreProductQuery(slug)
  const relatedQuery = useRelatedProductsQuery(slug)
  const redirectMutation = useMarketplaceRedirectMutation()
  const [activeImage, setActiveImage] = useState(0)

  if (productQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
            {product.images.length > 0 ? (
              <img
                src={resolveAssetUrl(product.images[activeImage])}
                alt={product.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ImageOff className="size-12" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`size-16 overflow-hidden rounded-md border ${
                    index === activeImage ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img src={resolveAssetUrl(image)} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <Badge variant="secondary" className="mb-2">
              {product.category.name}
            </Badge>
          )}
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{formatCurrency(product.basePrice)}</p>

          {product.description && <p className="mt-4 text-sm leading-relaxed">{product.description}</p>}

          {product.variantTypes.length > 0 && (
            <div className="mt-6 space-y-3">
              {product.variantTypes.map((variantType) => (
                <div key={variantType.name}>
                  <p className="mb-1.5 text-sm font-medium">{variantType.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {variantType.options.map((option) => (
                      <Badge key={option} variant="outline">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {product.marketplaceLinks.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium">Buy on</p>
              <div className="flex flex-wrap gap-2">
                {product.marketplaceLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    disabled={redirectMutation.isPending}
                    onClick={() => handleMarketplaceClick(link.id)}
                  >
                    {link.marketplaceName}
                    <ExternalLink className="size-4" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {(relatedQuery.data?.length ?? 0) > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Related products</h2>
          <ProductGrid products={relatedQuery.data ?? []} />
        </div>
      )}
    </div>
  )
}
