import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { CategoryDetailsForm } from '@/features/admin/categories/components/category-details-form'
import { useCreateCategoryMutation } from '@/features/admin/categories/api/categories.queries'

export default function CategoryNewPage() {
  const navigate = useNavigate()
  const createMutation = useCreateCategoryMutation()

  return (
    <div>
      <PageHeader title="New category" description="Create a category, then add an image." />
      <CategoryDetailsForm
        defaultValues={{ name: '', slug: '' }}
        submitLabel="Create category"
        isPending={createMutation.isPending}
        onSubmit={(values) => {
          createMutation.mutate(
            { name: values.name, slug: values.slug || undefined },
            {
              onSuccess: (category) => {
                toast.success('Category created')
                navigate(`/categories/${category.id}`, { replace: true })
              },
            }
          )
        }}
      />
    </div>
  )
}
