import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
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
  const initialCategoryIds =
    defaultValues.categoryIds && defaultValues.categoryIds.length > 0
      ? defaultValues.categoryIds
      : defaultValues.categoryId
        ? [defaultValues.categoryId]
        : []

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...defaultValues,
      categoryIds: initialCategoryIds,
      categoryId: initialCategoryIds[0] ?? '',
    },
  })
  const categoriesQuery = useCategoriesQuery()
  const selectedCategoryIds = form.watch('categoryIds') ?? []

  const categoriesById = new Map(categoriesQuery.data?.map((c) => [c.id, c]) ?? [])

  function addCategory(categoryId: string) {
    if (!categoryId || categoryId === NO_CATEGORY) return
    const current = form.getValues('categoryIds') ?? []
    if (!current.includes(categoryId)) {
      const updated = [...current, categoryId]
      form.setValue('categoryIds', updated)
      form.setValue('categoryId', updated[0])
    }
  }

  function removeCategory(categoryId: string) {
    const current = form.getValues('categoryIds') ?? []
    const updated = current.filter((id) => id !== categoryId)
    form.setValue('categoryIds', updated)
    form.setValue('categoryId', updated[0] ?? '')
  }

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

        {/* Multi-Category Selector */}
        <Field data-invalid={!!form.formState.errors.categoryIds}>
          <FieldLabel htmlFor="product-category">Kategori Produk (Bisa lebih dari satu)</FieldLabel>

          {/* Selected Category Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px] p-2 rounded-lg border bg-muted/20">
            {selectedCategoryIds.length === 0 ? (
              <span className="text-xs text-muted-foreground italic py-0.5">
                Belum ada kategori dipilih. Pilih dari dropdown di bawah.
              </span>
            ) : (
              selectedCategoryIds.map((cId) => {
                const cat = categoriesById.get(cId)
                return (
                  <Badge
                    key={cId}
                    variant="secondary"
                    className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-semibold bg-background border shadow-2xs"
                  >
                    <span>{cat?.name ?? 'Kategori'}</span>
                    <button
                      type="button"
                      aria-label="Hapus kategori"
                      onClick={() => removeCategory(cId)}
                      className="rounded-full hover:bg-muted p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )
              })
            )}
          </div>

          {/* Add Category Dropdown */}
          <Select
            value={NO_CATEGORY}
            onValueChange={(val) => {
              if (val !== NO_CATEGORY) addCategory(val)
            }}
          >
            <SelectTrigger id="product-category">
              <SelectValue placeholder="+ Tambahkan kategori..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_CATEGORY} disabled>
                -- Pilih kategori untuk ditambahkan --
              </SelectItem>
              {categoriesQuery.data?.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.id)
                const isSub = !!category.parentId
                return (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    disabled={isSelected}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isSub ? 'pl-3' : 'font-medium'}>
                        {isSub ? '↳ ' : ''}{category.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          (Sudah dipilih)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <FieldError errors={[form.formState.errors.categoryIds]} />
          <FieldDescription>
            Produk dapat dimasukkan ke dalam beberapa kategori sekaligus.
          </FieldDescription>
        </Field>

        <Field data-invalid={!!form.formState.errors.basePrice}>
          <FieldLabel htmlFor="product-price">Harga Asli / Base price (IDR)</FieldLabel>
          <Input
            id="product-price"
            inputMode="decimal"
            placeholder="150000"
            aria-invalid={!!form.formState.errors.basePrice}
            {...form.register('basePrice')}
          />
          <FieldError errors={[form.formState.errors.basePrice]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.strikePrice}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="product-strike-price">
              Harga Coret (Strike-through price) <span className="text-muted-foreground font-normal">(opsional)</span>
            </FieldLabel>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-xs text-primary h-auto py-0.5"
              onClick={() => {
                const base = form.getValues('basePrice')
                if (base && Number(base) > 0) {
                  form.setValue('strikePrice', Math.round(Number(base) * 1.35).toString())
                }
              }}
            >
              <Sparkles className="size-3 mr-1" />
              Hitung Otomatis (+35%)
            </Button>
          </div>
          <Input
            id="product-strike-price"
            inputMode="decimal"
            placeholder="Kosongkan untuk otomatis 35% dari harga asli"
            aria-invalid={!!form.formState.errors.strikePrice}
            {...form.register('strikePrice')}
          />
          <FieldError errors={[form.formState.errors.strikePrice]} />
          <FieldDescription>
            Harga sebelum diskon yang akan dicoret. Jika dikosongkan, sistem otomatis menghitung menggunakan default toko.
          </FieldDescription>
        </Field>

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
