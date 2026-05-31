import { useApiFetch } from '@/hooks/useApiFetch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProductType, CreateProductTypeData, UpdateProductTypeData } from '@/types/productType';
import type { Product } from '@/types/product';
import { productTypeKeys, productKeys } from './queryKeys';

export function useProductTypes() {
  const apiFetch = useApiFetch();
  return useQuery<ProductType[]>({
    queryKey: productTypeKeys.all(),
    queryFn: () => apiFetch('/product_types/'),
  });
}

export function useProductType(id: string) {
  const apiFetch = useApiFetch();
  return useQuery<ProductType>({
    queryKey: productTypeKeys.detail(id),
    queryFn: () => apiFetch(`/product_types/${id}`),
    enabled: !!id,
  });
}

export function useProductTypeProducts(name: string) {
  const apiFetch = useApiFetch();
  return useQuery<Product[]>({
    queryKey: productTypeKeys.products(name),
    queryFn: () => apiFetch(`/product_types/${encodeURIComponent(name)}/products`),
    enabled: !!name,
  });
}

export function useCreateProductType() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<ProductType, Error, CreateProductTypeData>({
    mutationFn: (data) =>
      apiFetch('/product_types/', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productTypeKeys.all() });
    },
  });
}

export function useUpdateProductType() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<ProductType, Error, { id: string; data: UpdateProductTypeData }>({
    mutationFn: ({ id, data }) =>
      apiFetch(`/product_types/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: productTypeKeys.all() });
      queryClient.invalidateQueries({ queryKey: productTypeKeys.detail(id) });
    },
  });
}

export function useDeleteProductType() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: (id) => apiFetch(`/product_types/${id}`, { method: 'DELETE' }),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: productTypeKeys.all() });
      queryClient.removeQueries({ queryKey: productTypeKeys.detail(id) });
      // product list may have changed too
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
    },
  });
}
