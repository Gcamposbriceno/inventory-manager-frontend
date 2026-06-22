import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAllPantriesOverview, useAllPantriesProducts, usePantries, useUpdatePantryStock } from '@/lib/api/pantries';
import { useProducts } from '@/lib/api/products';
import { getItemStatus, getNeededQuantity, type ItemStatus } from '@/lib/helpers/shoppingListItem';
import { resolveStockPurchase } from '@/lib/helpers/resolveStockPurchase';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ListItem {
  key: string;
  type_name: string;
  needed: number;
  unit: string;
  status: ItemStatus;
  pantryId: string;
  pantryName: string;
  favoriteSku: string | null;
}

function ItemRow({
  item,
  checked,
  onToggle,
  isLast,
}: {
  item: ListItem;
  checked: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <View>
      <Pressable
        className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-80"
        onPress={onToggle}
      >
        <View
          className={`w-5 h-5 rounded-md items-center justify-center flex-shrink-0 ${
            checked
              ? 'bg-forest dark:bg-mint'
              : 'border-2 border-stone dark:border-[#2E2E2C]'
          }`}
        >
          {checked && (
            <Text className="text-[11px] font-bold text-cream dark:text-[#161614] leading-none">✓</Text>
          )}
        </View>

        <View className="flex-1">
          <Text
            className={`text-[15px] font-medium ${
              checked
                ? 'text-pebble line-through'
                : 'text-ink dark:text-[#F2F0EB]'
            }`}
          >
            {item.type_name}
          </Text>
          <Text className="text-[12px] text-pebble">{item.pantryName}</Text>
        </View>

        <View className="items-end">
          <Text
            className={`text-[15px] font-semibold ${
              checked
                ? 'text-pebble'
                : item.status === 'partial'
                ? 'text-ink dark:text-[#F2F0EB]'
                : 'text-expired'
            }`}
          >
            {item.needed} {item.unit}
          </Text>
          <Text className="text-[11px] text-pebble">comprar</Text>
        </View>
      </Pressable>
      {!isLast && <View className="h-px mx-4 bg-stone dark:bg-[#2E2E2C]" />}
    </View>
  );
}

function Section({
  title,
  items,
  dotColor,
  checked,
  onToggle,
}: {
  title: string;
  items: ListItem[];
  dotColor: string;
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <View className="mb-5">
      <View className="flex-row items-center gap-1.5 mb-2 pl-5">
        <View
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <Text className="text-[11px] font-semibold tracking-wider uppercase text-pebble">
          {title}
        </Text>
        <Text className="text-[11px] text-pebble ml-0.5">· {items.length}</Text>
      </View>
      <View className="mx-5 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden">
        {items.map((item, i) => (
          <ItemRow
            key={item.key}
            item={item}
            checked={!!checked[item.key]}
            onToggle={() => onToggle(item.key)}
            isLast={i === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

export default function ListaScreen() {
  const colors = useThemeColors();
  const { data: pantries, isLoading: pantriesLoading } = usePantries();
  const [listaPantry, setListaPantry] = useState<string>('all');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const updateStock = useUpdatePantryStock();
  const [isRegistering, setIsRegistering] = useState(false);

  const overviewQueries = useAllPantriesOverview(pantries ?? []);
  const productsQueries = useAllPantriesProducts(pantries ?? []);
  const { data: products } = useProducts();

  const productTypeNameBySku = useMemo(
    () => new Map((products ?? []).map((p) => [p.sku, p.product_type_name ?? ''])),
    [products],
  );
  const productUnitBySku = useMemo(
    () => new Map((products ?? []).map((p) => [p.sku, p.unit_multiplier_un ?? 1])),
    [products],
  );

  const isLoading = pantriesLoading || overviewQueries.some((q) => q.isLoading);

  const allItems: ListItem[] = [];
  const productsByPantry: Record<string, { product_sku: string; stock: number }[]> = {};
  (pantries ?? []).forEach((p, i) => {
    const overview = overviewQueries[i]?.data ?? [];
    const pantryProducts = productsQueries[i]?.data ?? [];
    productsByPantry[p.id] = pantryProducts;
    overview.forEach((t) => {
      const status = getItemStatus(t);
      if (!status) return;
      const needed = getNeededQuantity(t);
      allItems.push({
        key: `${p.id}-${t.type_id}`,
        type_name: t.type_name,
        needed,
        unit: t.measurement_unit,
        status,
        pantryId: p.id,
        pantryName: p.name,
        favoriteSku: t.favorite_product_sku,
      });
    });
  });

  const filtered =
    listaPantry === 'all' ? allItems : allItems.filter((i) => i.pantryId === listaPantry);
  const urgent = filtered.filter((i) => i.status !== 'partial');
  const suggested = filtered.filter((i) => i.status === 'partial');
  const checkedCount = filtered.filter((i) => checked[i.key]).length;

  function toggle(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function registerPurchase() {
    const checkedItems = filtered.filter((i) => checked[i.key]);
    const updates = resolveStockPurchase(
      checkedItems.map((i) => ({
        pantryId: i.pantryId,
        typeName: i.type_name,
        favoriteSku: i.favoriteSku,
        needed: i.needed,
      })),
      productsByPantry,
      productTypeNameBySku,
      productUnitBySku,
    );

    setIsRegistering(true);
    try {
      for (const update of updates) {
        await updateStock.mutateAsync(update);
      }
    } finally {
      setIsRegistering(false);
      setChecked({});
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28"
      >
        {/* Header */}
        <View className="px-5 pt-2 pb-4">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">
                Lista de compras
              </Text>
              <Text className="text-[13px] text-pebble mt-0.5">
                {isLoading
                  ? 'Cargando...'
                  : filtered.length === 0
                  ? 'Todo en orden'
                  : `${filtered.length - checkedCount} de ${filtered.length} pendientes`}
              </Text>
            </View>
            <Pressable className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] items-center justify-center active:opacity-70">
              <Ionicons name="share-social-outline" size={18} color="#9E9B95" />
            </Pressable>
          </View>

          {/* Progress bar */}
          {filtered.length > 0 && (
            <View className="h-1 rounded-full bg-stone dark:bg-[#2E2E2C] mb-4 overflow-hidden">
              <View
                className="h-full rounded-full bg-mint"
                style={{ width: `${(checkedCount / filtered.length) * 100}%` }}
              />
            </View>
          )}

          {/* Pantry filter pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {[{ id: 'all', name: 'Todas' }, ...(pantries ?? [])].map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => setListaPantry(p.id)}
                  className={`px-4 py-1.5 rounded-full active:opacity-70 ${
                    listaPantry === p.id
                      ? 'bg-forest dark:bg-mint'
                      : 'bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C]'
                  }`}
                >
                  <Text
                    className={`text-[13px] ${
                      listaPantry === p.id
                        ? 'font-semibold text-cream dark:text-[#161614]'
                        : 'font-medium text-pebble'
                    }`}
                  >
                    {p.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator />
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center justify-center gap-3" style={{ paddingTop: 72 }}>
            <Ionicons name="checkmark-circle-outline" size={56} color="#52B788" />
            <Text className="font-display text-[22px] text-ink dark:text-[#F2F0EB]">
              Todo en orden
            </Text>
            <Text className="text-[14px] text-pebble">No hay productos que reponer</Text>
          </View>
        ) : (
          <>
            <Section
              title="Urgente"
              items={urgent}
              dotColor={colors.expired}
              checked={checked}
              onToggle={toggle}
            />
            <Section
              title="Sugerido"
              items={suggested}
              dotColor={colors.warn}
              checked={checked}
              onToggle={toggle}
            />
            {checkedCount > 0 && (
              <View className="px-5 pt-1">
                <Pressable
                  className="w-full py-3.5 rounded-xl bg-forest dark:bg-mint items-center active:opacity-80"
                  disabled={isRegistering}
                  onPress={registerPurchase}
                >
                  {isRegistering ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-[14px] font-semibold text-cream dark:text-[#161614]">
                      Registrar compra de {checkedCount} producto{checkedCount > 1 ? 's' : ''}
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
