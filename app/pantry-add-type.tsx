import { BackButton } from '@/components/BackButton';
import { ProductPickerRow } from '@/components/ProductPickerRow';
import { TextField } from '@/components/TextField';
import { useAddPantryProductType, usePantryProducts } from '@/lib/api/pantries';
import { useProductTypeProducts, useProductTypes } from '@/lib/api/productTypes';
import { addPantryTypeSchema, type AddPantryTypeFormData } from '@/lib/validation';
import type { ProductType } from '@/types/productType';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

const UNIT_LABEL: Record<string, string> = {
  kg: 'kg', l: 'L', ml: 'ml', g: 'g', un: 'unidades',
};

// --- Expandable products panel (used in step 2) ---

function ProductsPanel({ pantryId, typeName }: { pantryId: string; typeName: string }) {
  const { muted } = useThemeColors();
  const [search, setSearch] = useState('');

  const { data: pantryProducts } = usePantryProducts(pantryId);
  const { data: typeProducts, isLoading } = useProductTypeProducts(typeName);

  const pantrySkuSet = new Set((pantryProducts ?? []).map((p) => p.product_sku));
  const stockBySku   = Object.fromEntries((pantryProducts ?? []).map((p) => [p.product_sku, p.stock]));

  const q = search.toLowerCase();
  const filtered = (typeProducts ?? []).filter(
    (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
  );
  const sorted = [
    ...filtered.filter((p) => !pantrySkuSet.has(p.sku)),
    ...filtered.filter((p) => pantrySkuSet.has(p.sku)),
  ];

  return (
    <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden mb-4">
      {/* Search */}
      <View className="flex-row items-center border-b border-stone dark:border-[#2E2E2C] px-3 gap-2">
        <Ionicons name="search-outline" size={16} color={muted} />
        <TextInput
          className="flex-1 py-3 text-[14px] text-ink dark:text-[#F2F0EB]"
          placeholder="Buscar producto…"
          placeholderTextColor={muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} className="p-1">
            <Ionicons name="close-circle" size={14} color={muted} />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="small" />
        </View>
      ) : sorted.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-[13px] text-pebble">Sin resultados</Text>
        </View>
      ) : (
        sorted.slice(0, 20).map((item, i) => (
          <View key={item.sku}>
            <View className="px-4 py-3">
              <ProductPickerRow
                product={item}
                pantryId={pantryId}
                isAdded={pantrySkuSet.has(item.sku)}
                currentStock={stockBySku[item.sku]}
              />
            </View>
            {i < Math.min(sorted.length, 20) - 1 && (
              <View className="h-px mx-4 bg-stone dark:bg-[#2E2E2C]" />
            )}
          </View>
        ))
      )}

      {sorted.length > 20 && (
        <View className="px-4 py-2 border-t border-stone dark:border-[#2E2E2C]">
          <Text className="text-[12px] text-pebble text-center">
            Mostrando 20 de {sorted.length}. Usa el buscador para filtrar.
          </Text>
        </View>
      )}
    </View>
  );
}

// --- Screen ---

export default function PantryAddTypeScreen() {
  const { pantryId, pantryName } = useLocalSearchParams<{ pantryId: string; pantryName: string }>();
  const { muted } = useThemeColors();

  const [step, setStep] = useState<'search' | 'configure'>('search');
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [search, setSearch] = useState('');
  const [prodExpanded, setProdExpanded] = useState(false);

  const { data: allTypes, isLoading: typesLoading } = useProductTypes();
  const addType = useAddPantryProductType();

  const filtered = (allTypes ?? []).filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPantryTypeFormData>({ resolver: zodResolver(addPantryTypeSchema) });

  function selectType(type: ProductType) {
    setSelectedType(type);
    setStep('configure');
    setProdExpanded(false);
    reset();
  }

  function backToSearch() {
    setStep('search');
    setSelectedType(null);
  }

  const onSubmit = ({ rop, desired_stock }: AddPantryTypeFormData) => {
    if (!selectedType || !pantryId) return;
    addType.mutate(
      {
        pantryId,
        data: {
          type_id: selectedType.id,
          rop: parseFloat(rop),
          desired_stock: parseFloat(desired_stock),
        },
      },
      { onSuccess: () => router.back() },
    );
  };

  // ── Step 1: search ──────────────────────────────────────────────────────────
  if (step === 'search') {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
        <View className="px-5 pt-4 pb-3">
          <BackButton />
          <Text className="font-display text-[26px] text-ink dark:text-[#F2F0EB] mt-3 mb-0.5">
            Agregar tipo
          </Text>
          {pantryName ? (
            <Text className="text-[13px] font-medium text-forest dark:text-mint mb-1">{pantryName}</Text>
          ) : null}
          <Text className="text-[13px] text-pebble mb-4">
            ¿Qué tipo de producto quieres seguir en esta despensa?
          </Text>

          <View className="flex-row items-center bg-stone dark:bg-[#1E1E1C] border border-transparent dark:border-[#2E2E2C] rounded-xl px-3 gap-2">
            <Ionicons name="search-outline" size={18} color={muted} />
            <TextInput
              className="flex-1 py-3.5 text-base text-ink dark:text-[#F2F0EB]"
              placeholder="Buscar tipo…"
              placeholderTextColor={muted}
              value={search}
              onChangeText={setSearch}
              autoFocus
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} className="p-1">
                <Ionicons name="close-circle" size={16} color={muted} />
              </Pressable>
            )}
          </View>
        </View>

        {typesLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-5 pb-10"
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => (
              <View className="h-px bg-stone dark:bg-[#2E2E2C]" />
            )}
            renderItem={({ item }) => (
              <Pressable
                className="flex-row items-center justify-between py-3.5 active:opacity-70"
                onPress={() => selectType(item)}
              >
                <View>
                  <Text className="text-[15px] font-medium text-ink dark:text-[#F2F0EB]">
                    {item.name}
                  </Text>
                  <Text className="text-[12px] text-pebble mt-0.5">
                    {UNIT_LABEL[item.measurement_unit] ?? item.measurement_unit}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={muted} />
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center py-12 gap-3">
                <Ionicons name="search-outline" size={48} color={muted} />
                <Text className="text-[15px] text-pebble text-center">Sin resultados para &quot;{search}&quot;</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    );
  }

  // ── Step 2: configure ───────────────────────────────────────────────────────
  const unit = UNIT_LABEL[selectedType?.measurement_unit ?? ''] ?? selectedType?.measurement_unit ?? '';

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-4 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            className="flex-row items-center gap-1 mb-4 self-start active:opacity-70"
            onPress={backToSearch}
          >
            <Ionicons name="chevron-back" size={18} color={muted} />
            <Text className="text-[14px] text-pebble">Cambiar tipo</Text>
          </Pressable>

          {/* Selected type header */}
          <View className="bg-mist dark:bg-[#0D2B1A] rounded-2xl px-4 py-3.5 mb-6 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-white dark:bg-[#1E1E1C] items-center justify-center">
              <Ionicons name="cube-outline" size={18} color="#2D6A4F" />
            </View>
            <View>
              <Text className="text-[15px] font-semibold text-ink dark:text-[#F2F0EB]">
                {selectedType?.name}
              </Text>
              <Text className="text-[12px] text-pebble">
                {unit}{pantryName ? ` · ${pantryName}` : ''}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="gap-4 mb-2">
            <Controller
              control={control}
              name="rop"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={`Mínimo aceptable (${unit})`}
                  placeholder="Ej: 1"
                  value={value != null ? String(value) : ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  error={errors.rop?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="desired_stock"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={`Stock deseado (${unit})`}
                  placeholder="Ej: 3"
                  value={value != null ? String(value) : ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  error={errors.desired_stock?.message}
                />
              )}
            />
          </View>

          <Text className="text-[12px] text-pebble text-center mb-6">
            Te avisaremos cuando el stock caiga por debajo del mínimo.
          </Text>

          {/* Expandable products section */}
          <Pressable
            className="flex-row items-center justify-between py-3 mb-3 border-b border-stone dark:border-[#2E2E2C] active:opacity-70"
            onPress={() => setProdExpanded((v) => !v)}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="bag-handle-outline" size={18} color="#9E9B95" />
              <Text className="text-[14px] font-semibold text-ink dark:text-[#F2F0EB]">
                Agregar productos
              </Text>
            </View>
            <Ionicons
              name={prodExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#9E9B95"
            />
          </Pressable>

          {prodExpanded && selectedType && pantryId && (
            <ProductsPanel
              pantryId={pantryId}
              typeName={selectedType.name}
            />
          )}

          {addType.error && (
            <Text className="text-red-500 text-sm mb-4 text-center">
              {addType.error.message ?? 'Ocurrió un error. Intenta de nuevo.'}
            </Text>
          )}

          <Pressable
            className="bg-forest py-3 rounded-xl items-center active:opacity-80 active:scale-[0.98]"
            onPress={handleSubmit(onSubmit)}
            disabled={addType.isPending}
          >
            <Text className="text-cream font-semibold text-base">
              {addType.isPending ? 'Guardando…' : 'Agregar a despensa'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
