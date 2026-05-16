import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof Ionicons>['name'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function formattedDate() {
  return new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
}

function discountPct(original: number, sale: number) {
  return Math.round((1 - sale / original) * 100);
}

const LOW_STOCK = [
  { id: 1, name: 'Leche',  current: 0.5, min: 1,   unit: 'L'  },
  { id: 2, name: 'Arroz',  current: 0.2, min: 0.5, unit: 'kg' },
  { id: 3, name: 'Aceite', current: 100, min: 250,  unit: 'ml' },
];

const OFFERS = [
  { id: 1, name: 'Leche Soprole Entera',  brand: 'Soprole', qty: '1 L',    price: 990,  originalPrice: 1290, icon: 'water-outline'     as IconName },
  { id: 2, name: 'Arroz Grado 1',         brand: 'Tucapel', qty: '1 kg',   price: 1190, originalPrice: 1590, icon: 'nutrition-outline'  as IconName },
  { id: 3, name: 'Aceite Maravilla',      brand: 'Chef',    qty: '900 ml', price: 2490, originalPrice: 3190, icon: 'flask-outline'      as IconName },
  { id: 4, name: 'Pan Molde Integral',    brand: 'Ideal',   qty: '550 g',  price: 1890, originalPrice: 2290, icon: 'fast-food-outline'  as IconName },
  { id: 5, name: 'Yogur Natural',         brand: 'Colún',   qty: '1 kg',   price: 2190, originalPrice: 2790, icon: 'cafe-outline'       as IconName },
];

// Icon colors must be hex — derived from isDark since Ionicons doesn't accept className
function iconColors(isDark: boolean) {
  return {
    muted:    isDark ? '#9CA3AF' : '#64748B',
    primary:  isDark ? '#60A5FA' : '#1D4ED8',
    amber:    isDark ? '#FCD34D' : '#B45309',
  };
}

function StockRow({ item, isDark, isLast }: { item: typeof LOW_STOCK[0]; isDark: boolean; isLast: boolean }) {
  const ratio = Math.min(item.current / item.min, 1);
  const ic = iconColors(isDark);
  const barColor = ratio < 0.4 ? (isDark ? '#F87171' : '#DC2626') : ic.amber;

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 pt-3.5 pb-2">
        <View className="flex-row items-center gap-2.5">
          <View className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 items-center justify-center">
            <Ionicons name="cube-outline" size={15} color={ic.amber} />
          </View>
          <View>
            <Text className="text-[15px] font-semibold text-slate-900 dark:text-gray-50">{item.name}</Text>
            <Text className="text-[12px] text-slate-500 dark:text-gray-400 mt-0.5">
              {item.current} / {item.min} {item.unit}
            </Text>
          </View>
        </View>
        <View className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950">
          <Text className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Bajo mín.</Text>
        </View>
      </View>
      <View className="mx-4 mb-3.5 h-1.5 rounded-full bg-slate-100 dark:bg-gray-800">
        <View className="h-1.5 rounded-full" style={{ width: `${ratio * 100}%`, backgroundColor: barColor }} />
      </View>
      {!isLast && <View className="h-px mx-4 bg-slate-100 dark:bg-gray-800" />}
    </View>
  );
}

function OfferCard({ offer, isDark }: { offer: typeof OFFERS[0]; isDark: boolean }) {
  const pct = discountPct(offer.originalPrice, offer.price);
  const ic = iconColors(isDark);

  return (
    <Pressable className="w-36 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 active:opacity-75">
      <View className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 items-center justify-center mb-1">
        <Ionicons name={offer.icon} size={22} color={ic.primary} />
      </View>
      <View className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-lg bg-blue-600">
        <Text className="text-[11px] font-bold text-white">-{pct}%</Text>
      </View>
      <Text className="text-[13px] font-semibold text-slate-900 dark:text-gray-50 leading-tight" numberOfLines={2}>
        {offer.name}
      </Text>
      <Text className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">{offer.brand} · {offer.qty}</Text>
      <View className="flex-row items-baseline gap-1.5 mt-1">
        <Text className="text-[15px] font-bold text-slate-900 dark:text-gray-50">
          ${offer.price.toLocaleString('es-CL')}
        </Text>
        <Text className="text-[12px] text-slate-400 dark:text-gray-600 line-through">
          ${offer.originalPrice.toLocaleString('es-CL')}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const ic = iconColors(isDark);

  const quickActions: { icon: IconName; label: string; onPress: () => void }[] = [
    { icon: 'barcode-outline',  label: 'Escanear',      onPress: () => {} },
    { icon: 'receipt-outline',  label: 'Subir boleta',   onPress: () => {} },
    { icon: 'cart-outline',     label: 'Generar lista',  onPress: () => router.push('/(tabs)/lista') },
    { icon: 'book-outline',     label: 'Recetas',        onPress: () => {} },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-2 pb-8">

          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-gray-50">
                {greeting()}
              </Text>
              <Text className="text-[13px] text-slate-500 dark:text-gray-400 mt-0.5 capitalize">
                {formattedDate()}
              </Text>
            </View>
            <Pressable className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 items-center justify-center active:opacity-70">
              <Ionicons name="notifications-outline" size={20} color={ic.muted} />
            </Pressable>
          </View>

          {/* Alert strip — left-border accent via a sibling View */}
          <Pressable className="flex-row rounded-xl overflow-hidden bg-amber-50 dark:bg-amber-950 mb-6 active:opacity-80">
            <View className="w-1 bg-amber-500" />
            <View className="flex-1 flex-row items-center gap-2 px-3 py-3">
              <Ionicons name="warning-outline" size={15} color={ic.amber} />
              <Text className="flex-1 text-[13px] font-semibold text-amber-700 dark:text-amber-300">
                {LOW_STOCK.length} productos bajo el mínimo de stock
              </Text>
              <Ionicons name="chevron-forward" size={14} color={ic.amber} />
            </View>
          </Pressable>

          {/* Inline stats */}
          <View className="flex-row items-center border border-slate-200 dark:border-gray-800 rounded-2xl p-5 mb-7">
            <View className="flex-1 items-center gap-1">
              <Text className="text-[30px] font-bold leading-none text-slate-900 dark:text-gray-50">24</Text>
              <Text className="text-[11px] font-medium text-slate-500 dark:text-gray-400">Productos</Text>
            </View>
            <View className="w-px h-9 bg-slate-200 dark:bg-gray-700" />
            <View className="flex-1 items-center gap-1">
              <Text className="text-[30px] font-bold leading-none text-amber-600 dark:text-amber-400">3</Text>
              <Text className="text-[11px] font-medium text-slate-500 dark:text-gray-400">Bajo mínimo</Text>
            </View>
            <View className="w-px h-9 bg-slate-200 dark:bg-gray-700" />
            <View className="flex-1 items-center gap-1">
              <Text className="text-[30px] font-bold leading-none text-slate-900 dark:text-gray-50">0</Text>
              <Text className="text-[11px] font-medium text-slate-500 dark:text-gray-400">En lista</Text>
            </View>
          </View>

          {/* Quick actions */}
          <Text className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-3">
            Acciones rápidas
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-7">
            <View className="flex-row gap-3">
              {quickActions.map((a) => (
                <Pressable
                  key={a.label}
                  className="flex-row items-center gap-2 py-2.5 px-4 rounded-full bg-blue-50 dark:bg-blue-950 active:opacity-70"
                  onPress={a.onPress}
                >
                  <Ionicons name={a.icon} size={18} color={ic.primary} />
                  <Text className="text-[14px] font-semibold text-blue-700 dark:text-blue-400">{a.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Low stock */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400">
              Bajo mínimo
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/despensa')}>
              <Text className="text-[13px] font-semibold text-blue-700 dark:text-blue-400">Ver todos</Text>
            </Pressable>
          </View>
          <View className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden mb-7">
            {LOW_STOCK.map((item, i) => (
              <StockRow key={item.id} item={item} isDark={isDark} isLast={i === LOW_STOCK.length - 1} />
            ))}
          </View>

          {/* Offers */}
          <View className="flex-row justify-between items-end mb-3">
            <View>
              <Text className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400">
                Ofertas de Jumbo
              </Text>
              <Text className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">Actualizado hoy</Text>
            </View>
            <Pressable>
              <Text className="text-[13px] font-semibold text-blue-700 dark:text-blue-400">Ver todas</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3 pb-1">
              {OFFERS.map((offer) => (
                <OfferCard key={offer.id} offer={offer} isDark={isDark} />
              ))}
            </View>
          </ScrollView>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
