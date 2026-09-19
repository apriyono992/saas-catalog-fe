import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import {
  marketplaceLinkSchema,
  type MarketplaceLinkFormValues,
} from '@/features/admin/products/marketplace-link.schema'
import {
  useCreateMarketplaceLinkMutation,
  useUpdateMarketplaceLinkMutation,
} from '@/features/admin/products/api/marketplace-links.queries'
import { useMarketplacesQuery } from '@/features/admin/marketplaces/api/marketplaces.queries'
import type { MarketplaceLink } from '@/types/api/product.types'

interface MarketplaceLinkFormDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  link?: MarketplaceLink | null
}

export function MarketplaceLinkFormDialog({
  productId,
  open,
  onOpenChange,
  link,
}: MarketplaceLinkFormDialogProps) {
  const isEditing = !!link
  const marketplacesQuery = useMarketplacesQuery()

  const form = useForm<MarketplaceLinkFormValues>({
    resolver: zodResolver(marketplaceLinkSchema),
    values: {
      marketplaceId: link?.marketplaceId ?? '',
      marketplaceName: link?.marketplaceName ?? '',
      url: link?.url ?? '',
    },
  })

  const selectedMarketplaceId = form.watch('marketplaceId')
  const selectedMarketplace = marketplacesQuery.data?.find((m) => m.id === selectedMarketplaceId)
  const isOther = selectedMarketplace?.slug === 'other'

  useEffect(() => {
    if (selectedMarketplace && !isOther && !link) {
      form.setValue('marketplaceName', selectedMarketplace.name)
    }
  }, [selectedMarketplace, isOther, link, form])

  const createMutation = useCreateMarketplaceLinkMutation(productId)
  const updateMutation = useUpdateMarketplaceLinkMutation(productId)
  const isPending = createMutation.isPending || updateMutation.isPending

  function onSubmit(values: MarketplaceLinkFormValues) {
    const dto = {
      marketplaceId: values.marketplaceId || undefined,
      marketplaceName: values.marketplaceName.trim(),
      url: values.url.trim(),
    }

    if (isEditing) {
      updateMutation.mutate(
        { linkId: link.id, dto },
        {
          onSuccess: () => {
            toast.success('Marketplace link updated')
            onOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => {
          toast.success('Marketplace link added')
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit marketplace link' : 'New marketplace link'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="space-y-4">
            {/* Master Marketplace Dropdown */}
            <Field data-invalid={!!form.formState.errors.marketplaceId}>
              <FieldLabel htmlFor="marketplace-select">Pilih Marketplace</FieldLabel>
              <Controller
                control={form.control}
                name="marketplaceId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val)
                      const target = marketplacesQuery.data?.find((m) => m.id === val)
                      if (target) {
                        form.setValue(
                          'marketplaceName',
                          target.slug === 'other' ? '' : target.name
                        )
                      }
                    }}
                  >
                    <SelectTrigger id="marketplace-select">
                      <SelectValue placeholder="Pilih platform marketplace..." />
                    </SelectTrigger>
                    <SelectContent>
                      {marketplacesQuery.data?.map((m) => {
                        const mIsOther = m.slug === 'other'
                        return (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex items-center gap-2">
                              {m.iconUrl ? (
                                <img
                                  src={resolveAssetUrl(m.iconUrl)}
                                  alt=""
                                  className="size-4 object-contain shrink-0"
                                />
                              ) : (
                                <Globe className="size-4 text-muted-foreground shrink-0" />
                              )}
                              <span>{m.name}</span>
                              {mIsOther && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  (Website / Lainnya)
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[form.formState.errors.marketplaceId]} />
            </Field>

            {/* Marketplace Name Input (editable if Other or manual) */}
            <Field data-invalid={!!form.formState.errors.marketplaceName}>
              <FieldLabel htmlFor="marketplace-name">Nama Tampilan Marketplace</FieldLabel>
              <Input
                id="marketplace-name"
                placeholder={isOther ? 'e.g. Website Resmi, Toko IG, WhatsApp' : 'e.g. Tokopedia'}
                aria-invalid={!!form.formState.errors.marketplaceName}
                {...form.register('marketplaceName')}
              />
              <FieldError errors={[form.formState.errors.marketplaceName]} />
              {isOther && (
                <FieldDescription>
                  Masukkan nama platform khusus atau nama toko Anda.
                </FieldDescription>
              )}
            </Field>

            {/* URL Input */}
            <Field data-invalid={!!form.formState.errors.url}>
              <FieldLabel htmlFor="marketplace-url">URL Produk</FieldLabel>
              <Input
                id="marketplace-url"
                placeholder="https://..."
                aria-invalid={!!form.formState.errors.url}
                {...form.register('url')}
              />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
