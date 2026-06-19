import { BackButton } from '@/components/BackButton';
import { TextField } from '@/components/TextField';
import { useCreatePantry } from '@/lib/api/pantries';
import { pantryCreateSchema, type PantryCreateData } from '@/lib/validation';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PantryCreateScreen() {
  const createPantry = useCreatePantry();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdPantryId, setCreatedPantryId] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PantryCreateData>({ resolver: zodResolver(pantryCreateSchema) });

  const onSubmit = async ({ name }: PantryCreateData) => {
    createPantry.mutate(name, {
      onSuccess: (pantry) => {
        setCreatedPantryId(pantry.id);
        setStep('success');
      },
    });
  };

  if (step === 'success') {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]">
        <View className="flex-1 justify-center px-5 gap-10">
          <View className="items-center gap-4">
            <View className="bg-mist rounded-full p-4">
              <Ionicons name="basket-outline" size={56} color="#2D6A4F" />
            </View>
            <Text className="font-display text-[32px] text-ink dark:text-[#F2F0EB] text-center">
              ¡Despensa creada!
            </Text>
            <Text className="text-[15px] text-pebble text-center" style={{ maxWidth: 280 }}>
              ¿Quieres hacer un llenado rápido ahora?
            </Text>
            <Text className="text-[13px] text-pebble text-center" style={{ maxWidth: 280 }}>
              Te mostraremos los productos más comunes de una cocina chilena. Solo desliza o presiona los botones.
            </Text>
          </View>

          <View className="gap-3">
            <Pressable
              className="bg-sage rounded-xl py-5 items-center active:opacity-80"
              onPress={() =>
                router.push({
                  pathname: '/(onboarding)/pantry-quick-fill',
                  params: {
                    pantryId: createdPantryId!,
                  },
                })
              }
            >
              <Text className="text-white font-semibold text-base">Llenar mi despensa ahora</Text>
            </Pressable>

            <Pressable
              className="border border-stone rounded-xl py-5 items-center active:opacity-70"
              onPress={() => router.replace('/(tabs)')}
            >
              <Text className="text-pebble font-semibold text-base">Empezar con despensa vacía</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text className="font-display text-5xl text-forest dark:text-mint mb-3">
              Nueva despensa
            </Text>
            <Text className="text-pebble text-base mb-10">
              Ponle un nombre para identificarla fácilmente.
            </Text>

            <View className="mb-6">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    placeholder="Ej: Mi despensa, Casa de playa…"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    maxLength={20}
                    error={errors.name?.message}
                  />
                )}
              />
            </View>

            {createPantry.error && (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {createPantry.error.message ?? 'Ocurrió un error. Intenta de nuevo.'}
              </Text>
            )}

            <Pressable
              className="bg-forest py-4 rounded-xl items-center active:opacity-80 disabled:opacity-50"
              onPress={handleSubmit(onSubmit)}
              disabled={createPantry.isPending}
            >
              <Text className="text-cream font-semibold text-base">
                {createPantry.isPending ? 'Creando…' : 'Crear despensa'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
