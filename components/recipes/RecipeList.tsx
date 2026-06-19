import { useThemeColors } from '@/hooks/useThemeColors';
import { usePublicRecipes, useRecipesMe } from '@/lib/api/recipes';
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

  const { data: publicRecipes = [], isLoading: isLoadingPublic, isError: isErrorPublic } = usePublicRecipes();

  const { data: recipesMe = [], isLoading: isLoadingMine, isError: isErrorMine } = useRecipesMe();

  const recipes = mode === 'public' ? publicRecipes : recipesMe;
  const isLoading = mode === 'public' ? isLoadingPublic : isLoadingMine;
  const isError = mode === 'public' ? isErrorPublic : isErrorMine;

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
            className="flex-row items-center justify-center gap-2 rounded-xl bg-forest py-3 mb-4 active:opacity-80 active:scale-[0.98]"
          >
            <Ionicons name="search-outline" size={18} color={colors.cream} />
            <Text className="text-[15px] font-semibold text-cream">Explorar recetas</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.replace('/recetas')}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-forest py-3 mb-4 active:opacity-80 active:scale-[0.98]"
          >
            <Ionicons name="arrow-back-outline" size={18} color={colors.cream} />
            <Text className="text-[15px] font-semibold text-cream">Volver a Mis Recetas</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => router.push('/recetas/crear')}
          className="flex-row items-center justify-center gap-2 rounded-xl bg-forest py-3 mb-4 active:opacity-80 active:scale-[0.98]"
        >
          <Ionicons name="add-outline" size={18} color={colors.cream} />
          <Text className="text-[15px] font-semibold text-cream">
            Crear receta
          </Text>
        </Pressable>

        <View className="flex-row items-center rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 mb-6">
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nombre..."
            placeholderTextColor={colors.muted}
            className="flex-1 ml-2 text-[14px] text-ink dark:text-[#F2F0EB]"
          />
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-medium tracking-wide uppercase text-pebble">
            {sectionLabel}
          </Text>
          {!isLoading && <Text className="text-[13px] text-pebble">{filtered.length}</Text>}
        </View>

        {isLoading && mode === 'public' ? (
          <ActivityIndicator color={colors.primary} className="mt-10" />
        ) : isError && mode === 'public' ? (
          <View className="flex-1 items-center justify-center gap-3 py-12">
            <Ionicons name="cloud-offline-outline" size={48} color={colors.muted} />
            <Text className="text-[15px] text-pebble text-center">No se pudieron cargar las recetas</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-3 py-12">
            <Ionicons name="restaurant-outline" size={48} color={colors.muted} />
            <Text className="text-[15px] text-pebble text-center">No se encontraron recetas</Text>
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
