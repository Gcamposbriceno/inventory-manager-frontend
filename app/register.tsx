import { BackButton } from '@/components/BackButton';
import { TextField } from '@/components/TextField';
import { registerSchema, type RegisterData } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (_data: RegisterData) => {
    router.push('/pantry-setup');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          <View className="pt-4 pb-2">
            <BackButton />
          </View>

          <View className="flex-1 justify-center">
            <Text className="font-display text-5xl text-forest dark:text-mint mb-2">
              Crear cuenta
            </Text>
            <Text className="text-pebble text-base mb-10">
              Únete para gestionar tu despensa
            </Text>

            <View className="gap-3 mb-6">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    placeholder="Nombre"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                  />
                )}
              />
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

            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-cream font-semibold text-base">Crear cuenta</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
