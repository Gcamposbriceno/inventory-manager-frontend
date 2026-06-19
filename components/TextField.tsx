import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export const TextField = forwardRef<TextInput, Props>(
  ({ label, error, ...props }, ref) => {
    const colors = useThemeColors();

    return (
      <View>
        {label && (
          <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className="bg-stone dark:bg-[#1E1E1C] border border-transparent dark:border-[#2E2E2C] rounded-xl px-4 py-4 text-ink dark:text-[#F2F0EB] text-base"
          placeholderTextColor={colors.muted}
          {...props}
        />
        {error && (
          <Text className="text-expired text-[12px] mt-1 ml-1">{error}</Text>
        )}
      </View>
    );
  },
);

TextField.displayName = 'TextField';
