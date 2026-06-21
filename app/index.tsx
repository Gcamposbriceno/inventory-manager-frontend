import { TextField } from '@/components/TextField';
import { loginSchema, type LoginData } from '@/lib/validation';
import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const { signIn, setActive, isLoaded } = useSignIn();
  const onSubmit = async (data: LoginData) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === 'complete') {
        await setActive({
          session: result.createdSessionId,
        });
      } else {
        console.log('Clerk sign-in status inesperado:', result.status);
        alert(`Autenticación incompleta (estado: ${result.status}). Intenta de nuevo.`);
      }
    } catch (err: any) {
    console.log('Clerk error', JSON.stringify(err, null, 2));
    alert('Error al iniciar sesión');
    }
};

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
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  placeholder="Correo electrónico"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  placeholder="Contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          <View className="gap-3">
            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-cream font-semibold text-base">Iniciar sesión</Text>
            </Pressable>

            <Pressable
              className="border border-forest dark:border-mint py-4 rounded-xl items-center active:opacity-80"
              onPress={() => router.push('/register')}
            >
              <Text className="text-forest dark:text-mint font-semibold text-base">Registrarse</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
