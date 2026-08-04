import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  archiveProduct,
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  publishProduct,
  updateProduct,
} from '@/services/cms/products.api'
import type { AdminListProductsQuery, CreateProductDto, UpdateProductDto } from '@/types/api/product.types'

export const productKeys = {
  all: ['products'] as const,
  list: (query: AdminListProductsQuery) => [...productKeys.all, 'list', query] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

export function useProductsQuery(query: AdminListProductsQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => listProducts(query),
    placeholderData: keepPreviousData,
  })
}

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => getProduct(id!),
    enabled: !!id,
  })
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useUpdateProductMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateProductDto) => updateProduct(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function usePublishProductMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => publishProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useArchiveProductMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => archiveProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}
