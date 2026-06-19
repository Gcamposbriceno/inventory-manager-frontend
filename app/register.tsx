import { BackButton } from '@/components/BackButton';
import { TextField } from '@/components/TextField';
import { registerSchema, type RegisterData } from '@/lib/validation';
import { useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const { signUp, setActive, isLoaded } = useSignUp();

  const onSubmit = async (data: RegisterData) => {
    if (!isLoaded) return;

    try {

      const result = await signUp.create({
        emailAddress: data.email.trim().toLowerCase(),
        password: data.password,
        username: data.name
      });

      // console.log('SIGNUP RESULT:', result);

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        alert('Se requiere verificación adicional. Revisa tu correo electrónico.');
      }
    } catch (err: any) {
      // console.log('REGISTER ERROR:', JSON.stringify(err, null, 2));
      alert(
        err?.errors?.[0]?.message ?? 'Error al crear cuenta'
      );
    }
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
              <Text className="text-cream font-semibold text-base">
                Crear cuenta
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}