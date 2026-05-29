import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function ListaScreen() {
  return (
    <Screen>
      <ScreenHeader title="Lista de compras" subtitle="Productos necesarios" />
      <ComingSoon
        icon="cart-outline"
        iconColor="#2D6A4F"
        description="Aquí se generará automáticamente tu lista de compras en base al stock actual de tu despensa y las recetas planificadas."
      />
    </Screen>
  );
}
