import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategoriesQuery } from '@/features/admin/categories/api/categories.queries'
import { productSchema, type ProductFormValues } from '@/features/admin/products/product.schema'

const NO_CATEGORY = 'none'

interface ProductDetailsFormProps {
  defaultValues: ProductFormValues
  onSubmit: (values: ProductFormValues) => void
  isPending: boolean
  submitLabel: string
}

export function ProductDetailsForm({ defaultValues, onSubmit, isPending, submitLabel }: ProductDetailsFormProps) {
  const form = useForm<ProductFormValues>({ resolver: zodResolver(productSchema), defaultValues })
  const categoriesQuery = useCategoriesQuery()

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="product-name">Name</FieldLabel>
          <Input id="product-name" aria-invalid={!!form.formState.errors.name} {...form.register('name')} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.slug}>
          <FieldLabel htmlFor="product-slug">Slug</FieldLabel>
          <Input
            id="product-slug"
            placeholder="Auto-generated if left blank"
            aria-invalid={!!form.formState.errors.slug}
            {...form.register('slug')}
          />
          <FieldError errors={[form.formState.errors.slug]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="product-description">Description</FieldLabel>
          <Textarea id="product-description" rows={4} {...form.register('description')} />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.categoryId}>
          <FieldLabel htmlFor="product-category">Category</FieldLabel>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value || NO_CATEGORY}
                onValueChange={(value) => field.onChange(value === NO_CATEGORY ? '' : value)}
              >
                <SelectTrigger id="product-category">
                  <SelectValue placeholder="No category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>No category</SelectItem>
                  {categoriesQuery.data?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[form.formState.errors.categoryId]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.basePrice}>
          <FieldLabel htmlFor="product-price">Base price (IDR)</FieldLabel>
          <Input
            id="product-price"
            inputMode="decimal"
            placeholder="150000"
            aria-invalid={!!form.formState.errors.basePrice}
            {...form.register('basePrice')}
          />
          <FieldError errors={[form.formState.errors.basePrice]} />
        </Field>

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
