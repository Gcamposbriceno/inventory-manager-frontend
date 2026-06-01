import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

type Props = {
  variant?: 'text' | 'icon';
  label?: string;
  className?: string;
};

export function BackButton({ variant = 'text', label = '← Volver', className = '' }: Props) {
  if (variant === 'icon') {
    return (
      <Pressable
        onPress={() => router.back()}
        className={`w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C] items-center justify-center active:opacity-80 ${className}`.trim()}
      >
        <Ionicons name="arrow-back" size={20} color="#9E9B95" />
      </Pressable>
    );
  }
  return (
    <Pressable
      className={`active:opacity-60 ${className}`.trim()}
      onPress={() => router.back()}
    >
      <Text className="text-forest dark:text-mint text-base">{label}</Text>
    </Pressable>
  );
}
