import { BackButton } from '@/components/BackButton';
import { ProductPickerRow } from '@/components/ProductPickerRow';
import { usePantryProducts } from '@/lib/api/pantries';
import { useProductTypeProducts } from '@/lib/api/productTypes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PantryAddProductScreen() {
  const { pantryId, typeName, pantryName } = useLocalSearchParams<{ pantryId: string; typeName: string; pantryName: string }>();
  const { muted } = useThemeColors();
  const [search, setSearch] = useState('');

  const { data: pantryProducts } = usePantryProducts(pantryId);
  const { data: typeProducts, isLoading } = useProductTypeProducts(typeName);

  const pantrySkuSet  = new Set((pantryProducts ?? []).map((p) => p.product_sku));
  const stockBySku    = Object.fromEntries((pantryProducts ?? []).map((p) => [p.product_sku, p.stock]));

  const q = search.toLowerCase();
  const filtered = (typeProducts ?? []).filter(
    (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
  );
  // not-in-pantry first, then already-added
  const sorted = [
    ...filtered.filter((p) => !pantrySkuSet.has(p.sku)),
    ...filtered.filter((p) => pantrySkuSet.has(p.sku)),
  ];

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <BackButton />
        <Text className="font-display text-[26px] text-ink dark:text-[#F2F0EB] mt-3 mb-0.5">
          {typeName}
        </Text>
        {pantryName ? (
          <Text className="text-[13px] font-medium text-forest dark:text-mint mb-1">{pantryName}</Text>
        ) : null}
        <Text className="text-[13px] text-pebble mb-4">
          Agrega productos de este tipo a tu despensa
        </Text>

        {/* Search */}
        <View className="flex-row items-center bg-stone dark:bg-[#1E1E1C] border border-transparent dark:border-[#2E2E2C] rounded-xl px-3 gap-2">
          <Ionicons name="search-outline" size={18} color={muted} />
          <TextInput
            className="flex-1 py-3.5 text-base text-ink dark:text-[#F2F0EB]"
            placeholder="Buscar por nombre o marca…"
            placeholderTextColor={muted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} className="p-1">
              <Ionicons name="close-circle" size={16} color={muted} />
            </Pressable>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.sku}
          contentContainerClassName="pb-10"
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => (
            <View className="h-px mx-5 bg-stone dark:bg-[#2E2E2C]" />
          )}
          renderItem={({ item }) => (
            <View className="px-5 py-3.5">
              <ProductPickerRow
                product={item}
                pantryId={pantryId}
                isAdded={pantrySkuSet.has(item.sku)}
                currentStock={stockBySku[item.sku]}
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center py-16 gap-2">
              <Ionicons name="search-outline" size={32} color={muted} />
              <Text className="text-[14px] text-pebble">Sin resultados para &quot;{search}&quot;</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
