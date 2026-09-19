import { Link } from 'react-router-dom'
import { ImageOff, ArrowUpRight } from 'lucide-react'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import type { CategoryListItem } from '@/types/api/store.types'

export function CategoryCard({ category }: { category: CategoryListItem }) {
  return (
    <Link to={`/category/${category.slug}`} className="group block h-full">
      <div className="store-card relative h-full rounded-2xl border border-border/70 bg-card p-3 sm:p-4 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 flex flex-col items-center text-center">
        {/* Soft rounded image wrapper ala Image 1 */}
        <div className="relative aspect-square w-full rounded-xl bg-[#f6f2eb] dark:bg-muted/50 flex items-center justify-center overflow-hidden mb-3 transition-colors group-hover:bg-[#efe8dc] dark:group-hover:bg-muted/70">
          {category.imageUrl ? (
            <img
              src={resolveAssetUrl(category.imageUrl)}
              alt={category.name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground/60">
              <ImageOff className="size-8" />
            </div>
          )}
          <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity size-6 rounded-full bg-background/80 flex items-center justify-center shadow-xs">
            <ArrowUpRight className="size-3 text-foreground" />
          </span>
        </div>

        {/* Category info */}
        <div className="w-full space-y-0.5">
          <p className="font-bold text-sm sm:text-base text-foreground tracking-tight truncate">
            {category.name}
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">
            Jelajahi produk
          </p>
        </div>
      </div>
    </Link>
  )
}
