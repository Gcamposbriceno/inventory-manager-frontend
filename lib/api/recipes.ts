import { useApiFetch } from '@/hooks/useApiFetch';
import { useQuery } from '@tanstack/react-query';
import type { Recipe } from '@/types/recipe';
import { recipeKeys } from './queryKeys';

export function usePublicRecipes() {
  const apiFetch = useApiFetch();
  return useQuery<Recipe[]>({
    queryKey: recipeKeys.public(),
    queryFn: () => apiFetch('/recipes/public'),
  });
}
