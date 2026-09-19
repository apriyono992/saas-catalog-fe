import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategoriesQuery } from '@/features/admin/categories/api/categories.queries'
import { categorySchema, type CategoryFormValues } from '@/features/admin/categories/category.schema'
import type { Category } from '@/types/api/category.types'

const NO_PARENT = 'none'

interface CategoryDetailsFormProps {
  currentCategoryId?: string
  defaultValues: CategoryFormValues
  onSubmit: (values: CategoryFormValues) => void
  isPending: boolean
  submitLabel: string
}

interface FlattenedCategory {
  id: string
  name: string
  depth: number
  disabled: boolean
}

export function CategoryDetailsForm({
  currentCategoryId,
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
}: CategoryDetailsFormProps) {
  const form = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema), defaultValues })
  const categoriesQuery = useCategoriesQuery()

  // Calculate hierarchy & depths (max 5)
  const categoryOptions = useMemo<FlattenedCategory[]>(() => {
    if (!categoriesQuery.data) return []

    const all = categoriesQuery.data
    const byId = new Map<string, Category>(all.map((c) => [c.id, c]))

    // Find all descendants of currentCategoryId to prevent circular reference
    const descendantIds = new Set<string>()
    if (currentCategoryId) {
      descendantIds.add(currentCategoryId)
      let added = true
      while (added) {
        added = false
        for (const c of all) {
          if (c.parentId && descendantIds.has(c.parentId) && !descendantIds.has(c.id)) {
            descendantIds.add(c.id)
            added = true
          }
        }
      }
    }

    function getDepth(cat: Category): number {
      let d = 1
      let curr = cat
      while (curr.parentId && d <= 10) {
        const p = byId.get(curr.parentId)
        if (!p) break
        d++
        curr = p
      }
      return d
    }

    // Build tree
    const roots = all.filter((c) => !c.parentId)
    const result: FlattenedCategory[] = []

    function traverse(cat: Category) {
      const depth = getDepth(cat)
      const isDescendant = descendantIds.has(cat.id)
      const isMaxDepth = depth >= 5 // Level 5 cannot have further children

      result.push({
        id: cat.id,
        name: cat.name,
        depth,
        disabled: isDescendant || isMaxDepth,
      })

      const children = all.filter((c) => c.parentId === cat.id)
      for (const child of children) {
        traverse(child)
      }
    }

    for (const root of roots) {
      traverse(root)
    }

    return result
  }, [categoriesQuery.data, currentCategoryId])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-5">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="category-name">Nama Kategori</FieldLabel>
          <Input id="category-name" aria-invalid={!!form.formState.errors.name} {...form.register('name')} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.parentId}>
          <FieldLabel htmlFor="category-parent">Kategori Induk (Parent Category)</FieldLabel>
          <Controller
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <Select
                value={field.value || NO_PARENT}
                onValueChange={(val) => field.onChange(val === NO_PARENT ? '' : val)}
              >
                <SelectTrigger id="category-parent">
                  <SelectValue placeholder="Pilih kategori induk..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PARENT}>
                    <span className="font-semibold text-primary">None / Kategori Utama (Root)</span>
                  </SelectItem>
                  {categoryOptions.map((opt) => (
                    <SelectItem
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.disabled}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ paddingLeft: `${(opt.depth - 1) * 14}px` }}>
                          {opt.depth > 1 ? `↳ ` : ''}{opt.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-auto pl-2 font-mono">
                          Lvl {opt.depth}{opt.depth >= 5 ? ' (Maks)' : ''}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[form.formState.errors.parentId]} />
          <FieldDescription>
            Pilih kategori induk untuk membuat subkategori (maksimal 5 tingkat kedalaman).
          </FieldDescription>
        </Field>

        <Field data-invalid={!!form.formState.errors.slug}>
          <FieldLabel htmlFor="category-slug">Slug (Identifier URL)</FieldLabel>
          <Input
            id="category-slug"
            placeholder="Otomatis dibuat dari nama jika dikosongkan"
            aria-invalid={!!form.formState.errors.slug}
            {...form.register('slug')}
          />
          <FieldError errors={[form.formState.errors.slug]} />
        </Field>

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? 'Menyimpan…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
