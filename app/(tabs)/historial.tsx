import { usePantryContext } from '@/context/PantryContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { usePantries, usePantryHistory } from '@/lib/api/pantries';
import type { ProductStat } from '@/types/pantry';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHART_H = 110;

function formatCLP(value: number) {
  return `$${Math.round(value).toLocaleString('es-CL')}`;
}

function ChangeBadge({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <Text className="text-[12px] text-pebble">Sin datos del mes anterior</Text>;
  }
  const isUp = pct > 0;
  const isFlat = pct === 0;
  const color = isFlat ? '#9CA3AF' : isUp ? '#E76F51' : '#2A9D8F';
  const arrow = isFlat ? '·' : isUp ? '▲' : '▼';
  return (
    <Text className="text-[13px] font-semibold" style={{ color }}>
      {arrow} {Math.abs(pct).toFixed(0)}% vs. mes anterior
    </Text>
  );
}

function RankingList({
  items,
  barValue,
  valueLabel,
}: {
  items: ProductStat[];
  barValue: (s: ProductStat) => number;
  valueLabel: (s: ProductStat) => string;
}) {
  const colors = useThemeColors();
  if (items.length === 0) {
    return <Text className="text-[13px] text-pebble py-2">Aún no hay consumos registrados este mes.</Text>;
  }
  const maxVal = Math.max(...items.map(barValue), 1);
  return (
    <>
      {items.map((item, i) => (
        <View
          key={item.product_sku}
          className="flex-row items-center gap-2.5"
          style={{ marginBottom: i < items.length - 1 ? 14 : 0 }}
        >
          <Text
            className="text-[13px] font-medium text-ink dark:text-[#F2F0EB]"
            style={{ width: 88 }}
            numberOfLines={1}
          >
            {item.product_name}
          </Text>
          <View className="flex-1 h-1.5 rounded-full bg-stone dark:bg-[#2E2E2C] overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.max(4, (barValue(item) / maxVal) * 100)}%`,
                backgroundColor: i === 0 ? colors.primary : colors.mint,
              }}
            />
          </View>
          <Text className="text-[12px] text-pebble" style={{ minWidth: 64, textAlign: 'right' }}>
            {valueLabel(item)}
          </Text>
        </View>
      ))}
    </>
  );
}

export default function HistorialScreen() {
  const colors = useThemeColors();
  const { activePantryId } = usePantryContext();
  const [selectedPantryId, setSelectedPantryId] = useState<string | null>(activePantryId);
  const { data: pantries, isLoading: pantriesLoading } = usePantries();

  useEffect(() => {
    if (!selectedPantryId && pantries && pantries.length > 0) {
      setSelectedPantryId(pantries[0].id);
    }
  }, [pantries, selectedPantryId]);

  const { data: history, isLoading: historyLoading } = usePantryHistory(selectedPantryId ?? '');
  const isLoading = pantriesLoading || historyLoading;

  if (isLoading || !history) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  const maxUnits = Math.max(...history.weekly.map((w) => w.units), 1);

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-2 pb-28"
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">Historial</Text>
          <Text className="text-[13px] text-pebble mt-0.5">Últimas 4 semanas</Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2.5 mb-7">
          <View className="flex-1 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-3.5 px-2.5 items-center gap-1.5">
            <Text className="text-[20px] font-semibold leading-none text-ink dark:text-[#F2F0EB]">
              {formatCLP(history.money_spent_consumption_month)}
            </Text>
            <Text className="text-[10px] font-medium text-pebble text-center" style={{ lineHeight: 14 }}>
              {'Consumido\neste mes'}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-3.5 px-2.5 items-center gap-1.5">
            <Text className="text-[20px] font-semibold leading-none text-sage dark:text-mint">
              {formatCLP(history.money_spent_total_month)}
            </Text>
            <Text className="text-[10px] font-medium text-pebble text-center" style={{ lineHeight: 14 }}>
              {'Gasto total\neste mes'}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-3.5 px-2.5 items-center justify-center gap-1.5">
            <ChangeBadge pct={history.month_comparison.spend_change_pct} />
          </View>
        </View>

        {/* Bar chart */}
        <Text className="text-[11px] font-semibold tracking-wider uppercase text-pebble mb-3">
          Consumos por semana
        </Text>
        <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-5 mb-7">
          <View className="flex-row gap-3" style={{ height: CHART_H }}>
            {history.weekly.map((w, i) => {
              const isNow = i === history.weekly.length - 1;
              const barH = Math.max(10, (w.units / maxUnits) * CHART_H);
              return (
                <View key={w.week_label} className="flex-1 items-center justify-end">
                  <Text
                    className="text-[12px] font-semibold mb-1"
                    style={{ color: isNow ? colors.primary : colors.muted }}
                  >
                    {w.units}
                  </Text>
                  <View
                    className="w-full rounded-xl"
                    style={{
                      height: barH,
                      backgroundColor: isNow ? colors.primary : colors.mint,
                      opacity: isNow ? 1 : 0.85,
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View className="flex-row gap-3 mt-3">
            {history.weekly.map((w) => (
              <View key={w.week_label} className="flex-1 items-center">
                <Text className="text-[11px] text-pebble">{w.week_label}</Text>
                <Text className="text-[10px] text-pebble">{formatCLP(w.spend)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ranking by units */}
        <Text className="text-[11px] font-semibold tracking-wider uppercase text-pebble mb-3">
          Más consumidos (cantidad)
        </Text>
        <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-4 mb-7">
          <RankingList items={history.top_by_units} barValue={(s) => s.units} valueLabel={(s) => `${s.units}`} />
        </View>

        {/* Ranking by spend */}
        <Text className="text-[11px] font-semibold tracking-wider uppercase text-pebble mb-3">
          Más consumidos (gasto)
        </Text>
        <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-4">
          <RankingList items={history.top_by_spend} barValue={(s) => s.spend} valueLabel={(s) => formatCLP(s.spend)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
