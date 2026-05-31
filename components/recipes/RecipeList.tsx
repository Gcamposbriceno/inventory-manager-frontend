import { RECIPES } from '@/constants/mockRecipes';
import { usePublicRecipes } from '@/lib/api/recipes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from './RecipeCard';

type Props = {
  mode: 'mine' | 'public';
};

export function RecipeList({ mode }: Props) {
  const [search, setSearch] = useState('');
  const colors = useThemeColors();

  const { data: publicRecipes = [], isLoading, isError } = usePublicRecipes();
  const recipes = mode === 'public' ? publicRecipes : RECIPES;

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );
  const title        = mode === 'mine' ? 'Recetas'                    : 'Recetas Públicas';
  const subtitle     = mode === 'mine' ? 'Ve alguna receta de tu gusto' : 'Busca alguna receta de tu interés';
  const sectionLabel = mode === 'mine' ? 'Tus recetas'                : 'Recetas disponibles';

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-2 pb-28"
      >
        <View className="mb-6">
          <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">{title}</Text>
          <Text className="text-[14px] text-pebble mt-0.5">{subtitle}</Text>
        </View>

        {mode === 'mine' ? (
          <Pressable
            onPress={() => router.push('/recetas/publicas')}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-forest py-4 mb-4 active:opacity-80"
          >
            <Ionicons name="search-outline" size={18} color="#F8F7F4" />
            <Text className="text-[15px] font-semibold text-cream">Explorar recetas</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-forest py-4 mb-4 active:opacity-80"
          >
            <Ionicons name="arrow-back-outline" size={18} color="#F8F7F4" />
            <Text className="text-[15px] font-semibold text-cream">Volver a Mis Recetas</Text>
          </Pressable>
        )}

        <View className="flex-row items-center rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 mb-6">
          <Ionicons name="search-outline" size={18} color="#9E9B95" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nombre..."
            placeholderTextColor="#9E9B95"
            className="flex-1 ml-2 text-[14px] text-ink dark:text-[#F2F0EB]"
          />
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble">
            {sectionLabel}
          </Text>
          {!isLoading && <Text className="text-[13px] text-pebble">{filtered.length}</Text>}
        </View>

        {isLoading && mode === 'public' ? (
          <ActivityIndicator color={colors.primary} className="mt-10" />
        ) : isError && mode === 'public' ? (
          <View className="items-center py-10">
            <Ionicons name="cloud-offline-outline" size={28} color="#9E9B95" />
            <Text className="text-pebble mt-2">No se pudieron cargar las recetas</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center py-10">
            <Ionicons name="search-outline" size={28} color="#9E9B95" />
            <Text className="text-pebble mt-2">No se encontraron recetas</Text>
          </View>
        ) : (
          <View className="gap-3">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} mode={mode} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
