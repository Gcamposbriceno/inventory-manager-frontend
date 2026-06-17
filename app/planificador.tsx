import { DAYS, todayKey, usePlanner, type DayKey } from '@/context/PlannerContext';
import { usePublicRecipes, useRecipesMe } from '@/lib/api/recipes';
import type { Recipe } from '@/types/recipe';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlanificadorScreen() {
  const { weekPlan, addRecipeToDay, updatePorciones, removeFromDay } = usePlanner();
  const [selectedDay, setSelectedDay] = useState<DayKey>(todayKey());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const { data: myRecipes = [] } = useRecipesMe();
  const { data: publicRecipes = [] } = usePublicRecipes();

  const allRecipes = useMemo(() => {
    const seen = new Set<string>();
    const combined: Recipe[] = [];
    for (const rec of [...myRecipes, ...publicRecipes]) {
      if (seen.has(rec.id)) continue;
      seen.add(rec.id);
      combined.push(rec);
    }
    return combined;
  }, [myRecipes, publicRecipes]);

  const filteredRecipes = allRecipes.filter((rec) =>
    rec.name.toLowerCase().includes(pickerSearch.toLowerCase()),
  );

  const today = todayKey();
  const meals = weekPlan[selectedDay] ?? [];
  const totalMeals = DAYS.reduce((n, d) => n + (weekPlan[d.key]?.length ?? 0), 0);
  const selectedDayFull = DAYS.find((d) => d.key === selectedDay)?.full ?? '';

  function openPicker() {
    setPickerSearch('');
    setPickerOpen(true);
  }

  if (pickerOpen) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
        <View className="px-5 pt-4 pb-3">
          <Pressable
            onPress={() => setPickerOpen(false)}
            className="flex-row items-center gap-1 mb-5 active:opacity-60"
          >
            <Ionicons name="chevron-back" size={18} color="#9E9B95" />
            <Text className="text-[14px] text-pebble">Volver al plan</Text>
          </Pressable>
          <Text className="font-display text-[22px] text-ink dark:text-[#F2F0EB] mb-1">
            Elegir receta
          </Text>
          <Text className="text-[13px] text-pebble mb-4">Para {selectedDayFull}</Text>
          <View className="flex-row items-center bg-stone dark:bg-[#2A2A28] rounded-xl px-3 gap-2">
            <Ionicons name="search-outline" size={18} color="#9E9B95" />
            <TextInput
              value={pickerSearch}
              onChangeText={setPickerSearch}
              placeholder="Buscar receta…"
              placeholderTextColor="#9E9B95"
              autoFocus
              className="flex-1 py-3.5 text-[15px] text-ink dark:text-[#F2F0EB]"
            />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {filteredRecipes.length === 0 ? (
            <View className="items-center justify-center gap-2.5 pt-12">
              <Ionicons name="search-outline" size={40} color="#9E9B95" />
              <Text className="text-[14px] text-pebble">Sin resultados</Text>
            </View>
          ) : (
            filteredRecipes.map((rec, i) => (
              <Pressable
                key={rec.id}
                onPress={() => {
                  addRecipeToDay(selectedDay, rec);
                  setPickerOpen(false);
                  setPickerSearch('');
                }}
                className={`flex-row items-center gap-3 py-3.5 active:opacity-70 ${
                  i < filteredRecipes.length - 1 ? 'border-b border-stone dark:border-[#2E2E2C]' : ''
                }`}
              >
                <View className="w-[38px] h-[38px] rounded-[10px] bg-mist dark:bg-[#0D2B1A] items-center justify-center">
                  <Ionicons name="restaurant-outline" size={17} color="#2D6A4F" />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-medium text-ink dark:text-[#F2F0EB]">
                    {rec.name}
                  </Text>
                  <Text className="text-[12px] text-pebble mt-0.5">
                    {rec.total_time_minutes} min · {rec.servings} personas
                  </Text>
                </View>
                <View className="w-[30px] h-[30px] rounded-lg bg-mist dark:bg-[#0D2B1A] items-center justify-center">
                  <Text className="text-[20px] text-sage" style={{ lineHeight: 20, fontWeight: '300' }}>
                    +
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <View className="px-5 pt-4">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1 mb-5 active:opacity-60"
        >
          <Ionicons name="chevron-back" size={18} color="#9E9B95" />
          <Text className="text-[14px] text-pebble">Volver</Text>
        </Pressable>

        <Text className="font-display text-[26px] text-ink dark:text-[#F2F0EB]">Semana</Text>
        <Text className="text-[13px] text-pebble mt-0.5 mb-4">
          {totalMeals === 0
            ? 'Sin recetas planificadas'
            : `${totalMeals} receta${totalMeals > 1 ? 's' : ''} esta semana`}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-[7px] pb-4">
          {DAYS.map((d) => {
            const active = selectedDay === d.key;
            const isToday = d.key === today;
            const count = weekPlan[d.key]?.length ?? 0;
            return (
              <Pressable
                key={d.key}
                onPress={() => setSelectedDay(d.key)}
                className={`items-center gap-1 px-3.5 py-2.5 rounded-2xl ${
                  active
                    ? 'bg-forest'
                    : isToday
                      ? 'bg-mist dark:bg-[#0D2B1A]'
                      : 'bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C]'
                }`}
              >
                <Text
                  className={`text-[13px] font-semibold ${
                    active ? 'text-cream' : isToday ? 'text-forest dark:text-mint' : 'text-pebble'
                  }`}
                >
                  {d.label}
                </Text>
                {count > 0 ? (
                  <View
                    className={`w-4 h-4 rounded-full items-center justify-center ${
                      active ? 'bg-white/20' : 'bg-mint'
                    }`}
                  >
                    <Text className={`text-[9px] font-bold ${active ? 'text-cream' : 'text-forest'}`}>
                      {count}
                    </Text>
                  </View>
                ) : (
                  <View className={`w-1 h-1 rounded-full ${isToday ? 'bg-sage' : 'bg-transparent'}`} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8" showsVerticalScrollIndicator={false}>
        {meals.length === 0 ? (
          <View className="items-center justify-center gap-3 pt-12">
            <View className="w-16 h-16 rounded-[20px] bg-stone dark:bg-[#2A2A28] items-center justify-center">
              <Ionicons name="restaurant-outline" size={28} color="#9E9B95" />
            </View>
            <Text className="font-display text-[18px] text-ink dark:text-[#F2F0EB] mt-1">
              {selectedDayFull}
            </Text>
            <Text className="text-[14px] text-pebble">Sin recetas para este día</Text>
            <Pressable
              onPress={openPicker}
              className="flex-row items-center gap-2 mt-2 px-6 py-3 rounded-xl bg-forest active:opacity-80"
            >
              <Ionicons name="add" size={18} color="#F8F7F4" />
              <Text className="text-[14px] font-semibold text-cream">Agregar receta</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {meals.map((meal) => (
              <View
                key={meal.uid}
                className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] p-4 mb-3"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold text-ink dark:text-[#F2F0EB]">
                      {meal.name}
                    </Text>
                    <View className="flex-row gap-3.5 mt-1.5">
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="time-outline" size={13} color="#9E9B95" />
                        <Text className="text-[12px] text-pebble">{meal.totalTimeMinutes} min</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="people-outline" size={13} color="#9E9B95" />
                        <Text className="text-[12px] text-pebble">base: {meal.servings}p</Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => removeFromDay(selectedDay, meal.uid)}
                    className="pl-2 pt-0.5 active:opacity-60"
                  >
                    <Ionicons name="close" size={16} color="#9E9B95" />
                  </Pressable>
                </View>

                <View className="flex-row items-center justify-between border-t border-stone dark:border-[#2E2E2C] pt-3">
                  <Text className="text-[13px] text-pebble">Porciones</Text>
                  <View className="flex-row items-center gap-3.5">
                    <Pressable
                      onPress={() => updatePorciones(selectedDay, meal.uid, -1)}
                      disabled={meal.porciones <= 1}
                      className={`w-[30px] h-[30px] rounded-lg items-center justify-center border border-stone ${
                        meal.porciones > 1 ? 'bg-stone' : 'bg-transparent'
                      }`}
                    >
                      <Text
                        className={`text-[18px] ${meal.porciones > 1 ? 'text-ink' : 'text-pebble'}`}
                        style={{ fontWeight: '300', lineHeight: 18 }}
                      >
                        −
                      </Text>
                    </Pressable>
                    <Text className="text-[18px] font-semibold text-ink dark:text-[#F2F0EB] w-[22px] text-center">
                      {meal.porciones}
                    </Text>
                    <Pressable
                      onPress={() => updatePorciones(selectedDay, meal.uid, 1)}
                      className="w-[30px] h-[30px] rounded-lg items-center justify-center bg-mist dark:bg-[#0D2B1A]"
                    >
                      <Text className="text-[18px] text-sage" style={{ fontWeight: '300', lineHeight: 18 }}>
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}

            <Pressable
              onPress={openPicker}
              className="flex-row items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-stone active:opacity-70"
            >
              <Text className="text-[20px] text-pebble" style={{ lineHeight: 20 }}>
                +
              </Text>
              <Text className="text-[14px] text-pebble">Agregar otra receta</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
