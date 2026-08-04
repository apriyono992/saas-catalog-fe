import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  marketplaceLinkSchema,
  type MarketplaceLinkFormValues,
} from '@/features/admin/products/marketplace-link.schema'
import {
  useCreateMarketplaceLinkMutation,
  useUpdateMarketplaceLinkMutation,
} from '@/features/admin/products/api/marketplace-links.queries'
import type { MarketplaceLink } from '@/types/api/product.types'

interface MarketplaceLinkFormDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  link?: MarketplaceLink | null
}

export function MarketplaceLinkFormDialog({ productId, open, onOpenChange, link }: MarketplaceLinkFormDialogProps) {
  const isEditing = !!link
  const form = useForm<MarketplaceLinkFormValues>({
    resolver: zodResolver(marketplaceLinkSchema),
    values: { marketplaceName: link?.marketplaceName ?? '', url: link?.url ?? '' },
  })
  const createMutation = useCreateMarketplaceLinkMutation(productId)
  const updateMutation = useUpdateMarketplaceLinkMutation(productId)
  const isPending = createMutation.isPending || updateMutation.isPending

  function onSubmit(values: MarketplaceLinkFormValues) {
    if (isEditing) {
      updateMutation.mutate(
        { linkId: link.id, dto: values },
        {
          onSuccess: () => {
            toast.success('Marketplace link updated')
            onOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(values, {
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
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.marketplaceName}>
              <FieldLabel htmlFor="marketplace-name">Marketplace</FieldLabel>
              <Input
                id="marketplace-name"
                placeholder="e.g. Tokopedia"
                aria-invalid={!!form.formState.errors.marketplaceName}
                {...form.register('marketplaceName')}
              />
              <FieldError errors={[form.formState.errors.marketplaceName]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.url}>
              <FieldLabel htmlFor="marketplace-url">URL</FieldLabel>
              <Input
                id="marketplace-url"
                placeholder="https://…"
                aria-invalid={!!form.formState.errors.url}
                {...form.register('url')}
              />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
