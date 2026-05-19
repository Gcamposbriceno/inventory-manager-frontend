import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PantryJoinScreen() {
  const [code, setCode] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          <View className="pt-4 pb-2">
            <Pressable className="active:opacity-60" onPress={() => router.back()}>
              <Text className="text-forest text-base">← Volver</Text>
            </Pressable>
          </View>

          <View className="flex-1 justify-center">
            <Text className="font-display text-5xl text-forest mb-3">Unirse</Text>
            <Text className="text-pebble text-base mb-10">
              Ingresa el código que te compartió el dueño de la despensa.
            </Text>

            <TextInput
              className="bg-stone rounded-xl px-4 py-4 text-ink text-xl text-center tracking-widest mb-6"
              placeholder="Código de despensa"
              placeholderTextColor="#9E9B95"
              value={code}
              onChangeText={(t) => setCode(t.toUpperCase())}
              autoCapitalize="characters"
              maxLength={8}
            />

            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80"
              onPress={() => {}}
            >
              <Text className="text-cream font-semibold text-base">Unirse</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
