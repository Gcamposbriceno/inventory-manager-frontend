import { StockRow } from '@/components/StockRow';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAllPantriesOverview, usePantries } from '@/lib/api/pantries';
import { useProductsForTypes } from '@/lib/api/productTypes';
import { greeting } from '@/lib/helpers/greeting';
import type { PantryTypeOverview } from '@/types/pantry';
import type { Product } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState, type ComponentProps } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type IconName = ComponentProps<typeof Ionicons>['name'];

function formattedDate() {
  return new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
}

type Status = 'empty' | 'low' | 'partial' | 'ok';

function getStatus(r: PantryTypeOverview): Status {
  if (r.current_stock === 0) return 'empty';
  if (r.current_stock < r.rop) return 'low';
  if (r.current_stock < r.desired_stock) return 'partial';
  return 'ok';
}

// A restock suggestion: one random catalog product from a type that's below ROP.
function SuggestionCard({
  typeName,
  products,
  isLoading,
}: {
  typeName: string;
  products?: Product[];
  isLoading: boolean;
}) {
  const { primary } = useThemeColors();
  // Pick once per data load so it stays stable across re-renders.
  const product = useMemo(() => {
    if (!products || products.length === 0) return null;
    return products[Math.floor(Math.random() * products.length)];
  }, [products]);

  if (isLoading) {
    return (
      <View
        className="w-40 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] items-center justify-center"
        style={{ height: 132 }}
      >
        <ActivityIndicator color={primary} />
      </View>
    );
  }
  if (!product) return null;

  return (
    <Pressable
      className="w-40 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] p-3.5 active:opacity-75"
      onPress={() => router.push('/(tabs)/despensa')}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <View className="w-11 h-11 rounded-xl bg-mist dark:bg-[#0D2B1A] items-center justify-center overflow-hidden flex-shrink-0">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="cube-outline" size={22} color={primary} />
          )}
        </View>
        <Text
          className="flex-1 text-[10px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400"
          numberOfLines={2}
        >
          {typeName}
        </Text>
      </View>
      <Text
        className="text-[13px] font-semibold text-ink dark:text-[#F2F0EB] leading-tight"
        numberOfLines={2}
      >
        {product.name}
      </Text>
      <Text className="text-[11px] text-pebble mt-0.5" numberOfLines={1}>
        {product.brand}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { primary, muted, warn } = useThemeColors();
  // null = todas las despensas; de lo contrario, el id de la despensa seleccionada
  const [scope, setScope] = useState<string | null>(null);

  const { data: pantries = [], isLoading: pantriesLoading } = usePantries();
  const overviewQueries = useAllPantriesOverview(pantries);
  const overviewsLoading = overviewQueries.some((q) => q.isLoading);

  // Each tracked type, tagged with the pantry it belongs to.
  const rows = pantries.flatMap((p, i) =>
    (overviewQueries[i]?.data ?? []).map((r) => ({ row: r, pantryId: p.id, pantryName: p.name }))
  );
  const scoped = scope === null ? rows : rows.filter((x) => x.pantryId === scope);

  const totalTypes = scoped.length;
  const criticalCount = scoped.filter((x) => {
    const s = getStatus(x.row);
    return s === 'empty' || s === 'low';
  }).length;
  const okCount = scoped.filter((x) => {
    const s = getStatus(x.row);
    return s === 'partial' || s === 'ok';
  }).length;

  const lowStock = scoped
    .filter((x) => {
      const s = getStatus(x.row);
      return s === 'empty' || s === 'low';
    })
    .map((x, i) => ({
      id: i,
      name: x.row.type_name,
      current: x.row.current_stock,
      min: x.row.rop,
      unit: x.row.measurement_unit,
    }));

  // Unique type names below ROP — each gets one random product suggestion.
  const lowTypeNames = useMemo(
    () => [...new Set(lowStock.map((x) => x.name))],
    [lowStock]
  );
  const suggestionQueries = useProductsForTypes(lowTypeNames);

  const isLoading = pantriesLoading || overviewsLoading;
  const hasPantries = pantries.length > 0;

  const quickActions: { icon: IconName; label: string; onPress: () => void }[] = [
    { icon: 'barcode-outline', label: 'Escanear', onPress: () => router.push('/scanner') },
    { icon: 'cart-outline', label: 'Ver lista', onPress: () => router.push('/(tabs)/lista') },
    { icon: 'calendar-outline', label: 'Planificar', onPress: () => router.push('/planificador') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-2 pb-28"
      >
        <View>
          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">
                {greeting()}
              </Text>
              <Text className="text-[13px] text-pebble mt-0.5 capitalize">{formattedDate()}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => router.push('/settings')}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] items-center justify-center active:opacity-70"
              >
                <Ionicons name="settings-outline" size={20} color={muted} />
              </Pressable>
            </View>
          </View>

          {/* No pantries yet */}
          {!isLoading && !hasPantries && (
            <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] items-center px-6 py-10 mb-7">
              <View className="w-14 h-14 rounded-2xl bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-4">
                <Ionicons name="basket-outline" size={28} color={primary} />
              </View>
              <Text className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB] mb-1">
                Aún no tienes despensas
              </Text>
              <Text className="text-[13px] text-pebble text-center mb-5">
                Crea tu primera despensa para empezar a llevar tu inventario.
              </Text>
              <Pressable
                className="bg-forest dark:bg-mint rounded-xl py-3 px-6 active:opacity-80"
                onPress={() => router.push('/pantry-create')}
              >
                <Text className="text-[14px] font-semibold text-cream dark:text-[#161614]">
                  Crear despensa
                </Text>
              </Pressable>
            </View>
          )}

          {hasPantries && (
            <>
              {/* Scope selector */}
              {pantries.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-5"
                  contentContainerClassName="gap-2 flex-row"
                >
                  {[
                    { id: null, name: 'Todas' },
                    ...pantries.map((p) => ({ id: p.id, name: p.name })),
                  ].map((opt) => {
                    const selected = scope === opt.id;
                    return (
                      <Pressable
                        key={opt.id ?? 'all'}
                        onPress={() => setScope(opt.id)}
                        className={
                          selected
                            ? 'flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-forest dark:bg-mint active:opacity-80'
                            : 'flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] active:opacity-70'
                        }
                      >
                        <Ionicons
                          name={opt.id === null ? 'layers-outline' : 'storefront-outline'}
                          size={14}
                          color={selected ? '#F2F0EB' : '#9E9B95'}
                        />
                        <Text
                          className={
                            selected
                              ? 'text-[13px] font-semibold text-cream dark:text-[#161614]'
                              : 'text-[13px] font-medium text-pebble'
                          }
                        >
                          {opt.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}

              {/* Alert strip */}
              {criticalCount > 0 && (
                <Pressable
                  className="flex-row rounded-xl overflow-hidden bg-amber-50 dark:bg-amber-950 mb-6 active:opacity-80"
                  onPress={() => router.push('/(tabs)/despensa')}
                >
                  <View className="w-1 bg-amber-500" />
                  <View className="flex-1 flex-row items-center gap-2 px-3 py-3">
                    <Ionicons name="warning-outline" size={15} color={warn} />
                    <Text className="flex-1 text-[13px] font-semibold text-amber-700 dark:text-amber-300">
                      {criticalCount} {criticalCount === 1 ? 'producto' : 'productos'} bajo el
                      mínimo de stock
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color={warn} />
                  </View>
                </Pressable>
              )}

              {/* Inline stats */}
              <View className="flex-row items-center border border-stone dark:border-[#2E2E2C] rounded-2xl p-5 mb-7">
                <View className="flex-1 items-center gap-1">
                  <Text className="text-[30px] font-semibold leading-none text-ink dark:text-[#F2F0EB]">
                    {totalTypes}
                  </Text>
                  <Text className="text-[11px] font-medium text-pebble">Tipos</Text>
                </View>
                <View className="w-px h-9 bg-stone dark:bg-[#2E2E2C]" />
                <View className="flex-1 items-center gap-1">
                  <Text className="text-[30px] font-semibold leading-none text-amber-600 dark:text-amber-400">
                    {criticalCount}
                  </Text>
                  <Text className="text-[11px] font-medium text-pebble">Por reponer</Text>
                </View>
                <View className="w-px h-9 bg-stone dark:bg-[#2E2E2C]" />
                <View className="flex-1 items-center gap-1">
                  <Text className="text-[30px] font-semibold leading-none text-emerald-600 dark:text-emerald-400">
                    {okCount}
                  </Text>
                  <Text className="text-[11px] font-medium text-pebble">En orden</Text>
                </View>
              </View>
            </>
          )}

          {/* Quick actions */}
          <Text className="text-[11px] font-medium tracking-wide uppercase text-pebble mb-3">
            Acciones rápidas
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-7">
            <View className="flex-row gap-3">
              {quickActions.map((a) => (
                <Pressable
                  key={a.label}
                  className="flex-row items-center gap-2 py-2.5 px-4 rounded-full bg-mist dark:bg-[#0D2B1A] active:opacity-70"
                  onPress={a.onPress}
                >
                  <Ionicons name={a.icon} size={18} color={primary} />
                  <Text className="text-[14px] font-semibold text-forest dark:text-mint">
                    {a.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Low stock */}
          {hasPantries && (
            <>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-[11px] font-medium tracking-wide uppercase text-pebble">
                  Bajo mínimo
                </Text>
                <Pressable onPress={() => router.push('/(tabs)/despensa')}>
                  <Text className="text-[13px] font-semibold text-forest dark:text-mint">
                    Ver todos
                  </Text>
                </Pressable>
              </View>

              {isLoading ? (
                <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] items-center py-8 mb-7">
                  <ActivityIndicator color={primary} />
                </View>
              ) : lowStock.length === 0 ? (
                <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] items-center px-6 py-8 mb-7 gap-2">
                  <Ionicons name="checkmark-circle-outline" size={32} color={primary} />
                  <Text className="text-[14px] font-medium text-ink dark:text-[#F2F0EB]">
                    Todo en orden
                  </Text>
                  <Text className="text-[12px] text-pebble text-center">
                    Ningún producto está bajo el mínimo.
                  </Text>
                </View>
              ) : (
                <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden mb-7">
                  {lowStock.slice(0, 4).map((item, i, shown) => (
                    <StockRow key={item.id} item={item} isLast={i === shown.length - 1} />
                  ))}
                </View>
              )}
            </>
          )}

          {/* Restock suggestions */}
          {hasPantries && lowTypeNames.length > 0 && (
            <>
              <View className="mb-3">
                <Text className="text-[11px] font-medium tracking-wide uppercase text-pebble">
                  Sugerencias para reponer
                </Text>
                <Text className="text-[11px] text-pebble mt-0.5">
                  Productos de los tipos bajo tu mínimo
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pb-1">
                  {lowTypeNames.map((name, i) => (
                    <SuggestionCard
                      key={name}
                      typeName={name}
                      products={suggestionQueries[i]?.data}
                      isLoading={suggestionQueries[i]?.isLoading ?? false}
                    />
                  ))}
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
