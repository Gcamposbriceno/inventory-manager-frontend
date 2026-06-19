import { useApiFetch } from '@/hooks/useApiFetch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product, CreateProductData, UpdateProductData } from '@/types/product';
import { productKeys } from './queryKeys';

export function useProducts() {
  const apiFetch = useApiFetch();
  return useQuery<Product[]>({
    queryKey: productKeys.all(),
    queryFn: () => apiFetch('/products/'),
  });
}

export function useProduct(sku: string) {
  const apiFetch = useApiFetch();
  return useQuery<Product>({
    queryKey: productKeys.detail(sku),
    queryFn: () => apiFetch(`/products/${sku}`),
    enabled: !!sku,
  });
}

export function useProductByEan(ean: string) {
  const apiFetch = useApiFetch();
  return useQuery<Product>({
    queryKey: productKeys.byEan(ean),
    queryFn: () => apiFetch(`/products/by-ean/${ean}`),
    enabled: !!ean,
  });
}

export function useCreateProduct() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<Product, Error, CreateProductData>({
    mutationFn: (data) =>
      apiFetch('/products/', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
    },
  });
}

export function useUpdateProduct() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { sku: string; data: UpdateProductData }>({
    mutationFn: ({ sku, data }) =>
      apiFetch(`/products/${sku}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: (_result, { sku }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(sku) });
    },
  });
}

export function useDeleteProduct() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: (sku) => apiFetch(`/products/${sku}`, { method: 'DELETE' }),
    onSuccess: (_result, sku) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      queryClient.removeQueries({ queryKey: productKeys.detail(sku) });
    },
  });
}
