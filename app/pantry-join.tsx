import { BackButton } from '@/components/BackButton';
import { TextField } from '@/components/TextField';
import { useJoinPantry } from '@/lib/api/pantries';
import { pantryJoinSchema, type PantryJoinData } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PantryJoinScreen() {
  const joinPantry = useJoinPantry();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PantryJoinData>({ resolver: zodResolver(pantryJoinSchema) });

  const onSubmit = ({ code }: PantryJoinData) => {
    joinPantry.mutate(code);
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
            <Text className="font-display text-5xl text-forest dark:text-mint mb-3">Unirse</Text>
            <Text className="text-pebble text-base mb-10">
              Ingresa el código que te compartió el dueño de la despensa.
            </Text>

            <View className="mb-6">
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    placeholder="Código de despensa"
                    value={value ?? ''}
                    onChangeText={(t) => onChange(t.toUpperCase())}
                    onBlur={onBlur}
                    autoCapitalize="characters"
                    maxLength={8}
                    error={errors.code?.message}
                  />
                )}
              />
            </View>

            {joinPantry.error && (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {joinPantry.error.message ?? 'Código inválido o despensa no encontrada.'}
              </Text>
            )}

            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80"
              onPress={handleSubmit(onSubmit)}
              disabled={joinPantry.isPending}
            >
              <Text className="text-cream font-semibold text-base">
                {joinPantry.isPending ? 'Uniéndose…' : 'Unirse'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
