import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-14">
            <Text className="font-display text-6xl text-forest dark:text-mint mb-2">Despensa</Text>
            <Text className="text-pebble text-base">Gestiona tu inventario</Text>
          </View>

          <View className="gap-3 mb-5">
            <TextInput
              className="bg-stone dark:bg-[#1E1E1C] border border-transparent dark:border-[#2E2E2C] rounded-xl px-4 py-4 text-ink dark:text-[#F2F0EB] text-base"
              placeholder="Correo electrónico"
              placeholderTextColor={isDark ? '#7F7B74' : '#9E9B95'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              className="bg-stone dark:bg-[#1E1E1C] border border-transparent dark:border-[#2E2E2C] rounded-xl px-4 py-4 text-ink dark:text-[#F2F0EB] text-base"
              placeholder="Contraseña"
              placeholderTextColor={isDark ? '#7F7B74' : '#9E9B95'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="gap-3">
            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80"
              onPress={() => router.push('/pantry-setup')}
            >
              <Text className="text-cream font-semibold text-base">Iniciar sesión</Text>
            </Pressable>

            <Pressable
              className="border border-forest dark:border-mint py-4 rounded-xl items-center active:opacity-80"
              onPress={() => router.push('/register')}
            >
              <Text className="text-forest dark:text-mint font-semibold text-base">
                Registrarse
              </Text>
            </Pressable>

            <Pressable
              className="py-4 items-center active:opacity-60"
              onPress={() => router.push('/pantry-setup')}
            >
              <Text className="text-pebble text-sm">Continuar como invitado</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
