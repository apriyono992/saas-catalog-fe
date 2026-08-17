import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { ProductGrid } from '@/features/store/shared/components/product-grid'
import { useStoreProductsByIdsQuery } from '@/features/store/favorites/api/favorites.queries'
import { useFavoritesStore } from '@/stores/favorites-store'

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids)
  const productsQuery = useStoreProductsByIdsQuery(ids)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Favorites</h1>
      {ids.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on a product to save it here."
          action={
            <Button asChild>
              <Link to="/catalog">Browse catalog</Link>
            </Button>
          }
        />
      ) : productsQuery.isError ? (
        <ErrorState onRetry={() => productsQuery.refetch()} />
      ) : (
        <ProductGrid products={productsQuery.data ?? []} isLoading={productsQuery.isPending} />
      )}
    </div>
  )
}
