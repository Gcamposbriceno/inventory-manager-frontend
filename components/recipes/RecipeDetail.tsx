import { BackButton } from '@/components/BackButton';
import { RECIPES } from '@/constants/mockRecipes';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  mode: 'mine' | 'public';
};

export function RecipeDetail({ mode }: Props) {
  const { id } = useLocalSearchParams();
  const recipe = RECIPES.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cream dark:bg-[#161614]">
        <Text className="text-ink dark:text-[#F2F0EB]">Receta no encontrada</Text>
      </SafeAreaView>
    );
  }

  const actionLabel =
    mode === 'mine' ? 'Editar receta' : 'Añadir a mis recetas';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pt-2 pb-10"
        >
          <BackButton variant="icon" className="mb-5" />

          <View className="w-full h-48 rounded-3xl bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-6">
            <Ionicons name="restaurant-outline" size={56} color="#2D6A4F" />
          </View>

          <Text className="font-display text-[30px] text-ink dark:text-[#F2F0EB]">
            {recipe.name}
          </Text>

          <View className="flex-row gap-5 mt-4 mb-5">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="time-outline" size={16} color="#9E9B95" />
              <Text className="text-ink dark:text-[#F2F0EB]">{recipe.duration}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="people-outline" size={16} color="#9E9B95" />
              <Text className="text-ink dark:text-[#F2F0EB]">{recipe.servings}</Text>
            </View>
          </View>

          <Pressable
            onPress={() => {}}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-3 mb-6 active:opacity-80"
          >
            <Ionicons name="create-outline" size={18} color="#2D6A4F" />
            <Text className="text-[14px] font-semibold text-forest dark:text-mint">
              {actionLabel}
            </Text>
          </Pressable>

          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] p-4 mb-4">
            <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble mb-2">
              Preparación
            </Text>
            <Text className="text-[14px] text-ink dark:text-[#F2F0EB] leading-6">
              {recipe.description}
            </Text>
          </View>

          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] p-4">
            <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble mb-2">
              Ingredientes
            </Text>
            <Text className="text-[14px] text-ink dark:text-[#F2F0EB] leading-6">
              Placeholder de ingredientes
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
