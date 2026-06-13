import { useCreateRecipe } from '@/lib/api/recipes';
import { router } from 'expo-router';
import { RecipeForm } from './RecipeForm';

export function RecipeCreate() {
  const createRecipe = useCreateRecipe();

  return (
    <RecipeForm
      title="Crear Receta"
      subtitle="Completa la información de tu receta"
      submitLabel="Crear receta"
      isLoading={createRecipe.isPending}
      onSubmit={(data) =>
        createRecipe.mutate(
          {
            name: data.name,
            description: data.description,
            total_time_minutes: Number(data.total_time_minutes),
            servings: Number(data.servings),
            is_public: data.is_public,
            ingredients: data.ingredients.map((ingredient) => ({
              type_id: ingredient.type_id,
              amount: Number(ingredient.amount),
              preferred_product_sku:
                ingredient.preferred_product_id ?? '',
            })),
          },
          {
            onSuccess: () => {
              router.back();
            },
            onError: (error) => {
              alert(error.message);
            },
          }
        )
      }
    />
  );
}