import { discountPct } from '@/lib/helpers/discountPct';
import { greeting } from '@/lib/helpers/greeting';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof Ionicons>['name'];

function formattedDate() {
  return new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
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

function StockRow({ item, isLast }: { item: typeof LOW_STOCK[0]; isLast: boolean }) {
  const { warn } = useThemeColors();
  const ratio = Math.min(item.current / item.min, 1);
  const barColor = ratio < 0.4 ? '#E76F51' : warn;

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 pt-3.5 pb-2">
        <View className="flex-row items-center gap-2.5">
          <View className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 items-center justify-center">
            <Ionicons name="cube-outline" size={15} color={warn} />
          </View>
          <View>
            <Text className="text-[15px] font-semibold text-ink dark:text-[#F2F0EB]">{item.name}</Text>
            <Text className="text-[12px] text-pebble mt-0.5">
              {item.current} / {item.min} {item.unit}
            </Text>
          </View>
        </View>
        <View className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950">
          <Text className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Bajo mín.</Text>
        </View>
      </View>
      <View className="mx-4 mb-3.5 h-1.5 rounded-full bg-stone dark:bg-[#2E2E2C]">
        <View className="h-1.5 rounded-full" style={{ width: `${ratio * 100}%`, backgroundColor: barColor }} />
      </View>
      {!isLast && <View className="h-px mx-4 bg-stone dark:bg-[#2E2E2C]" />}
    </View>
  );
}

function OfferCard({ offer }: { offer: typeof OFFERS[0] }) {
  const { primary } = useThemeColors();
  const pct = discountPct(offer.originalPrice, offer.price);

  return (
    <Pressable className="w-36 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] p-3.5 active:opacity-75">
      <View className="w-11 h-11 rounded-xl bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-1">
        <Ionicons name={offer.icon} size={22} color={primary} />
      </View>
      <View className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-lg bg-forest">
        <Text className="text-[11px] font-bold text-cream">-{pct}%</Text>
      </View>
      <Text className="text-[13px] font-semibold text-ink dark:text-[#F2F0EB] leading-tight" numberOfLines={2}>
        {offer.name}
      </Text>
      <Text className="text-[11px] text-pebble mt-0.5">{offer.brand} · {offer.qty}</Text>
      <View className="flex-row items-baseline gap-1.5 mt-1">
        <Text className="text-[15px] font-bold text-ink dark:text-[#F2F0EB]">
          ${offer.price.toLocaleString('es-CL')}
        </Text>
        <Text className="text-[12px] text-pebble line-through">
          ${offer.originalPrice.toLocaleString('es-CL')}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { primary, muted, warn } = useThemeColors();

  const quickActions: { icon: IconName; label: string; onPress: () => void }[] = [
    { icon: 'barcode-outline',  label: 'Escanear',      onPress: () => {} },
    { icon: 'cart-outline',     label: 'Generar lista',  onPress: () => router.push('/(tabs)/lista') },
    { icon: 'book-outline',     label: 'Recetas',        onPress: () => router.push('/(tabs)/recetas' as any) },
  ];

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pt-2 pb-28">
        <View>

          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">
                {greeting()}
              </Text>
              <Text className="text-[13px] text-pebble mt-0.5 capitalize">
                {formattedDate()}
              </Text>
            </View>
            <Pressable className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] items-center justify-center active:opacity-70">
              <Ionicons name="notifications-outline" size={20} color={muted} />
            </Pressable>
          </View>

          {/* Alert strip */}
          <Pressable className="flex-row rounded-xl overflow-hidden bg-amber-50 dark:bg-amber-950 mb-6 active:opacity-80">
            <View className="w-1 bg-amber-500" />
            <View className="flex-1 flex-row items-center gap-2 px-3 py-3">
              <Ionicons name="warning-outline" size={15} color={warn} />
              <Text className="flex-1 text-[13px] font-semibold text-amber-700 dark:text-amber-300">
                {LOW_STOCK.length} productos bajo el mínimo de stock
              </Text>
              <Ionicons name="chevron-forward" size={14} color={warn} />
            </View>
          </Pressable>

          {/* Inline stats */}
          <View className="flex-row items-center border border-stone dark:border-[#2E2E2C] rounded-2xl p-5 mb-7">
            <View className="flex-1 items-center gap-1">
              <Text className="text-[30px] font-bold leading-none text-ink dark:text-[#F2F0EB]">24</Text>
              <Text className="text-[11px] font-medium text-pebble">Productos</Text>
            </View>
            <View className="w-px h-9 bg-stone dark:bg-[#2E2E2C]" />
            <View className="flex-1 items-center gap-1">
              <Text className="text-[30px] font-bold leading-none text-amber-600 dark:text-amber-400">3</Text>
              <Text className="text-[11px] font-medium text-pebble">Bajo mínimo</Text>
            </View>
            <View className="w-px h-9 bg-stone dark:bg-[#2E2E2C]" />
            <View className="flex-1 items-center gap-1">
              <Text className="text-[30px] font-bold leading-none text-ink dark:text-[#F2F0EB]">0</Text>
              <Text className="text-[11px] font-medium text-pebble">En lista</Text>
            </View>
          </View>

          {/* Quick actions */}
          <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble mb-3">
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
                  <Text className="text-[14px] font-semibold text-forest dark:text-mint">{a.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Low stock */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble">
              Bajo mínimo
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/despensa')}>
              <Text className="text-[13px] font-semibold text-forest dark:text-mint">Ver todos</Text>
            </Pressable>
          </View>
          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden mb-7">
            {LOW_STOCK.map((item, i) => (
              <StockRow key={item.id} item={item} isLast={i === LOW_STOCK.length - 1} />
            ))}
          </View>

          {/* Offers */}
          <View className="flex-row justify-between items-end mb-3">
            <View>
              <Text className="text-[11px] font-bold tracking-widest uppercase text-pebble">
                Ofertas de Jumbo
              </Text>
              <Text className="text-[11px] text-pebble mt-0.5">Actualizado hoy</Text>
            </View>
            <Pressable>
              <Text className="text-[13px] font-semibold text-forest dark:text-mint">Ver todas</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3 pb-1">
              {OFFERS.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </View>
          </ScrollView>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
