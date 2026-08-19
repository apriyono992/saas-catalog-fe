import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { categorySchema, type CategoryFormValues } from '@/features/admin/categories/category.schema'

interface CategoryDetailsFormProps {
  defaultValues: CategoryFormValues
  onSubmit: (values: CategoryFormValues) => void
  isPending: boolean
  submitLabel: string
}

export function CategoryDetailsForm({ defaultValues, onSubmit, isPending, submitLabel }: CategoryDetailsFormProps) {
  const form = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema), defaultValues })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-xl">
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

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
