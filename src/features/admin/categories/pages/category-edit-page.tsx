import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryDetailsForm } from '@/features/admin/categories/components/category-details-form'
import { CategoryImageSection } from '@/features/admin/categories/components/category-image-section'
import { useCategoryQuery, useUpdateCategoryMutation } from '@/features/admin/categories/api/categories.queries'

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>()
  const categoryQuery = useCategoryQuery(id)
  const updateMutation = useUpdateCategoryMutation()

  if (categoryQuery.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-xl" />
      </div>
    )
  }

  if (categoryQuery.isError || !categoryQuery.data) {
    return <ErrorState onRetry={() => categoryQuery.refetch()} />
  }

  const category = categoryQuery.data

  return (
    <div>
      <PageHeader title={category.name} description="Manage this category's details and image." />

      <h2 className="mb-4 text-sm font-medium text-muted-foreground">Details</h2>
      <CategoryDetailsForm
        currentCategoryId={category.id}
        defaultValues={{ name: category.name, slug: category.slug, parentId: category.parentId ?? '' }}
        submitLabel="Save changes"
        isPending={updateMutation.isPending}
        onSubmit={(values) => {
          updateMutation.mutate(
            {
              id: category.id,
              dto: {
                name: values.name,
                slug: values.slug || undefined,
                parentId: values.parentId || null,
              },
            },
            { onSuccess: () => toast.success('Category updated') }
          )
        }}
      />

      <hr className="my-8 border-border" />

      <h2 className="mb-4 text-sm font-medium text-muted-foreground">Image</h2>
      <CategoryImageSection categoryId={category.id} imageUrl={category.imageUrl} />
    </div>
  )
}
