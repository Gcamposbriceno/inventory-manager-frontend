import { usePantry } from '@/context/PantryContext';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PantryCreateScreen() {
  const { createPantry } = usePantry();

  const handleCreate = async () => {
    await createPantry();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]">
      <View className="flex-1 px-6">
        <View className="pt-4 pb-2">
          <Pressable className="active:opacity-60" onPress={() => router.back()}>
            <Text className="text-forest dark:text-mint text-base">← Volver</Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-center items-center">
          <Text className="font-display text-5xl text-forest dark:text-mint mb-4 text-center">
            Crear despensa
          </Text>
          <Text className="text-pebble text-base text-center mb-12">Próximamente</Text>
          <Pressable
            className="bg-forest py-4 px-10 rounded-xl items-center active:opacity-80"
            onPress={handleCreate}
          >
            <Text className="text-cream font-semibold text-base">Continuar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
