import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RECIPES } from './mock_recetas';

function RecipeCard({ recipe }: { recipe: typeof RECIPES[0] }) {
  return (
      <Pressable
        onPress={() => router.push({ pathname: '/recetas/[id]', params: { id: recipe.id.toString() } })}
        className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-4 active:opacity-80"
      >
      <View className="flex-row items-center justify-between">
        
        {/* Nombre */}
        <View className="flex-1 pr-3">
          <Text
            className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB]"
            numberOfLines={1}
          >
            {recipe.name}
          </Text>
        </View>

        {/* Icono */}
        <View className="w-10 h-10 rounded-xl bg-mist dark:bg-[#0D2B1A] items-center justify-center">
          <Ionicons
            name="restaurant-outline"
            size={18}
            color="#2D6A4F"
          />
        </View>
      </View>

      {/* Info */}
      <View className="flex-row items-center gap-4 mt-3 pt-3 border-t border-stone dark:border-[#2E2E2C]">
        <View className="flex-row items-center gap-1.5">
          <Ionicons
            name="time-outline"
            size={14}
            color="#9E9B95"
          />
          <Text className="text-[12px] text-ink dark:text-[#F2F0EB]">
            {recipe.duration}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          <Ionicons
            name="people-outline"
            size={14}
            color="#9E9B95"
          />
          <Text className="text-[12px] text-ink dark:text-[#F2F0EB]">
            {recipe.servings}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}


export default function RecetasScreen() {
  const [search, setSearch] = useState('');

  const filteredRecipes = RECIPES.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView
      className="flex-1 bg-cream dark:bg-[#161614]"
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-2 pb-28"
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">
            Recetas
          </Text>
          <Text className="text-[14px] text-pebble mt-0.5">
            Ve alguna receta de tu gusto
          </Text>
        </View>

        {/* Explorar */}
        <Pressable
          onPress={() => router.push('/recetas/publicas')}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-forest py-4 mb-4 active:opacity-80"
        >
          <Ionicons name="search-outline" size={18} color="#F8F7F4" />
          <Text className="text-[15px] font-semibold text-cream">
            Explorar recetas
          </Text>
        </Pressable>

        {/* Buscador */}
        <View className="flex-row items-center rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 mb-6">
          <Ionicons
            name="search-outline"
            size={18}
            color="#9E9B95"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nombre..."
            placeholderTextColor="#9E9B95"
            className="flex-1 ml-2 text-[14px] text-ink dark:text-[#F2F0EB]"
          />
        </View>

        {/* Tus recetas */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble">
            Tus recetas
          </Text>

          <Text className="text-[13px] text-pebble">
            {filteredRecipes.length}
          </Text>
        </View>

        <View className="gap-3">
          {filteredRecipes.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons
                name="search-outline"
                size={28}
                color="#9E9B95"
              />
              <Text className="text-pebble mt-2">
                No se encontraron recetas
              </Text>
            </View>
          ) : (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}