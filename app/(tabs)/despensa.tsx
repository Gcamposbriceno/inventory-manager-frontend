import { useThemeColors } from '@/hooks/useThemeColors';
import { usePantries, usePantryOverview, usePantryProducts, useRemovePantryProduct, useRemovePantryProductType, useUpdatePantryStock } from '@/lib/api/pantries';
import { useProductTypeProducts } from '@/lib/api/productTypes';
import type { PantryProduct, PantryTypeOverview } from '@/types/pantry';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- helpers ---

type Status = 'empty' | 'low' | 'partial' | 'ok';

function getStatus(r: PantryTypeOverview): Status {
  if (r.current_stock === 0) return 'empty';
  if (r.current_stock < r.rop) return 'low';
  if (r.current_stock < r.desired_stock) return 'partial';
  return 'ok';
}

// --- sub-components ---

function StatusBadge({ status }: { status: Status }) {
  if (status === 'empty')
    return (
      <View className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950">
        <Text className="text-[11px] font-medium text-red-600 dark:text-red-400">Agotado</Text>
      </View>
    );
  if (status === 'low')
    return (
      <View className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950">
        <Text className="text-[11px] font-medium text-amber-700 dark:text-amber-400">Bajo mín.</Text>
      </View>
    );
  if (status === 'partial')
    return (
      <View className="px-2 py-0.5 rounded-full bg-stone dark:bg-[#2E2E2C]">
        <Text className="text-[11px] font-medium text-pebble">Por reponer</Text>
      </View>
    );
  return (
    <View className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950">
      <Text className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">OK</Text>
    </View>
  );
}

// Expanded product list — fetches lazily only when rendered
function PantryTypeProducts({
  pantryId,
  pantryName,
  typeId,
  typeName,
  pantryProducts,
}: {
  pantryId: string;
  pantryName: string;
  typeId: string;
  typeName: string;
  pantryProducts: PantryProduct[];
}) {
  const { primary } = useThemeColors();
  const { data: typeProducts, isLoading } = useProductTypeProducts(typeName);

  const removeProduct    = useRemovePantryProduct();
  const updateStock      = useUpdatePantryStock();
  const removeType       = useRemovePantryProductType();
  const [confirmRemove, setConfirmRemove] = useState(false);

  const pantrySkuSet = new Set(pantryProducts.map((p) => p.product_sku));
  const stockBySku   = Object.fromEntries(pantryProducts.map((p) => [p.product_sku, p.stock]));
  const inPantry     = (typeProducts ?? []).filter((p) => pantrySkuSet.has(p.sku));

  return (
    <View className="border-t border-stone dark:border-[#2E2E2C] px-4 pt-3 pb-3.5 bg-stone/20 dark:bg-[#1A1A18]">
      {isLoading && <ActivityIndicator size="small" style={{ marginVertical: 8 }} />}

      {!isLoading && inPantry.length === 0 && (
        <Text className="text-[12px] text-pebble py-1 mb-1">Sin productos añadidos aún</Text>
      )}

      {inPantry.map((p) => {
        const stock      = stockBySku[p.sku] ?? 0;
        const isUpdating = updateStock.isPending && updateStock.variables?.sku === p.sku;
        const isRemoving = removeProduct.isPending && removeProduct.variables?.sku === p.sku;

        return (
          <View key={p.sku} className="flex-row items-center py-2 gap-2">
            {/* Thumbnail */}
            <View className="w-9 h-9 rounded-lg bg-stone dark:bg-[#2E2E2C] overflow-hidden items-center justify-center flex-shrink-0">
              {p.image_url ? (
                <Image source={{ uri: p.image_url }} style={{ width: 36, height: 36 }} resizeMode="contain" />
              ) : (
                <Ionicons name="cube-outline" size={16} color="#9E9B95" />
              )}
            </View>

            {/* Name + brand */}
            <View className="flex-1">
              <Text className="text-[13px] font-medium text-ink dark:text-[#F2F0EB]" numberOfLines={1}>
                {p.name}
              </Text>
              <Text className="text-[11px] text-pebble">{p.brand}</Text>
            </View>

            {/* Stock stepper */}
            <View className="flex-row items-center gap-1">
              <Pressable
                className="w-7 h-7 rounded-lg bg-stone dark:bg-[#2E2E2C] items-center justify-center active:opacity-60"
                disabled={isUpdating || stock === 0}
                onPress={() => updateStock.mutate({ pantryId, sku: p.sku, stock: stock - 1 })}
              >
                <Text className="text-[16px] font-light text-ink dark:text-[#F2F0EB] leading-none">−</Text>
              </Pressable>

              <View className="w-8 items-center">
                {isUpdating ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text className="text-[13px] font-bold text-ink dark:text-[#F2F0EB]">{stock}</Text>
                )}
              </View>

              <Pressable
                className="w-7 h-7 rounded-lg bg-stone dark:bg-[#2E2E2C] items-center justify-center active:opacity-60"
                disabled={isUpdating}
                onPress={() => updateStock.mutate({ pantryId, sku: p.sku, stock: stock + 1 })}
              >
                <Text className="text-[16px] font-light text-ink dark:text-[#F2F0EB] leading-none">+</Text>
              </Pressable>
            </View>

            {/* Remove product */}
            <Pressable
              className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950 items-center justify-center active:opacity-70"
              disabled={isRemoving}
              onPress={() => removeProduct.mutate({ pantryId, sku: p.sku })}
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color="#E76F51" />
              ) : (
                <Ionicons name="trash-outline" size={13} color="#E76F51" />
              )}
            </Pressable>
          </View>
        );
      })}

      {/* Bottom actions */}
      <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-stone/50 dark:border-[#2E2E2C]">
        <Pressable
          className="flex-row items-center gap-1.5 active:opacity-70"
          onPress={() =>
            router.push(
              `/pantry-add-product?pantryId=${pantryId}&pantryName=${encodeURIComponent(pantryName)}&typeName=${encodeURIComponent(typeName)}`,
            )
          }
        >
          <Ionicons name="add-circle-outline" size={15} color={primary} />
          <Text className="text-[13px] font-semibold text-forest dark:text-mint">Agregar producto</Text>
        </Pressable>

        {confirmRemove ? (
          <View className="flex-row items-center gap-2">
            <Text className="text-[12px] text-pebble">¿Eliminar tipo?</Text>
            <Pressable
              className="px-2.5 py-1 rounded-lg bg-stone dark:bg-[#2E2E2C] active:opacity-70"
              onPress={() => setConfirmRemove(false)}
            >
              <Text className="text-[12px] font-medium text-pebble">No</Text>
            </Pressable>
            <Pressable
              className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950 active:opacity-70"
              disabled={removeType.isPending}
              onPress={() => {
                setConfirmRemove(false);
                removeType.mutate({ pantryId, typeId });
              }}
            >
              {removeType.isPending ? (
                <ActivityIndicator size="small" color="#E76F51" />
              ) : (
                <Text className="text-[12px] font-semibold text-expired">Sí, eliminar</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <Pressable
            className="flex-row items-center gap-1 active:opacity-70"
            onPress={() => setConfirmRemove(true)}
          >
            <Ionicons name="trash-outline" size={13} color="#E76F51" />
            <Text className="text-[13px] font-medium text-expired">Eliminar tipo</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function PantryTypeRow({
  row,
  isLast,
  isExpanded,
  onToggle,
  pantryId,
  pantryName,
  pantryProducts,
}: {
  row: PantryTypeOverview;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  pantryId: string;
  pantryName: string;
  pantryProducts: PantryProduct[];
}) {
  const { warn, expired, primary, muted } = useThemeColors();
  const status = getStatus(row);
  const ratio = Math.min(row.current_stock / row.desired_stock, 1);

  const barColor =
    status === 'empty'   ? expired :
    status === 'low'     ? warn    :
    status === 'partial' ? warn    :
    primary;

  const iconBgClass =
    status === 'ok' || status === 'partial'
      ? 'w-8 h-8 rounded-lg bg-mist dark:bg-[#0D2B1A] items-center justify-center'
      : 'w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 items-center justify-center';

  return (
    <View>
      {/* Tappable header */}
      <Pressable
        className="flex-row items-center justify-between px-4 pt-3.5 pb-2 active:opacity-80"
        onPress={onToggle}
      >
        <View className="flex-row items-center gap-2.5 flex-1">
          <View className={iconBgClass}>
            <Ionicons name="cube-outline" size={15} color={barColor} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-semibold text-ink dark:text-[#F2F0EB]">
              {row.type_name}
            </Text>
            <Text className="text-[12px] text-pebble mt-0.5">
              {row.current_stock} / {row.desired_stock} {row.measurement_unit}
              {status === 'low' ? `  ·  mín. ${row.rop}` : ''}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <StatusBadge status={status} />
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={muted}
          />
        </View>
      </Pressable>

      {/* Progress bar */}
      <View className="mx-4 mb-3.5 h-1.5 rounded-full bg-stone dark:bg-[#2E2E2C]">
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${ratio * 100}%`, backgroundColor: barColor }}
        />
      </View>

      {/* Expandable product list */}
      {isExpanded && (
        <PantryTypeProducts
          pantryId={pantryId}
          pantryName={pantryName}
          typeId={row.type_id}
          typeName={row.type_name}
          pantryProducts={pantryProducts}
        />
      )}

      {!isLast && <View className="h-px mx-4 bg-stone dark:bg-[#2E2E2C]" />}
    </View>
  );
}

// --- screen ---

type Filter = 'all' | 'critical' | 'ok';

export default function DespensaScreen() {
  const { warn } = useThemeColors();
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedTypeId, setExpandedTypeId] = useState<string | null>(null);
  const { data: pantries, isLoading: pantriesLoading} = usePantries();
  console.log(pantries, "patnries")
  const [selectedPantryId, setSelectedPantryId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPantryId && pantries?.length) {
      setSelectedPantryId(pantries[0].id);
    }
  }, [pantries, selectedPantryId]);
  
  const { data: overview, isLoading: overviewLoading } = usePantryOverview(selectedPantryId!)
  const { data: pantryProducts } = usePantryProducts(selectedPantryId!);

  const selectedPantryName = (pantries ?? []).find((p) => p.id === selectedPantryId)?.name ?? '';

  const types = overview ?? [];
  const emptyCount    = types.filter((r) => getStatus(r) === 'empty').length;
  const criticalCount = types.filter((r) => ['empty', 'low'].includes(getStatus(r))).length;
  const okCount       = types.filter((r) => ['partial', 'ok'].includes(getStatus(r))).length;

  const filtered = types.filter((r) => {
    const s = getStatus(r);
    if (filter === 'critical') return s === 'empty' || s === 'low';
    if (filter === 'ok')       return s === 'partial' || s === 'ok';
    return true;
  });

  const isLoading = pantriesLoading || overviewLoading;

  function toggleType(typeId: string) {
    setExpandedTypeId((prev) => (prev === typeId ? null : typeId));
  }

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28"
      >
        {/* Header */}
        <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">Despensa</Text>
            <Text className="text-[13px] text-pebble mt-0.5">Gestiona tu inventario</Text>
          </View>
          {selectedPantryId && (
            <Pressable
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] items-center justify-center active:opacity-70"
              onPress={() =>
                router.push(
                  `/pantry-share?pantryId=${selectedPantryId}&pantryName=${encodeURIComponent(selectedPantryName)}`,
                )
              }
            >
              <Ionicons name="share-social-outline" size={18} color="#9E9B95" />
            </Pressable>
          )}
        </View>

        {/* Pantry selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5"
          contentContainerClassName="px-5 gap-2 flex-row"
        >
          {(pantries ?? []).map((p) => (
            <Pressable
              key={p.id}
              onPress={() => {
                setSelectedPantryId(p.id);
                setFilter('all');
                setExpandedTypeId(null);
              }}
              className={
                selectedPantryId === p.id
                  ? 'flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-forest dark:bg-mint active:opacity-80'
                  : 'flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] active:opacity-70'
              }
            >
              <Ionicons
                name="storefront-outline"
                size={14}
                color={selectedPantryId === p.id ? '#F2F0EB' : '#9E9B95'}
              />
              <Text
                className={
                  selectedPantryId === p.id
                    ? 'text-[13px] font-semibold text-cream dark:text-[#161614]'
                    : 'text-[13px] font-medium text-pebble'
                }
              >
                {p.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator />
          </View>
        ) : types.length === 0 ? (
          <View className="mx-5 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-12 items-center gap-3">
            <Ionicons name="basket-outline" size={48} color="#9E9B95" />
            <Text className="text-[15px] font-semibold text-ink dark:text-[#F2F0EB]">
              Sin productos configurados
            </Text>
            <Text className="text-[13px] text-pebble text-center px-8">
              Agrega tipos de producto a esta despensa para ver su stock.
            </Text>
          </View>
        ) : (
          <>
            {/* Stats */}
            <View className="mx-5 flex-row items-center border border-stone dark:border-[#2E2E2C] rounded-2xl p-5 mb-5">
              <View className="flex-1 items-center gap-1">
                <Text className="text-[28px] font-semibold leading-none text-ink dark:text-[#F2F0EB]">
                  {types.length}
                </Text>
                <Text className="text-[11px] font-medium text-pebble">Tipos</Text>
              </View>
              <View className="w-px h-9 bg-stone dark:bg-[#2E2E2C]" />
              <View className="flex-1 items-center gap-1">
                <Text className="text-[28px] font-semibold leading-none text-amber-600 dark:text-amber-400">
                  {criticalCount}
                </Text>
                <Text className="text-[11px] font-medium text-pebble">Bajo mínimo</Text>
              </View>
              <View className="w-px h-9 bg-stone dark:bg-[#2E2E2C]" />
              <View className="flex-1 items-center gap-1">
                <Text className="text-[28px] font-semibold leading-none text-red-500 dark:text-red-400">
                  {emptyCount}
                </Text>
                <Text className="text-[11px] font-medium text-pebble">Agotados</Text>
              </View>
            </View>

            {/* Alert strip */}
            {criticalCount > 0 && (
              <Pressable className="mx-5 flex-row rounded-xl overflow-hidden bg-amber-50 dark:bg-amber-950 mb-5 active:opacity-80">
                <View className="w-1 bg-amber-500" />
                <View className="flex-1 flex-row items-center gap-2 px-3 py-3">
                  <Ionicons name="warning-outline" size={15} color={warn} />
                  <Text className="flex-1 text-[13px] font-semibold text-amber-700 dark:text-amber-300">
                    {criticalCount}{' '}
                    {criticalCount === 1 ? 'producto bajo' : 'productos bajo'} el mínimo
                    {emptyCount > 0
                      ? `, ${emptyCount} agotado${emptyCount > 1 ? 's' : ''}`
                      : ''}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={warn} />
                </View>
              </Pressable>
            )}

            {/* Filter tabs */}
            <View className="mx-5 flex-row bg-stone dark:bg-[#1E1E1C] rounded-xl p-1 mb-5">
              {(
                [
                  { key: 'all',      label: 'Todos',    count: types.length },
                  { key: 'critical', label: 'Críticos', count: criticalCount },
                  { key: 'ok',       label: 'OK',       count: okCount },
                ] as { key: Filter; label: string; count: number }[]
              ).map((tab) => (
                <Pressable
                  key={tab.key}
                  onPress={() => setFilter(tab.key)}
                  className={
                    filter === tab.key
                      ? 'flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg bg-white dark:bg-[#2E2E2C] active:opacity-80'
                      : 'flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg active:opacity-60'
                  }
                >
                  <Text
                    className={
                      filter === tab.key
                        ? 'text-[13px] font-semibold text-ink dark:text-[#F2F0EB]'
                        : 'text-[13px] font-medium text-pebble'
                    }
                  >
                    {tab.label}
                  </Text>
                  <View
                    className={
                      filter === tab.key
                        ? 'px-1.5 py-0.5 rounded-md bg-stone dark:bg-[#161614]'
                        : 'px-1.5 py-0.5 rounded-md bg-white dark:bg-[#2E2E2C]'
                    }
                  >
                    <Text className="text-[10px] font-bold text-pebble">{tab.count}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Product type list */}
            {filtered.length === 0 ? (
              <View className="mx-5 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-10 items-center gap-2">
                <Ionicons name="checkmark-circle-outline" size={48} color="#9E9B95" />
                <Text className="text-[14px] text-pebble">Todo en orden</Text>
              </View>
            ) : (
              <View className="mx-5 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden">
                {filtered.map((row, i) => (
                  <PantryTypeRow
                    key={row.type_id}
                    row={row}
                    isLast={i === filtered.length - 1}
                    isExpanded={expandedTypeId === row.type_id}
                    onToggle={() => toggleType(row.type_id)}
                    pantryId={selectedPantryId!}
                    pantryName={selectedPantryName}
                    pantryProducts={pantryProducts ?? []}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* FAB — add product type */}
      {selectedPantryId && (
        <Pressable
          className="absolute bottom-24 right-5 w-14 h-14 rounded-full bg-forest dark:bg-mint items-center justify-center active:opacity-80"
          style={{
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
          onPress={() => router.push(`/pantry-add-type?pantryId=${selectedPantryId}&pantryName=${encodeURIComponent(selectedPantryName)}`)}
        >
          <Ionicons name="add" size={28} color="#F2F0EB" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}
