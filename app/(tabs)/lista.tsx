import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListaScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <View className="px-5 pt-2 pb-5 border-b border-stone dark:border-[#2E2E2C]">
        <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">Lista de compras</Text>
        <Text className="text-[14px] text-pebble mt-0.5">Productos necesarios</Text>
      </View>
      <View className="flex-1 items-center justify-center px-10 gap-4">
        <View className="w-24 h-24 rounded-[28px] bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-2">
          <Ionicons name="cart-outline" size={48} color="#2D6A4F" />
        </View>
        <Text className="font-display text-[22px] text-ink dark:text-[#F2F0EB]">Próximamente</Text>
        <Text className="text-[14px] text-pebble text-center leading-relaxed">
          Aquí se generará automáticamente tu lista de compras en base al stock actual de tu despensa y las recetas planificadas.
        </Text>
      </View>
    </SafeAreaView>
  );
}
