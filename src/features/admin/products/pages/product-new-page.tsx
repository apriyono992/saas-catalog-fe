import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { ProductDetailsForm } from '@/features/admin/products/components/product-details-form'
import { useCreateProductMutation } from '@/features/admin/products/api/products.queries'

export default function ProductNewPage() {
  const navigate = useNavigate()
  const createMutation = useCreateProductMutation()

  return (
    <div>
      <PageHeader title="New product" description="Create a draft product, then add images and details." />
      <ProductDetailsForm
        defaultValues={{ name: '', slug: '', description: '', categoryId: '', basePrice: '', strikePrice: '' }}
        submitLabel="Create product"
        isPending={createMutation.isPending}
        onSubmit={(values) => {
          createMutation.mutate(
            {
              name: values.name,
              slug: values.slug || undefined,
              description: values.description || undefined,
              categoryId: values.categoryId || undefined,
              categoryIds: values.categoryIds && values.categoryIds.length > 0 ? values.categoryIds : undefined,
              basePrice: values.basePrice || undefined,
              strikePrice: values.strikePrice || undefined,
            },
            {
              onSuccess: (product) => {
                toast.success('Product created')
                navigate(`/products/${product.id}`, { replace: true })
              },
            }
          )
        }}
      />
    </div>
  )
}
