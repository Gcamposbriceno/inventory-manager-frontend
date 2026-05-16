import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListaScreen() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#FCD34D' : '#B45309';

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-gray-950" edges={['top']}>
      <View className="px-5 pt-2 pb-5 border-b border-slate-200 dark:border-gray-800">
        <Text className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-gray-50">Lista de compras</Text>
        <Text className="text-[14px] text-slate-500 dark:text-gray-400 mt-0.5">Productos necesarios</Text>
      </View>
      <View className="flex-1 items-center justify-center px-10 gap-4">
        <View className="w-24 h-24 rounded-[28px] bg-amber-50 dark:bg-amber-950 items-center justify-center mb-2">
          <Ionicons name="cart-outline" size={48} color={iconColor} />
        </View>
        <Text className="text-[20px] font-bold text-slate-900 dark:text-gray-50">Próximamente</Text>
        <Text className="text-[14px] text-slate-500 dark:text-gray-400 text-center leading-relaxed">
          Aquí se generará automáticamente tu lista de compras en base al stock actual de tu despensa y las recetas planificadas.
        </Text>
      </View>
    </SafeAreaView>
  );
}
