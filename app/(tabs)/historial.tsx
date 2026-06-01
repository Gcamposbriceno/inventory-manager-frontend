import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function HistorialScreen() {
  return (
    <Screen>
      <ScreenHeader title="Historial" subtitle="Compras registradas" />
      <ComingSoon
        icon="time-outline"
        iconColor="#52B788"
        description="Aquí verás el historial de compras de tu hogar, incluyendo el detalle de productos, precios y boletas registradas."
      />
    </Screen>
  );
}
