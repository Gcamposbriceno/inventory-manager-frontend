import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <Text className="font-display text-5xl text-forest mb-2">Crear cuenta</Text>
            <Text className="text-pebble text-base mb-10">
              Únete para gestionar tu despensa
            </Text>

            <View className="gap-3 mb-6">
              <TextInput
                className="bg-stone rounded-xl px-4 py-4 text-ink text-base"
                placeholder="Nombre"
                placeholderTextColor="#9E9B95"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                className="bg-stone rounded-xl px-4 py-4 text-ink text-base"
                placeholder="Correo electrónico"
                placeholderTextColor="#9E9B95"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                className="bg-stone rounded-xl px-4 py-4 text-ink text-base"
                placeholder="Contraseña"
                placeholderTextColor="#9E9B95"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80"
              onPress={() => router.push("/pantry-setup")}
            >
              <Text className="text-cream font-semibold text-base">Crear cuenta</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
