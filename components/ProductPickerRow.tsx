import {
  useAddPantryProduct,
  useRemovePantryProduct,
  useUpdatePantryStock,
} from '@/lib/api/pantries';
import type { Product } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface Props {
  product: Product;
  pantryId: string;
  isAdded: boolean;
  currentStock?: number;
}

export function ProductPickerRow({ product, pantryId, isAdded, currentStock }: Props) {
  const colors = useThemeColors();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [qty, setQty] = useState('1');

  const addProduct = useAddPantryProduct();
  const updateStock = useUpdatePantryStock();
  const removeProduct = useRemovePantryProduct();
  const isLoading = addProduct.isPending || updateStock.isPending;
  const error = addProduct.error ?? updateStock.error;

  function validQty() {
    const n = parseInt(qty, 10);
    return isNaN(n) || n < 1 ? 1 : Math.min(n, 999);
  }

  function inc() {
    setQty((v) => String(Math.min(999, (parseInt(v) || 0) + 1)));
  }
  function dec() {
    setQty((v) => String(Math.max(1, (parseInt(v) || 1) - 1)));
  }

  function cancel() {
    setPickerOpen(false);
    setQty('1');
  }

  async function handleConfirm() {
    const amount = validQty();
    try {
      await addProduct.mutateAsync({ pantryId, sku: product.sku });
      if (amount > 0) {
        await updateStock.mutateAsync({ pantryId, sku: product.sku, stock: amount });
      }
      cancel();
    } catch {
      // error surfaced below via mutation.error
    }
  }

  return (
    <View>
      {/* Product info row */}
      <View className="flex-row items-center justify-between">
        {/* Thumbnail */}
        <View className="w-10 h-10 rounded-lg bg-stone dark:bg-[#2E2E2C] overflow-hidden mr-3 items-center justify-center flex-shrink-0">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="cube-outline" size={20} color={colors.muted} />
          )}
        </View>

        <View className="flex-1 pr-3">
          <Text
            className={`text-[15px] font-medium ${isAdded ? 'text-pebble' : 'text-ink dark:text-[#F2F0EB]'}`}
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <Text className="text-[12px] text-pebble mt-0.5">
            {product.brand} · {product.unit_amount}
          </Text>
        </View>

        {isAdded ? (
          <View className="flex-row items-center gap-2">
            <View className="bg-mist dark:bg-[#0D2B1A] px-2.5 py-1 rounded-lg">
              <Text className="text-[12px] font-bold text-forest dark:text-mint">
                ×{currentStock ?? 0}
              </Text>
            </View>
            <Pressable
              className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950 items-center justify-center active:opacity-70"
              disabled={removeProduct.isPending}
              onPress={() => removeProduct.mutate({ pantryId, sku: product.sku })}
            >
              {removeProduct.isPending ? (
                <ActivityIndicator size="small" color={colors.expired} />
              ) : (
                <Ionicons name="trash-outline" size={15} color={colors.expired} />
              )}
            </Pressable>
          </View>
        ) : !pickerOpen ? (
          <Pressable
            className="w-9 h-9 rounded-full bg-forest dark:bg-mint items-center justify-center active:opacity-70"
            onPress={() => setPickerOpen(true)}
          >
            <Ionicons name="add" size={20} color={colors.cream} />
          </Pressable>
        ) : null}
      </View>

      {/* Inline quantity picker */}
      {pickerOpen && (
        <View className="mt-2 mb-1 p-3 rounded-xl bg-stone dark:bg-[#1A1A18]">
          <Text className="text-[12px] text-pebble text-center mb-3">Cantidad</Text>

          <View className="flex-row items-center justify-center gap-5">
            <Pressable
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#2E2E2C] items-center justify-center active:opacity-60"
              onPress={dec}
            >
              <Text className="text-[22px] font-light text-ink dark:text-[#F2F0EB] leading-none">
                −
              </Text>
            </Pressable>

            <TextInput
              className="text-[28px] font-semibold text-ink dark:text-[#F2F0EB] text-center"
              style={{ minWidth: 52 }}
              value={qty}
              onChangeText={(t) => setQty(t.replace(/[^0-9]/g, ''))}
              onBlur={() => setQty(String(validQty()))}
              keyboardType="number-pad"
              selectTextOnFocus
            />

            <Pressable
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#2E2E2C] items-center justify-center active:opacity-60"
              onPress={inc}
            >
              <Text className="text-[22px] font-light text-ink dark:text-[#F2F0EB] leading-none">
                +
              </Text>
            </Pressable>
          </View>

          {error && (
            <Text className="text-red-500 text-[11px] text-center mt-2">
              {error.message ?? 'Error al agregar. Intenta de nuevo.'}
            </Text>
          )}

          <View className="flex-row gap-2 mt-3">
            <Pressable
              className="flex-1 py-2.5 rounded-xl border border-stone dark:border-[#2E2E2C] items-center active:opacity-70"
              onPress={cancel}
              disabled={isLoading}
            >
              <Text className="text-[13px] font-medium text-pebble">Cancelar</Text>
            </Pressable>
            <Pressable
              className="flex-1 py-2.5 rounded-xl bg-forest dark:bg-mint items-center active:opacity-80"
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#F2F0EB" />
              ) : (
                <Text className="text-[13px] font-semibold text-cream dark:text-[#161614]">
                  Agregar
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
