import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  name: IconName;
  size?: number;
  color: string;
  bg?: 'mist' | 'stone';
};

export function IconChip({ name, size = 18, color, bg = 'mist' }: Props) {
  const bgClass =
    bg === 'stone'
      ? 'bg-stone dark:bg-[#2E2E2C]'
      : 'bg-mist dark:bg-[#0D2B1A]';
  return (
    <View className={`w-9 h-9 rounded-xl items-center justify-center ${bgClass}`}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}
