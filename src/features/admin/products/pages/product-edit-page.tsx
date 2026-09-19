import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState } from '@/components/common/error-state'
import { StatusBadge, type StatusVariant } from '@/components/common/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductDetailsForm } from '@/features/admin/products/components/product-details-form'
import { ProductImagesTab } from '@/features/admin/products/components/product-images-tab'
import { ProductVariantsTab } from '@/features/admin/products/components/product-variants-tab'
import { ProductMarketplaceLinksTab } from '@/features/admin/products/components/product-marketplace-links-tab'
import { useProductQuery, useUpdateProductMutation } from '@/features/admin/products/api/products.queries'
import type { ProductStatus } from '@/types/common.types'

const STATUS_VARIANT: Record<ProductStatus, StatusVariant> = {
  draft: 'muted',
  published: 'success',
  archived: 'warning',
}

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const productQuery = useProductQuery(id)
  const updateMutation = useUpdateProductMutation(id ?? '')

  if (productQuery.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-xl" />
      </div>
    )
  }

  if (productQuery.isError || !productQuery.data) {
    return <ErrorState onRetry={() => productQuery.refetch()} />
  }

  const product = productQuery.data

  return (
    <div>
      <PageHeader
        title={product.name}
        description={<StatusBadge label={product.status} variant={STATUS_VARIANT[product.status]} />}
      />

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="marketplace-links">Marketplace links</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-4">
          <ProductDetailsForm
            defaultValues={{
              name: product.name,
              slug: product.slug,
              description: product.description ?? '',
              categoryId: product.categoryId ?? '',
              categoryIds:
                product.productCategories && product.productCategories.length > 0
                  ? product.productCategories.map((pc) => pc.category.id)
                  : product.categoryId
                    ? [product.categoryId]
                    : [],
              basePrice: product.basePrice ?? '',
              strikePrice: product.strikePrice ?? '',
            }}
            submitLabel="Save changes"
            isPending={updateMutation.isPending}
            onSubmit={(values) => {
              updateMutation.mutate(
                {
                  name: values.name,
                  slug: values.slug || undefined,
                  description: values.description || undefined,
                  categoryId: values.categoryId || undefined,
                  categoryIds: values.categoryIds,
                  basePrice: values.basePrice || undefined,
                  strikePrice: values.strikePrice || undefined,
                },
                { onSuccess: () => toast.success('Product updated') }
              )
            }}
          />
        </TabsContent>

        <TabsContent value="images" className="pt-4">
          <ProductImagesTab productId={product.id} images={product.images} />
        </TabsContent>

        <TabsContent value="variants" className="pt-4">
          <ProductVariantsTab productId={product.id} variantTypes={product.variantTypes} />
        </TabsContent>

        <TabsContent value="marketplace-links" className="pt-4">
          <ProductMarketplaceLinksTab productId={product.id} links={product.marketplaceLinks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
