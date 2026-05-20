import { usePantry } from '@/context/PantryContext';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PantryJoinScreen() {
  const [code, setCode] = useState('');
  const { joinPantry } = usePantry();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleJoin = async () => {
    const cleanedCode = code.trim();
    if (!cleanedCode) return;

    await joinPantry(cleanedCode);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          <View className="pt-4 pb-2">
            <Pressable className="active:opacity-60" onPress={() => router.back()}>
              <Text className="text-forest dark:text-mint text-base">← Volver</Text>
            </Pressable>
          </View>

          <View className="flex-1 justify-center">
            <Text className="font-display text-5xl text-forest dark:text-mint mb-3">Unirse</Text>
            <Text className="text-pebble text-base mb-10">
              Ingresa el código que te compartió el dueño de la despensa.
            </Text>

            <TextInput
              className="bg-stone dark:bg-[#1E1E1C] border border-transparent dark:border-[#2E2E2C] rounded-xl px-4 py-4 text-ink dark:text-[#F2F0EB] text-xl text-center tracking-widest mb-6"
              placeholder="Código de despensa"
              placeholderTextColor={isDark ? '#7F7B74' : '#9E9B95'}
              value={code}
              onChangeText={(t) => setCode(t.toUpperCase())}
              autoCapitalize="characters"
              maxLength={8}
            />

            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80"
              onPress={handleJoin}
            >
              <Text className="text-cream font-semibold text-base">Unirse</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
