import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function DespensaScreen() {
  return (
    <Screen>
      <ScreenHeader title="Despensa" subtitle="Inventario del hogar" />
      <ComingSoon
        icon="file-tray-full-outline"
        iconColor="#1B4332"
        description="Aquí podrás ver y editar el stock de cada producto, escanear códigos de barras y recibir alertas de productos bajo mínimo."
      />
    </Screen>
  );
}
