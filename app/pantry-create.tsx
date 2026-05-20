import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PantryCreateScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6">
        <View className="pt-4 pb-2">
          <Pressable className="active:opacity-60" onPress={() => router.back()}>
            <Text className="text-forest text-base">← Volver</Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-center items-center">
          <Text className="font-display text-5xl text-forest mb-4 text-center">
            Crear despensa
          </Text>
          <Text className="text-pebble text-base text-center">Próximamente</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
