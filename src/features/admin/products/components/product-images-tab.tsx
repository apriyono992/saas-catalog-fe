import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Image as ImageIcon, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { cn } from '@/lib/utils'
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
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder)

  async function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    )
    if (fileArray.length === 0) {
      toast.error('Pilih file gambar dengan format JPG, PNG, atau WEBP')
      return
    }

    setIsUploading(true)
    let successCount = 0

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100))
      try {
        await uploadMutation.mutateAsync({ file })
        successCount++
      } catch {
        toast.error(`Gagal mengunggah ${file.name}`)
      }
    }

    setUploadProgress(null)
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (successCount > 0) {
      toast.success(
        successCount === 1 ? 'Gambar berhasil diunggah' : `${successCount} gambar berhasil diunggah`
      )
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      handleFiles(event.target.files)
    }
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
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        id="product-image-upload"
        onChange={handleFileChange}
      />

      {isUploading && uploadProgress !== null && (
        <div className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              Mengunggah gambar...
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {/* Existing Images */}
        {sorted.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/10 shadow-2xs transition-shadow hover:shadow-xs"
          >
            <img
              src={resolveAssetUrl(image.url)}
              alt=""
              className="size-full object-cover"
            />
            {index === 0 && (
              <span className="absolute top-2 left-2 rounded-md border border-border/80 bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-xs backdrop-blur-xs">
                Utama
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-background/90 p-1.5 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Move left"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  title="Geser ke kiri"
                >
                  <ArrowLeft className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Move right"
                  disabled={index === sorted.length - 1}
                  onClick={() => move(index, 1)}
                  title="Geser ke kanan"
                >
                  <ArrowRight className="size-3" />
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Delete image"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() =>
                  deleteMutation.mutate(image.id, { onSuccess: () => toast.success('Gambar dihapus') })
                }
                title="Hapus gambar"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        ))}

        {/* Upload Card Dropzone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            'group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 text-center transition-all select-none',
            isDragging
              ? 'border-primary bg-primary/5 shadow-inner'
              : 'border-border hover:border-primary/60 hover:bg-muted/30 hover:shadow-2xs',
            isUploading && 'pointer-events-none opacity-60'
          )}
        >
          <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-muted transition-transform group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-primary" />
            ) : (
              <div className="relative">
                <ImageIcon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                <Plus className="absolute -bottom-1.5 -right-1.5 size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground stroke-[3]" />
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground sm:text-sm">
              {isUploading ? 'Mengunggah…' : 'Upload gambar'}
            </p>
            <p className="text-[10px] text-muted-foreground sm:text-[11px]">
              JPG, PNG, WEBP (Maks 5MB)
            </p>
          </div>
        </div>
      </div>

      {sorted.length === 0 && !isUploading && (
        <p className="text-xs text-muted-foreground">
          Belum ada gambar produk. Klik kotak di atas untuk mengunggah gambar produk (bisa pilih beberapa gambar sekaligus).
        </p>
      )}
    </div>
  )
}
