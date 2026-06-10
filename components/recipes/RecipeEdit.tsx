import { useProductTypes } from '@/lib/api/productTypes';
import { useDeleteRecipe, useRecipe, useUpdateRecipe } from '@/lib/api/recipes';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { RecipeForm } from './RecipeForm';
export function RecipeEdit() {
  const { id } = useLocalSearchParams();

  const { data: recipe, isLoading } = useRecipe(id as string);
  const { data: productTypes = [] } = useProductTypes();

  const updateRecipe = useUpdateRecipe(id as string);
  const deleteRecipe = useDeleteRecipe(id as string);
  if (isLoading || !recipe) {
    return <Text>Cargando...</Text>;
  }

  const initialValues = {
    name: recipe.name,
    description: recipe.description,
    total_time_minutes: String(recipe.total_time_minutes),
    servings: String(recipe.servings),
    is_public: recipe.is_public,

    ingredients: recipe.ingredients.map((ingredient) => {
      const type = productTypes.find(
        (t) => t.id === ingredient.type_id
      );

      return {
        type_id: ingredient.type_id,
        amount: String(ingredient.amount),
        preferred_product_id:
          ingredient.preferred_product_sku,

        name: type?.name ?? '',
        measurement_unit:
          type?.measurement_unit ?? '',
      };
    }),
  };

    return (
      <View className="flex-1">
        <RecipeForm
          title="Editar Receta"
          subtitle="Modifica la información de tu receta"
          submitLabel="Guardar cambios"
          initialValues={initialValues}
          isLoading={updateRecipe.isPending}
          onSubmit={(data) =>
            updateRecipe.mutate(
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
              }
            )
          }
        />
        <Pressable
          className="mx-5 mt-4 mb-6 rounded-2xl border border-red-500 py-4 items-center"
          onPress={() => {
            deleteRecipe.mutate(undefined, {
              onSuccess: () => {
                router.replace('/recetas');
              },
              onError: (error) => {
                console.error('Error eliminando receta:', error);
              },
            });
          }}
        >
          <Text className="font-semibold text-red-500">
            Eliminar receta
          </Text>
        </Pressable>
      </View>
    );
}