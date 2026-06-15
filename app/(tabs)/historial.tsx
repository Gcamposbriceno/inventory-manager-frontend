import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEEKS = [
  { label: 'Sem 23', val: 8  },
  { label: 'Sem 24', val: 13 },
  { label: 'Sem 25', val: 6  },
  { label: 'Sem 26', val: 11 },
];

const TOP = [
  { name: 'Leche',  val: 8,   unit: 'L',   pct: 100 },
  { name: 'Huevos', val: 24,  unit: 'ud.', pct: 88  },
  { name: 'Pan',    val: 12,  unit: 'ud.', pct: 64  },
  { name: 'Arroz',  val: 3,   unit: 'kg',  pct: 42  },
  { name: 'Aceite', val: 1.5, unit: 'L',   pct: 26  },
];

const CHART_H = 110;

export default function HistorialScreen() {
  const maxVal = Math.max(...WEEKS.map((w) => w.val));

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
            <Text className="text-[28px] font-semibold leading-none text-ink dark:text-[#F2F0EB]">8</Text>
            <Text className="text-[10px] font-medium text-pebble text-center" style={{ lineHeight: 14 }}>
              {'Tipos\nrastreados'}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-3.5 px-2.5 items-center gap-1.5">
            <Text className="text-[28px] font-semibold leading-none text-sage dark:text-mint">38</Text>
            <Text className="text-[10px] font-medium text-pebble text-center" style={{ lineHeight: 14 }}>
              {'Consumos\nregistrados'}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] py-3.5 px-2.5 items-center gap-1.5">
            <Text className="text-[28px] font-semibold leading-none text-amber-600 dark:text-amber-400">3</Text>
            <Text className="text-[10px] font-medium text-pebble text-center" style={{ lineHeight: 14 }}>
              {'Alertas\neste mes'}
            </Text>
          </View>
        </View>

        {/* Bar chart */}
        <Text className="text-[11px] font-semibold tracking-wider uppercase text-pebble mb-3">
          Consumos por semana
        </Text>
        <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-5 mb-7">
          <View className="flex-row gap-3" style={{ height: CHART_H }}>
            {WEEKS.map((w, i) => {
              const isNow = i === WEEKS.length - 1;
              const barH = Math.max(10, (w.val / maxVal) * CHART_H);
              return (
                <View key={w.label} className="flex-1 items-center justify-end">
                  <Text
                    className="text-[12px] font-semibold mb-1"
                    style={{ color: isNow ? '#1B4332' : '#9E9B95' }}
                  >
                    {w.val}
                  </Text>
                  <View
                    className="w-full rounded-xl"
                    style={{
                      height: barH,
                      backgroundColor: isNow ? '#1B4332' : '#52B788',
                      opacity: isNow ? 1 : 0.85,
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View className="flex-row gap-3 mt-3">
            {WEEKS.map((w) => (
              <Text key={w.label} className="flex-1 text-center text-[11px] text-pebble">
                {w.label}
              </Text>
            ))}
          </View>
        </View>

        {/* Ranking */}
        <Text className="text-[11px] font-semibold tracking-wider uppercase text-pebble mb-3">
          Más consumidos
        </Text>
        <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-4">
          {TOP.map((item, i) => (
            <View
              key={item.name}
              className="flex-row items-center gap-2.5"
              style={{ marginBottom: i < TOP.length - 1 ? 14 : 0 }}
            >
              <Text
                className="text-[13px] font-medium text-ink dark:text-[#F2F0EB]"
                style={{ width: 72 }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View className="flex-1 h-1.5 rounded-full bg-stone dark:bg-[#2E2E2C] overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${item.pct}%`,
                    backgroundColor: i === 0 ? '#1B4332' : '#52B788',
                  }}
                />
              </View>
              <Text
                className="text-[12px] text-pebble"
                style={{ minWidth: 52, textAlign: 'right' }}
              >
                {item.val} {item.unit}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
