import type { Recipe } from '@/types/recipe';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type Props = {
  recipe: Recipe;
  mode: 'mine' | 'public';
};

export function RecipeCard({ recipe, mode }: Props) {
  const pathname =
    mode === 'mine'
      ? ('/recetas/[id]' as const)
      : ('/recetas/publicas/[id]' as const);

  return (
    <Pressable
      onPress={() => router.push({ pathname, params: { id: recipe.id.toString() } })}
      className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-4 active:opacity-80"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text
            className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB]"
            numberOfLines={1}
          >
            {recipe.name}
          </Text>
        </View>
        <View className="w-10 h-10 rounded-xl bg-mist dark:bg-[#0D2B1A] items-center justify-center">
          <Ionicons name="restaurant-outline" size={18} color="#2D6A4F" />
        </View>
      </View>

      <View className="flex-row items-center gap-4 mt-3 pt-3 border-t border-stone dark:border-[#2E2E2C]">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="time-outline" size={14} color="#9E9B95" />
          <Text className="text-[12px] text-ink dark:text-[#F2F0EB]">{recipe.total_time_minutes}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="people-outline" size={14} color="#9E9B95" />
          <Text className="text-[12px] text-ink dark:text-[#F2F0EB]">{recipe.servings}</Text>
        </View>
      </View>
    </Pressable>
  );
}
