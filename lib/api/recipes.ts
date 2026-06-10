import { useApiFetch } from '@/hooks/useApiFetch';
import type { Recipe } from '@/types/recipe';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipeKeys } from './queryKeys';

export function usePublicRecipes() {
  const apiFetch = useApiFetch();
  return useQuery<Recipe[]>({
    queryKey: recipeKeys.public(),
    queryFn: () => apiFetch('/recipes/public'),
  });
}

export function useRecipesMe() {
    const apiFetch = useApiFetch();
  return useQuery<Recipe[]>({
    queryKey: recipeKeys.mine(),
    queryFn: () => apiFetch('/recipes/me'),
  });
}

export function useRecipe(id: string) {
    const apiFetch = useApiFetch();
    return useQuery<Recipe>({
      queryKey: recipeKeys.detail(id),
      queryFn: () => apiFetch(`/recipes/${id}`),
    })
}

export function useCreateRecipe() {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();

  return useMutation<
    Recipe,
    Error,
    {
      name: string;
      description: string;
      total_time_minutes: number;
      servings: number;
      is_public: boolean;
      ingredients: {
        type_id: string;
        amount: number;
        preferred_product_sku: string;
      }[];
    }
  >({
    mutationFn: (recipe) =>
      apiFetch('/recipes/', {
        method: 'POST',
        body: JSON.stringify(recipe),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.mine(),
      });

      queryClient.invalidateQueries({
        queryKey: recipeKeys.public(),
      });
    },
  });
}

export function useUpdateRecipe(id: string) {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();

  return useMutation<
    Recipe,
    Error,
    {
      name: string;
      description: string;
      total_time_minutes: number;
      servings: number;
      is_public: boolean;
      ingredients: {
        type_id: string;
        amount: number;
        preferred_product_sku: string;
      }[];
    }
  >({
    mutationFn: (recipe) =>
      apiFetch(`/recipes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(recipe),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.mine(),
      });

      queryClient.invalidateQueries({
        queryKey: recipeKeys.public(),
      });

      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(id),
      });

    },
  });
}

export function useDeleteRecipe(id: string) {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () =>
      apiFetch(`/recipes/${id}`, {
        method: 'DELETE',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recipeKeys.mine(),
      });

      queryClient.invalidateQueries({
        queryKey: recipeKeys.public(),
      });
    },
  });
}