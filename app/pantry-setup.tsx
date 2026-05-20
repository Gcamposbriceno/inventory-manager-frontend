import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PantrySetupScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 justify-center">
        <Text className="font-display text-5xl text-forest mb-3">Tu despensa</Text>
        <Text className="text-pebble text-base mb-12">
          Crea una nueva despensa o únete a una existente con un código.
        </Text>

        <View className="gap-4">
          <Pressable
            className="bg-forest rounded-2xl p-7 active:opacity-80"
            onPress={() => router.push("/pantry-create")}
          >
            <Text className="font-display text-2xl text-cream mb-1">Crear despensa</Text>
            <Text className="text-frost text-sm">Empieza tu propio inventario</Text>
          </Pressable>

          <Pressable
            className="border-2 border-forest rounded-2xl p-7 active:opacity-70"
            onPress={() => router.push("/pantry-join")}
          >
            <Text className="font-display text-2xl text-forest mb-1">Unirse a una despensa</Text>
            <Text className="text-sage text-sm">Ingresa con un código de invitación</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
