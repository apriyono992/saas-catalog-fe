import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { categorySchema, type CategoryFormValues } from '@/features/admin/categories/category.schema'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/features/admin/categories/api/categories.queries'
import type { Category } from '@/types/api/category.types'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEditing = !!category
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    values: { name: category?.name ?? '', slug: category?.slug ?? '' },
  })
  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  function onSubmit(values: CategoryFormValues) {
    const dto = { name: values.name, slug: values.slug || undefined }

    if (isEditing) {
      updateMutation.mutate(
        { id: category.id, dto },
        {
          onSuccess: () => {
            toast.success('Category updated')
            onOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => {
          toast.success('Category created')
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
          <DialogTitle>{isEditing ? 'Edit category' : 'New category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <Input id="category-name" aria-invalid={!!form.formState.errors.name} {...form.register('name')} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.slug}>
              <FieldLabel htmlFor="category-slug">Slug</FieldLabel>
              <Input
                id="category-slug"
                placeholder="Auto-generated if left blank"
                aria-invalid={!!form.formState.errors.slug}
                {...form.register('slug')}
              />
              <FieldError errors={[form.formState.errors.slug]} />
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
