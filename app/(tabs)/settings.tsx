import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';

type IconName = ComponentProps<typeof Ionicons>['name'];

const THEME_OPTIONS: { value: ThemeMode; label: string; description: string; icon: IconName }[] = [
  { value: 'system', label: 'Seguir dispositivo', description: 'Cambia automáticamente según tu sistema', icon: 'phone-portrait-outline' },
  { value: 'light',  label: 'Modo claro',         description: 'Siempre usar colores claros',            icon: 'sunny-outline'          },
  { value: 'dark',   label: 'Modo oscuro',         description: 'Siempre usar colores oscuros',           icon: 'moon-outline'           },
];

const MEMBERS = ['Gabriel Campos', 'Joaquín Fuentealba', 'Arturo Herreros', 'Anaís Neira', 'Luc Olhabe'];

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { mode, setMode } = useTheme();

  const iconMuted   = isDark ? '#9CA3AF' : '#64748B';
  const iconPrimary = isDark ? '#60A5FA' : '#1D4ED8';

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-2 pb-10">

          <Text className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-gray-50 mb-7">
            Ajustes
          </Text>

          {/* Apariencia */}
          <Text className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-2">
            Apariencia
          </Text>
          <View className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden mb-7">
            {THEME_OPTIONS.map((opt, i) => {
              const selected = mode === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${i < THEME_OPTIONS.length - 1 ? 'border-b border-slate-100 dark:border-gray-800' : ''}`}
                  onPress={() => setMode(opt.value)}
                >
                  <View className={`w-9 h-9 rounded-xl items-center justify-center ${selected ? 'bg-blue-50 dark:bg-blue-950' : 'bg-slate-100 dark:bg-gray-800'}`}>
                    <Ionicons name={opt.icon} size={18} color={selected ? iconPrimary : iconMuted} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-medium text-slate-900 dark:text-gray-50">{opt.label}</Text>
                    <Text className="text-[12px] text-slate-500 dark:text-gray-400 mt-0.5">{opt.description}</Text>
                  </View>
                  {selected
                    ? <Ionicons name="checkmark-circle" size={22} color={iconPrimary} />
                    : <View className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-gray-600" />
                  }
                </Pressable>
              );
            })}
          </View>

          {/* Acerca de */}
          <Text className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-2">
            Acerca de
          </Text>
          <View className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden mb-7">
            {[
              { icon: 'information-circle-outline' as IconName, label: 'Versión',   value: '1.0.0'     },
              { icon: 'storefront-outline'          as IconName, label: 'Catálogo',  value: 'Jumbo.cl'  },
              { icon: 'globe-outline'               as IconName, label: 'Idioma',    value: 'Español'   },
            ].map((row, i, arr) => (
              <View
                key={row.label}
                className={`flex-row items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-slate-100 dark:border-gray-800' : ''}`}
              >
                <View className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-gray-800 items-center justify-center">
                  <Ionicons name={row.icon} size={18} color={iconMuted} />
                </View>
                <Text className="flex-1 text-[15px] font-medium text-slate-900 dark:text-gray-50">{row.label}</Text>
                <Text className="text-[14px] text-slate-500 dark:text-gray-400">{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Integrantes */}
          <Text className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-2">
            Integrantes
          </Text>
          <View className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            {MEMBERS.map((name, i) => (
              <View
                key={name}
                className={`flex-row items-center gap-3 px-4 py-3 ${i < MEMBERS.length - 1 ? 'border-b border-slate-100 dark:border-gray-800' : ''}`}
              >
                <View className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 items-center justify-center">
                  <Text className="text-[13px] font-bold text-blue-700 dark:text-blue-400">{name.charAt(0)}</Text>
                </View>
                <Text className="text-[15px] font-medium text-slate-900 dark:text-gray-50">{name}</Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
