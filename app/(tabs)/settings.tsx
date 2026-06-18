import { useTheme, type ThemeMode } from '@/context/ThemeContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useLeavePantry, usePantry } from '@/lib/api/pantries';
import { useClerk } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type IconName = ComponentProps<typeof Ionicons>['name'];

const THEME_OPTIONS: { value: ThemeMode; label: string; description: string; icon: IconName }[] = [
  {
    value: 'system',
    label: 'Seguir dispositivo',
    description: 'Cambia automáticamente según tu sistema',
    icon: 'phone-portrait-outline',
  },
  {
    value: 'light',
    label: 'Modo claro',
    description: 'Siempre usar colores claros',
    icon: 'sunny-outline',
  },
  {
    value: 'dark',
    label: 'Modo oscuro',
    description: 'Siempre usar colores oscuros',
    icon: 'moon-outline',
  },
];

const MEMBERS = [
  'Gabriel Campos',
  'Joaquín Fuentealba',
  'Arturo Herreros',
  'Anaís Neira',
  'Luc Olhabe',
];

export default function SettingsScreen() {
  const leavePantryMutation = useLeavePantry();
  const { data: pantries } = usePantry();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPantry, setSelectedPantry] = useState<string | null>(null);
  const { primary, muted } = useThemeColors();
  const { mode, setMode } = useTheme();
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-2 pb-10">
          <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB] mb-7">
            Ajustes
          </Text>

          {/* Apariencia */}
          <Text className="text-[11px] font-medium tracking-wide uppercase text-pebble mb-2">
            Apariencia
          </Text>
          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden mb-7">
            {THEME_OPTIONS.map((opt, i) => {
              const selected = mode === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${i < THEME_OPTIONS.length - 1 ? 'border-b border-stone/60 dark:border-[#2E2E2C]' : ''}`}
                  onPress={() => setMode(opt.value)}
                >
                  <View
                    className={`w-9 h-9 rounded-xl items-center justify-center ${selected ? 'bg-mist dark:bg-[#0D2B1A]' : 'bg-stone dark:bg-[#2E2E2C]'}`}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={selected ? primary : muted}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-medium text-ink dark:text-[#F2F0EB]">
                      {opt.label}
                    </Text>
                    <Text className="text-[12px] text-pebble mt-0.5">{opt.description}</Text>
                  </View>
                  {selected ? (
                    <Ionicons name="checkmark-circle" size={22} color={primary} />
                  ) : (
                    <View className="w-5 h-5 rounded-full border-2 border-stone dark:border-[#2E2E2C]" />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Acerca de */}
          <Text className="text-[11px] font-medium tracking-wide uppercase text-pebble mb-2">
            Acerca de
          </Text>
          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden mb-7">
            {[
              { icon: 'information-circle-outline' as IconName, label: 'Versión', value: '1.0.0' },
              { icon: 'storefront-outline' as IconName, label: 'Catálogo', value: 'Jumbo.cl' },
              { icon: 'globe-outline' as IconName, label: 'Idioma', value: 'Español' },
            ].map((row, i, arr) => (
              <View
                key={row.label}
                className={`flex-row items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-stone/60 dark:border-[#2E2E2C]' : ''}`}
              >
                <View className="w-9 h-9 rounded-xl bg-stone dark:bg-[#2E2E2C] items-center justify-center">
                  <Ionicons name={row.icon} size={18} color={muted} />
                </View>
                <Text className="flex-1 text-[15px] font-medium text-ink dark:text-[#F2F0EB]">
                  {row.label}
                </Text>
                <Text className="text-[14px] text-pebble">{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Integrantes */}
          <Text className="text-[11px] font-medium tracking-wide uppercase text-pebble mb-2">
            Integrantes
          </Text>
          <View className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] overflow-hidden">
            {MEMBERS.map((name, i) => (
              <View
                key={name}
                className={`flex-row items-center gap-3 px-4 py-3 ${i < MEMBERS.length - 1 ? 'border-b border-stone/60 dark:border-[#2E2E2C]' : ''}`}
              >
                <View className="w-8 h-8 rounded-full bg-mist dark:bg-[#0D2B1A] items-center justify-center">
                  <Text className="text-[13px] font-bold text-forest dark:text-mint">
                    {name.charAt(0)}
                  </Text>
                </View>
                <Text className="text-[15px] font-medium text-ink dark:text-[#F2F0EB]">{name}</Text>
              </View>
            ))}
          </View>
          <Pressable
            className="mt-6 rounded-2xl border border-expired/40 bg-expired/10 py-3.5 items-center active:opacity-70"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-[15px] font-semibold text-expired">
              Salir de la despensa
            </Text>
          </Pressable>
        <Pressable
          className="mt-3 rounded-2xl border border-expired/40 bg-expired/10 py-3.5 items-center active:opacity-70"
          onPress={handleSignOut}
        >
          <Text className="text-[15px] font-semibold text-expired">
            Cerrar sesión
          </Text>
        </Pressable>
        </View>
      </ScrollView>
    {modalVisible && (
      <View className="absolute inset-0 bg-black/40 items-center justify-center px-5">
        <View className="w-full rounded-2xl bg-white dark:bg-[#1E1E1C] p-4">
          
          <Text className="text-[16px] font-semibold text-ink dark:text-[#F2F0EB] mb-3">
            ¿De qué despensa quieres salir?
          </Text>

          {(pantries ?? []).map((p) => {
            const selected = selectedPantry === p.id;

            return (
              <Pressable
                key={p.id}
                className={`flex-row items-center justify-between px-3 py-3 rounded-xl mb-2 ${
                  selected ? 'bg-expired/10' : 'bg-stone dark:bg-[#2E2E2C]'
                }`}
                onPress={() => setSelectedPantry(p.id)}
              >
                <Text className="text-ink dark:text-[#F2F0EB] font-medium">
                  {p.name}
                </Text>

                {selected && (
                  <Ionicons name="checkmark-circle" size={18} color="#E76F51" />
                )}
              </Pressable>
            );
          })}

          <View className="flex-row gap-2 mt-3">
            <Pressable
              className="flex-1 py-3 rounded-xl bg-stone dark:bg-[#2E2E2C] items-center"
              onPress={() => {
                setModalVisible(false);
                setSelectedPantry(null);
              }}
            >
              <Text className="text-pebble font-medium">Cancelar</Text>
            </Pressable>

              <Pressable
                className="flex-1 py-3 rounded-xl bg-expired items-center"
                onPress={async () => {
                  if (!selectedPantry) return;

                  try {
                    await leavePantryMutation.mutateAsync(selectedPantry);

                    setModalVisible(false);
                    setSelectedPantry(null);
                  } catch (error) {
                    console.error('Error al salir de la despensa:', error);
                  }
                }}
                disabled={!selectedPantry || leavePantryMutation.isPending}
              >
                <Text className="text-white font-semibold">
                  {leavePantryMutation.isPending ? 'Saliendo...' : 'Confirmar'}
                </Text>
              </Pressable>
          </View>
        </View>
      </View>
    )}
    </SafeAreaView>
  );
}
