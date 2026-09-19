import { useState } from 'react'
import { toast } from 'sonner'
import { Globe, Link2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { MarketplaceLinkFormDialog } from '@/features/admin/products/components/marketplace-link-form-dialog'
import { useDeleteMarketplaceLinkMutation } from '@/features/admin/products/api/marketplace-links.queries'
import type { MarketplaceLink } from '@/types/api/product.types'

interface ProductMarketplaceLinksTabProps {
  productId: string
  links: MarketplaceLink[]
}

export function ProductMarketplaceLinksTab({ productId, links }: ProductMarketplaceLinksTabProps) {
  const [formState, setFormState] = useState<{ open: boolean; link: MarketplaceLink | null }>({
    open: false,
    link: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceLink | null>(null)
  const deleteMutation = useDeleteMarketplaceLinkMutation(productId)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setFormState({ open: true, link: null })}>
        <Plus className="size-4" />
        Add marketplace link
      </Button>

      {links.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No marketplace links yet"
          description="Add a link to Tokopedia, Shopee, or another marketplace."
        />
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between gap-4 p-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-8 rounded-lg border bg-muted/40 flex items-center justify-center shrink-0 p-1">
                  {link.marketplace?.iconUrl ? (
                    <img
                      src={resolveAssetUrl(link.marketplace.iconUrl)}
                      alt=""
                      className="size-full object-contain"
                    />
                  ) : (
                    <Globe className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{link.marketplaceName}</p>
                  <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit link"
                  onClick={() => setFormState({ open: true, link })}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete link"
                  onClick={() => setDeleteTarget(link)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MarketplaceLinkFormDialog
        productId={productId}
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        link={formState.link}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Remove "${deleteTarget?.marketplaceName}" link?`}
        confirmLabel="Remove"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success('Link removed')
              setDeleteTarget(null)
            },
          })
        }}
      />
    </div>
  )
}
