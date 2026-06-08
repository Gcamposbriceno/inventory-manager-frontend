import { BackButton } from '@/components/BackButton';
import { useProduct } from '@/lib/api/products';
import { useProductTypes } from '@/lib/api/productTypes';
import { useCreateRecipe, useRecipe } from '@/lib/api/recipes';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  mode: 'mine' | 'public';
};

type IngredientRowProps = {
  ingredient: {
    type_id: string;
    amount: number;
    preferred_product_sku: string;
  };
  typeName: string;
};

function IngredientRow({
  ingredient,
  typeName,
}: IngredientRowProps) {
  const { data: product } = useProduct(
    ingredient.preferred_product_sku
  );

  return (
    <View className="border-b border-stone dark:border-[#2E2E2C] pb-2">
      <View className="flex-row justify-between items-center">
        <View className="flex-1 mr-3">
          <Text className="text-[14px] text-ink dark:text-[#F2F0EB]">
            {typeName}
          </Text>

          <Text className="text-[12px] text-pebble mt-1">
            {product?.name ??
              ingredient.preferred_product_sku}
          </Text>
        </View>

        <Text className="text-[14px] text-pebble">
          {ingredient.amount}
        </Text>
      </View>
    </View>
  );
}

export function RecipeDetail({ mode }: Props) {
  const { id } = useLocalSearchParams();
  const { data: productTypes = [] } = useProductTypes();
  const createRecipe = useCreateRecipe();
  const { userId } = useAuth();

  const typeNames = Object.fromEntries(
    productTypes.map((type) => [type.id, type.name])
  );

  const { data: recipe, isLoading, isError } = useRecipe(
    id as string
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Cargando receta...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !recipe) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Receta no encontrada</Text>
      </SafeAreaView>
    );
  }

  const isMine = recipe.user_id === userId;

  const actionLabel =
    mode === 'mine'
      ? 'Editar receta'
      : isMine
        ? 'Ya es tuya la receta'
        : 'Añadir a mis recetas';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        className="flex-1 bg-cream dark:bg-[#161614]"
        edges={['top']}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pt-2 pb-10"
        >
          <BackButton
            variant="icon"
            className="mb-5"
          />

          <View className="w-full h-48 rounded-3xl bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-6">
            <Ionicons
              name="restaurant-outline"
              size={56}
              color="#2D6A4F"
            />
          </View>

          <Text className="font-display text-[30px] text-ink dark:text-[#F2F0EB]">
            {recipe.name}
          </Text>

          <View className="flex-row gap-5 mt-4 mb-5">
            <View className="flex-row items-center gap-1.5">
              <Ionicons
                name="time-outline"
                size={16}
                color="#9E9B95"
              />
              <Text className="text-ink dark:text-[#F2F0EB]">
                {recipe.total_time_minutes}
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Ionicons
                name="people-outline"
                size={16}
                color="#9E9B95"
              />
              <Text className="text-ink dark:text-[#F2F0EB]">
                {recipe.servings}
              </Text>
            </View>
          </View>

          <Pressable
            disabled={mode !== 'mine' && isMine}
            onPress={() => {
              if (mode === 'mine') {
                router.push({
                  pathname: '/recetas/[id]/editar',
                  params: { id: recipe.id },
                });
                return;
              }

              if (isMine) {
                return;
              }

              createRecipe.mutate(
                {
                  name: recipe.name,
                  description: recipe.description,
                  total_time_minutes:
                    recipe.total_time_minutes,
                  servings: recipe.servings,
                  is_public: false,
                  ingredients:
                    recipe.ingredients.map(
                      (ingredient) => ({
                        type_id:
                          ingredient.type_id,
                        amount:
                          ingredient.amount,
                        preferred_product_sku:
                          ingredient.preferred_product_sku,
                      })
                    ),
                },
                {
                  onSuccess: () => {
                    alert(
                      'Receta añadida a tus recetas'
                    );
                    router.replace('/recetas');
                  },
                }
              );
            }}
            className={`flex-row items-center justify-center gap-2 rounded-2xl border py-3 mb-6 ${
              mode !== 'mine' && isMine
                ? 'bg-gray-200 dark:bg-[#2A2A28] border-stone'
                : 'bg-white dark:bg-[#1E1E1C] border-stone'
            }`}
          >
            <Ionicons
              name={
                mode === 'mine'
                  ? 'create-outline'
                  : isMine
                    ? 'checkmark-circle-outline'
                    : 'copy-outline'
              }
              size={18}
              color="#2D6A4F"
            />

            <Text className="text-[14px] font-semibold text-forest dark:text-mint">
              {actionLabel}
            </Text>
          </Pressable>

          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] p-4">
            <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble mb-2">
              Ingredientes
            </Text>

            <View className="gap-3">
              {recipe.ingredients.map(
                (ingredient) => (
                  <IngredientRow
                    key={`${ingredient.type_id}-${ingredient.preferred_product_sku}`}
                    ingredient={
                      ingredient
                    }
                    typeName={
                      typeNames[
                        ingredient.type_id
                      ] ??
                      ingredient.type_id
                    }
                  />
                )
              )}
            </View>
          </View>

          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] p-4 mb-4">
            <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble mb-2">
              Preparación
            </Text>

            <Text className="text-[14px] text-ink dark:text-[#F2F0EB] leading-6">
              {recipe.description}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}