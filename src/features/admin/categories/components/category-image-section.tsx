import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Image as ImageIcon, Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { cn } from '@/lib/utils'
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
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Pilih file gambar dengan format JPG, PNG, atau WEBP')
      return
    }

    setUploadProgress(0)
    uploadMutation.mutate(
      { file, onProgress: setUploadProgress },
      {
        onSuccess: () => toast.success('Gambar kategori berhasil diunggah'),
        onSettled: () => {
          setUploadProgress(null)
          if (fileInputRef.current) fileInputRef.current.value = ''
        },
      }
    )
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        id="category-image-upload"
        onChange={handleFileChange}
      />

      {imageUrl ? (
        <div className="space-y-3">
          <div className="group relative w-fit overflow-hidden rounded-xl border border-border bg-muted/10 shadow-xs">
            <img
              src={resolveAssetUrl(imageUrl)}
              alt="Category"
              className="size-48 rounded-xl object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                <Upload className="mr-1.5 size-3.5" />
                Ganti
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() =>
                  deleteMutation.mutate(undefined, {
                    onSuccess: () => toast.success('Gambar kategori dihapus'),
                  })
                }
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Hapus
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              <Upload className="mr-1.5 size-3.5" />
              Ganti gambar
            </Button>
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                deleteMutation.mutate(undefined, {
                  onSuccess: () => toast.success('Gambar kategori dihapus'),
                })
              }
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Hapus
            </Button>
          </div>
        </div>
      ) : (
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
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
          className={cn(
            'group flex cursor-pointer flex-col items-center justify-center space-y-2.5 rounded-xl border-2 border-dashed p-8 text-center transition-all select-none',
            isDragging
              ? 'border-primary bg-primary/5 shadow-inner'
              : 'border-border hover:border-primary/60 hover:bg-muted/30',
            uploadMutation.isPending && 'pointer-events-none opacity-60'
          )}
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted transition-transform group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
            {uploadMutation.isPending ? (
              <Loader2 className="size-6 animate-spin text-primary" />
            ) : (
              <div className="relative">
                <ImageIcon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
                <Plus className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground stroke-[3]" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {uploadMutation.isPending
                ? `Mengunggah… ${uploadProgress ?? 0}%`
                : 'Klik untuk upload gambar kategori'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Format JPG, PNG, atau WEBP (Maksimal 5MB)
            </p>
          </div>
        </div>
      )}

      {uploadMutation.isPending && uploadProgress !== null && (
        <Progress value={uploadProgress} className="h-1.5 max-w-xs" />
      )}
    </div>
  )
}
