import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import type { CategoryListItem } from '@/types/api/store.types'

export function CategoryCard({ category }: { category: CategoryListItem }) {
  return (
    <Link to={`/category/${category.slug}`} className="block h-full">
      <Card className="relative h-full overflow-hidden py-0 transition-transform duration-200 hover:z-10 hover:scale-105 hover:shadow-md">
        <div className="aspect-square bg-muted">
          {category.imageUrl ? (
            <img
              src={resolveAssetUrl(category.imageUrl)}
              alt={category.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-8" />
            </div>
          )}
        </div>
        <CardContent className="p-3 text-center">
          <p className="truncate font-medium">{category.name}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
