import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  icon: IconName;
  iconColor?: string;
  description: string;
};

export function ComingSoon({ icon, iconColor, description }: Props) {
  const colors = useThemeColors();
  return (
    <View className="flex-1 items-center justify-center px-10 gap-4">
      <View className="w-24 h-24 rounded-[28px] bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-2">
        <Ionicons name={icon} size={48} color={iconColor ?? colors.primary} />
      </View>
      <Text className="font-display text-[22px] text-ink dark:text-[#F2F0EB]">Próximamente</Text>
      <Text className="text-[14px] text-pebble text-center leading-relaxed">{description}</Text>
    </View>
  );
}
