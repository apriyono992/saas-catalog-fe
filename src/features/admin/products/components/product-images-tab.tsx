import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Image as ImageIcon, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/common/empty-state'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import {
  useDeleteProductImageMutation,
  useReorderProductImagesMutation,
  useUploadProductImageMutation,
} from '@/features/admin/products/api/product-images.queries'
import type { ProductImage } from '@/types/api/product.types'

interface ProductImagesTabProps {
  productId: string
  images: ProductImage[]
}

export function ProductImagesTab({ productId, images }: ProductImagesTabProps) {
  const uploadMutation = useUploadProductImageMutation(productId)
  const reorderMutation = useReorderProductImagesMutation(productId)
  const deleteMutation = useDeleteProductImageMutation(productId)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadProgress(0)
    uploadMutation.mutate(
      { file, onProgress: setUploadProgress },
      {
        onSuccess: () => toast.success('Image uploaded'),
        onSettled: () => {
          setUploadProgress(null)
          if (fileInputRef.current) fileInputRef.current.value = ''
        },
      }
    )
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= sorted.length) return

    const reordered = [...sorted]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    reorderMutation.mutate(reordered.map((image) => image.id))
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          id="product-image-upload"
          onChange={handleFileChange}
        />
        <Button asChild variant="outline" disabled={uploadMutation.isPending}>
          <label htmlFor="product-image-upload" className="cursor-pointer">
            <Upload className="size-4" />
            {uploadMutation.isPending ? `Uploading… ${uploadProgress ?? 0}%` : 'Upload image'}
          </label>
        </Button>
        {uploadMutation.isPending && uploadProgress !== null && (
          <Progress value={uploadProgress} className="mt-2 max-w-xs" />
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images yet"
          description="Upload at least one image so shoppers can see the product."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {sorted.map((image, index) => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg border border-border">
              <img src={resolveAssetUrl(image.url)} alt="" className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-background/90 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Move left"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowLeft className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Move right"
                    disabled={index === sorted.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Delete image"
                  onClick={() =>
                    deleteMutation.mutate(image.id, { onSuccess: () => toast.success('Image removed') })
                  }
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
