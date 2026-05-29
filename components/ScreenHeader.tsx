import { Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View className="px-5 pt-2 pb-5 border-b border-stone dark:border-[#2E2E2C]">
      <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">{title}</Text>
      {subtitle && (
        <Text className="text-[14px] text-pebble mt-0.5">{subtitle}</Text>
      )}
    </View>
  );
}
