import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/common/empty-state'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import {
  useDeleteCategoryImageMutation,
  useUploadCategoryImageMutation,
} from '@/features/admin/categories/api/categories.queries'

interface CategoryImageSectionProps {
  categoryId: string
  imageUrl: string | null
}

export function CategoryImageSection({ categoryId, imageUrl }: CategoryImageSectionProps) {
  const uploadMutation = useUploadCategoryImageMutation(categoryId)
  const deleteMutation = useDeleteCategoryImageMutation(categoryId)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="group relative w-fit overflow-hidden rounded-lg border border-border">
          <img src={resolveAssetUrl(imageUrl)} alt="" className="size-40 object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end bg-background/90 p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Delete image"
              onClick={() =>
                deleteMutation.mutate(undefined, { onSuccess: () => toast.success('Image removed') })
              }
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ImageIcon}
          title="No image yet"
          description="Upload an image to display for this category in the storefront."
        />
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          id="category-image-upload"
          onChange={handleFileChange}
        />
        <Button asChild variant="outline" disabled={uploadMutation.isPending}>
          <label htmlFor="category-image-upload" className="cursor-pointer">
            <Upload className="size-4" />
            {uploadMutation.isPending
              ? `Uploading… ${uploadProgress ?? 0}%`
              : imageUrl
                ? 'Replace image'
                : 'Upload image'}
          </label>
        </Button>
        {uploadMutation.isPending && uploadProgress !== null && (
          <Progress value={uploadProgress} className="mt-2 max-w-xs" />
        )}
      </div>
    </div>
  )
}
