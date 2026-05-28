import { usePantry } from '@/context/PantryContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PantryCreateScreen() {
  const { createPantry, hasPantry } = usePantry();

  const hasCreated = useRef(false);
  useEffect(() => {
    if (!hasCreated.current && !hasPantry) {
      hasCreated.current = true;
      createPantry();
    }
  }, [createPantry, hasPantry]);

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]">
      <View className="flex-1 justify-center px-5 gap-10">
        <View className="items-center gap-4">
          <View className="bg-mist rounded-full p-4">
            <Ionicons name="basket-outline" size={56} color="#2D6A4F" />
          </View>
          <Text
            className="font-display text-[32px] text-ink dark:text-[#F2F0EB] text-center"
          >
            ¡Despensa creada!
          </Text>
          <Text className="text-[15px] text-pebble text-center" style={{ maxWidth: 280 }}>
            ¿Quieres hacer un llenado rápido ahora?
          </Text>
          <Text className="text-[13px] text-pebble text-center" style={{ maxWidth: 280 }}>
            Te mostraremos los productos más comunes de una cocina chilena. Solo desliza o presiona los botones.
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            className="bg-sage rounded-xl py-5 items-center active:opacity-80"
            onPress={() => router.push('/(onboarding)/pantry-quick-fill')}
          >
            <Text className="text-white font-semibold text-base">Llenar mi despensa ahora</Text>
          </Pressable>

          <Pressable
            className="border border-stone rounded-xl py-5 items-center active:opacity-70"
            onPress={() => router.replace('/(tabs)')}
          >
            <Text className="text-pebble font-semibold text-base">Empezar con despensa vacía</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
