import { useApiFetch } from '@/hooks/useApiFetch';
import type {
  AddPantryProductTypeData,
  Pantry,
  PantryMember,
  PantryProduct,
  PantryProductType,
  PantryTypeOverview,
  UpdatePantryProductTypeData,
} from '@/types/pantry';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { pantryKeys } from './queryKeys';

// --- Overview ---
export function usePantry() {
  const apiFetch = useApiFetch();
  const { isLoaded } = useAuth();

  return useQuery<Pantry[]>({
    queryKey: pantryKeys.list(),
    enabled: isLoaded,
    queryFn: async () => {
      return apiFetch("/pantries/");
    },
  });
}

export function usePantryOverview(pantryId: string) {
  const apiFetch = useApiFetch();
  return useQuery<PantryTypeOverview[]>({
    queryKey: pantryKeys.overview(pantryId),
    queryFn: () => apiFetch(`/pantries/${pantryId}/overview`),
    enabled: !!pantryId,
  });
}

export function useAllPantriesOverview(pantries: Pantry[]) {
  const apiFetch = useApiFetch();
  return useQueries({
    queries: pantries.map((p) => ({
      queryKey: pantryKeys.overview(p.id),
      queryFn: () => apiFetch<PantryTypeOverview[]>(`/pantries/${p.id}/overview`),
      enabled: !!p.id,
    })),
  });
}

// --- Pantry CRUD ---

export function usePantries() {
  const apiFetch = useApiFetch();
  return useQuery<Pantry[]>({
    queryKey: pantryKeys.all(),
    queryFn: () => apiFetch('/pantries/'),
  });
}

export function useCreatePantry() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<Pantry, Error, string>({
    mutationFn: (name) =>
      apiFetch('/pantries/', { method: 'POST', body: JSON.stringify({ name }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

export function useJoinPantry() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<Pantry, Error, string>({
    mutationFn: (id_code) =>
      apiFetch('/pantries/join', { method: 'POST', body: JSON.stringify({ id_code }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

export function useUpdatePantry() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<Pantry, Error, { id: string; name: string }>({
    mutationFn: ({ id, name }) =>
      apiFetch(`/pantries/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
      queryClient.invalidateQueries({ queryKey: pantryKeys.detail(id) });
    },
  });
}

export function useDeletePantry() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: (id) => apiFetch(`/pantries/${id}`, { method: 'DELETE' }),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
      queryClient.removeQueries({ queryKey: pantryKeys.detail(id) });
    },
  });
}

// --- Members ---

export function usePantryMembers(pantryId: string) {
  const apiFetch = useApiFetch();
  return useQuery<PantryMember[]>({
    queryKey: pantryKeys.members(pantryId),
    queryFn: () => apiFetch(`/pantries/${pantryId}/members`),
    enabled: !!pantryId,
  });
}

export function useSetPantryNickname() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, { pantryId: string; nickname: string }>({
    mutationFn: ({ pantryId, nickname }) =>
      apiFetch(`/pantries/${pantryId}/nickname`, { method: 'PATCH', body: JSON.stringify({ nickname }) }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.members(pantryId) });
    },
  });
}

export function useLeavePantry() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: (pantryId) =>
      apiFetch(`/pantries/${pantryId}/leave`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

export function useRemovePantryMember() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, { pantryId: string; userId: string }>({
    mutationFn: ({ pantryId, userId }) =>
      apiFetch(`/pantries/${pantryId}/members/${userId}`, { method: 'DELETE' }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.members(pantryId) });
    },
  });
}

export function usePromotePantryMember() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, { pantryId: string; userId: string }>({
    mutationFn: ({ pantryId, userId }) =>
      apiFetch(`/pantries/${pantryId}/members/${userId}/promote`, { method: 'PATCH' }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.members(pantryId) });
    },
  });
}

// --- Products in pantry ---

export function usePantryProducts(pantryId: string) {
  const apiFetch = useApiFetch();
  return useQuery<PantryProduct[]>({
    queryKey: pantryKeys.products(pantryId),
    queryFn: () => apiFetch(`/pantries/${pantryId}/products`),
    enabled: !!pantryId,
  });
}

export function useAddPantryProduct() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<PantryProduct, Error, { pantryId: string; sku: string }>({
    mutationFn: ({ pantryId, sku }) =>
      apiFetch(`/pantries/${pantryId}/products`, { method: 'POST', body: JSON.stringify({ product_sku: sku }) }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.products(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.overview(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

export function useUpdatePantryStock() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<PantryProduct, Error, { pantryId: string; sku: string; stock: number }>({
    mutationFn: ({ pantryId, sku, stock }) =>
      apiFetch(`/pantries/${pantryId}/products/${sku}`, { method: 'PATCH', body: JSON.stringify({ stock }) }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.products(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.overview(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

export function useRemovePantryProduct() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, { pantryId: string; sku: string }>({
    mutationFn: ({ pantryId, sku }) =>
      apiFetch(`/pantries/${pantryId}/products/${sku}`, { method: 'DELETE' }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.products(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.overview(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

// --- Product types in pantry ---

export function usePantryProductTypes(pantryId: string) {
  const apiFetch = useApiFetch();
  return useQuery<PantryProductType[]>({
    queryKey: pantryKeys.productTypes(pantryId),
    queryFn: () => apiFetch(`/pantries/${pantryId}/product-types`),
    enabled: !!pantryId,
  });
}

export function useAddPantryProductType() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<PantryProductType, Error, { pantryId: string; data: AddPantryProductTypeData }>({
    mutationFn: ({ pantryId, data }) =>
      apiFetch(`/pantries/${pantryId}/product-types`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.productTypes(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.overview(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

export function useUpdatePantryProductType() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<PantryProductType, Error, { pantryId: string; typeId: string; data: UpdatePantryProductTypeData }>({
    mutationFn: ({ pantryId, typeId, data }) =>
      apiFetch(`/pantries/${pantryId}/product-types/${typeId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.productTypes(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}

export function useRemovePantryProductType() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  return useMutation<null, Error, { pantryId: string; typeId: string }>({
    mutationFn: ({ pantryId, typeId }) =>
      apiFetch(`/pantries/${pantryId}/product-types/${typeId}`, { method: 'DELETE' }),
    onSuccess: (_result, { pantryId }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.productTypes(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.overview(pantryId) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.all() });
    },
  });
}
