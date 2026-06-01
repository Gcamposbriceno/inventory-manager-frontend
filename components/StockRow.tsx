import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export interface StockRowItem {
  id: number;
  name: string;
  current: number;
  min: number;
  unit: string;
}

export function StockRow({ item, isLast }: { item: StockRowItem; isLast: boolean }) {
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
