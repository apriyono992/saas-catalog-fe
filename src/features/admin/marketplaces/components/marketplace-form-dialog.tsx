import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { cn } from '@/lib/utils'
import {
  useCreateMarketplaceMutation,
  useDeleteMarketplaceIconMutation,
  useUpdateMarketplaceMutation,
  useUploadMarketplaceIconMutation,
} from '../api/marketplaces.queries'
import { marketplaceSchema, type MarketplaceFormValues } from '../marketplace.schema'
import type { Marketplace } from '@/types/api/marketplace.types'

interface MarketplaceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  marketplace?: Marketplace | null
}

export function MarketplaceFormDialog({
  open,
  onOpenChange,
  marketplace,
}: MarketplaceFormDialogProps) {
  const isEditing = !!marketplace
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const form = useForm<MarketplaceFormValues>({
    resolver: zodResolver(marketplaceSchema),
    values: {
      name: marketplace?.name ?? '',
      slug: marketplace?.slug ?? '',
    },
  })

  const createMutation = useCreateMarketplaceMutation()
  const updateMutation = useUpdateMarketplaceMutation()
  const uploadIconMutation = useUploadMarketplaceIconMutation()
  const deleteIconMutation = useDeleteMarketplaceIconMutation()

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadIconMutation.isPending ||
    deleteIconMutation.isPending

  function handleFile(file: File) {
    if (!['image/svg+xml', 'image/png', 'image/webp', 'image/jpeg'].includes(file.type)) {
      toast.error('Format icon harus SVG, PNG, WEBP, atau JPG')
      return
    }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    handleFile(file)
  }

  function handleClose() {
    setSelectedFile(null)
    setPreviewUrl(null)
    onOpenChange(false)
  }

  function onSubmit(values: MarketplaceFormValues) {
    const dto = {
      name: values.name.trim(),
      slug: values.slug?.trim() || undefined,
    }

    if (isEditing) {
      updateMutation.mutate(
        { id: marketplace.id, dto },
        {
          onSuccess: (updated) => {
            if (selectedFile) {
              uploadIconMutation.mutate(
                { id: updated.id, file: selectedFile },
                {
                  onSuccess: () => {
                    toast.success('Marketplace updated with icon')
                    handleClose()
                  },
                }
              )
            } else {
              toast.success('Marketplace updated')
              handleClose()
            }
          },
        }
      )
    } else {
      createMutation.mutate(dto, {
        onSuccess: (created) => {
          if (selectedFile) {
            uploadIconMutation.mutate(
              { id: created.id, file: selectedFile },
              {
                onSuccess: () => {
                  toast.success('Marketplace created with icon')
                  handleClose()
                  form.reset()
                },
              }
            )
          } else {
            toast.success('Marketplace created')
            handleClose()
            form.reset()
          }
        },
      })
    }
  }

  const iconDisplay =
    previewUrl ?? (marketplace?.iconUrl ? resolveAssetUrl(marketplace.iconUrl) : null)

  const isOther = marketplace?.slug === 'other'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${marketplace.name}` : 'New Master Marketplace'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="space-y-4">
            {/* Icon Dropzone & Picker */}
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
                'group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-3.5 transition-all select-none',
                isDragging
                  ? 'border-primary bg-primary/5 shadow-inner'
                  : 'border-border hover:border-primary/60 hover:bg-muted/30'
              )}
            >
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background shadow-2xs transition-transform group-hover:scale-105">
                {iconDisplay ? (
                  <img src={iconDisplay} alt="Icon preview" className="size-10 object-contain" />
                ) : isOther ? (
                  <Globe className="size-7 text-primary" />
                ) : (
                  <div className="relative flex size-9 items-center justify-center rounded-full bg-muted">
                    <ImageIcon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    <Plus className="absolute -bottom-1 -right-1 size-3 rounded-full bg-primary p-0.5 text-primary-foreground stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  {iconDisplay ? 'Klik untuk ganti icon' : 'Klik untuk upload icon'}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Format SVG, PNG, WEBP, atau JPG (rasio 1:1)
                </p>
              </div>

              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    setPreviewUrl(null)
                  }}
                >
                  Batal
                </Button>
              )}

              {marketplace?.iconUrl && !selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={deleteIconMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteIconMutation.mutate(marketplace.id, {
                      onSuccess: () => {
                        toast.success('Icon removed')
                        setPreviewUrl(null)
                      },
                    })
                  }}
                  title="Hapus icon"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/svg+xml,image/png,image/webp,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />

            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="m-name">Nama Marketplace</FieldLabel>
              <Input
                id="m-name"
                placeholder="e.g. Tokopedia, Shopee, Blibli, Other"
                aria-invalid={!!form.formState.errors.name}
                {...form.register('name')}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.slug}>
              <FieldLabel htmlFor="m-slug">Slug (Identifier)</FieldLabel>
              <Input
                id="m-slug"
                placeholder="e.g. tokopedia, shopee, other"
                aria-invalid={!!form.formState.errors.slug}
                {...form.register('slug')}
              />
              <FieldError errors={[form.formState.errors.slug]} />
              <FieldDescription>
                Otomatis dibuat dari nama jika dikosongkan.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
