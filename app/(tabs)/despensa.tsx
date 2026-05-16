import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DespensaScreen() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#60A5FA' : '#1D4ED8';

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-gray-950" edges={['top']}>
      <View className="px-5 pt-2 pb-5 border-b border-slate-200 dark:border-gray-800">
        <Text className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-gray-50">Despensa</Text>
        <Text className="text-[14px] text-slate-500 dark:text-gray-400 mt-0.5">Inventario del hogar</Text>
      </View>
      <View className="flex-1 items-center justify-center px-10 gap-4">
        <View className="w-24 h-24 rounded-[28px] bg-blue-50 dark:bg-blue-950 items-center justify-center mb-2">
          <Ionicons name="file-tray-full-outline" size={48} color={iconColor} />
        </View>
        <Text className="text-[20px] font-bold text-slate-900 dark:text-gray-50">Próximamente</Text>
        <Text className="text-[14px] text-slate-500 dark:text-gray-400 text-center leading-relaxed">
          Aquí podrás ver y editar el stock de cada producto, escanear códigos de barras y recibir alertas de productos bajo mínimo.
        </Text>
      </View>
    </SafeAreaView>
  );
}
