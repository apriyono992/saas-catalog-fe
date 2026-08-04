import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Shapes, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { EmptyState } from '@/components/common/empty-state'
import { variantTypeSchema, type VariantTypeFormValues } from '@/features/admin/products/variant.schema'
import {
  useCreateVariantOptionMutation,
  useCreateVariantTypeMutation,
  useDeleteVariantOptionMutation,
  useDeleteVariantTypeMutation,
} from '@/features/admin/products/api/product-variants.queries'
import type { VariantOption, VariantType } from '@/types/api/product.types'

interface ProductVariantsTabProps {
  productId: string
  variantTypes: (VariantType & { options: VariantOption[] })[]
}

export function ProductVariantsTab({ productId, variantTypes }: ProductVariantsTabProps) {
  const [addTypeOpen, setAddTypeOpen] = useState(false)
  const createType = useCreateVariantTypeMutation(productId)
  const deleteType = useDeleteVariantTypeMutation(productId)

  const typeForm = useForm<VariantTypeFormValues>({
    resolver: zodResolver(variantTypeSchema),
    defaultValues: { name: '' },
  })

  return (
    <div className="space-y-4">
      <Dialog open={addTypeOpen} onOpenChange={setAddTypeOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="size-4" />
            Add variant type
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New variant type</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={typeForm.handleSubmit((values) => {
              createType.mutate(values, {
                onSuccess: () => {
                  toast.success('Variant type added')
                  setAddTypeOpen(false)
                  typeForm.reset()
                },
              })
            })}
            noValidate
          >
            <FieldGroup>
              <Field data-invalid={!!typeForm.formState.errors.name}>
                <FieldLabel htmlFor="variant-type-name">Name</FieldLabel>
                <Input
                  id="variant-type-name"
                  placeholder="e.g. Ukuran"
                  aria-invalid={!!typeForm.formState.errors.name}
                  {...typeForm.register('name')}
                />
                <FieldError errors={[typeForm.formState.errors.name]} />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setAddTypeOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createType.isPending}>
                {createType.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {variantTypes.length === 0 ? (
        <EmptyState
          icon={Shapes}
          title="No variants yet"
          description="Add a variant type like Size or Color, then add its options."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {variantTypes.map((type) => (
            <VariantTypeCard
              key={type.id}
              productId={productId}
              type={type}
              onDeleteType={() =>
                deleteType.mutate(type.id, { onSuccess: () => toast.success('Variant type removed') })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

function VariantTypeCard({
  productId,
  type,
  onDeleteType,
}: {
  productId: string
  type: VariantType & { options: VariantOption[] }
  onDeleteType: () => void
}) {
  const createOption = useCreateVariantOptionMutation(productId)
  const deleteOption = useDeleteVariantOptionMutation(productId)
  const [newValue, setNewValue] = useState('')

  function addOption() {
    if (!newValue.trim()) return
    createOption.mutate(
      { typeId: type.id, dto: { value: newValue.trim() } },
      { onSuccess: () => setNewValue('') }
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{type.name}</CardTitle>
        <Button variant="ghost" size="icon-xs" aria-label="Remove variant type" onClick={onDeleteType}>
          <Trash2 className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {type.options.length === 0 && <p className="text-sm text-muted-foreground">No options yet</p>}
          {type.options.map((option) => (
            <Badge key={option.id} variant="secondary" className="gap-1 pr-1">
              {option.value}
              <button
                type="button"
                aria-label={`Remove ${option.value}`}
                onClick={() => deleteOption.mutate({ typeId: type.id, optionId: option.id })}
                className="rounded-full p-0.5 hover:bg-background"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addOption()
              }
            }}
            placeholder="e.g. M, Merah"
            className="h-8"
          />
          <Button type="button" size="sm" onClick={addOption} disabled={createOption.isPending}>
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
