import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProduct } from '@/lib/api/products';

const FRAME_W = 252;
const FRAME_H = 140;

type ConsumptionMode = 'all' | 'partial';

function ScanCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const colors = useThemeColors();
  const top  = pos[0] === 't';
  const left = pos[1] === 'l';
  return (
    <View
      style={{
        position: 'absolute',
        top:    top  ? -1 : undefined,
        bottom: !top ? -1 : undefined,
        left:   left  ? -1 : undefined,
        right:  !left ? -1 : undefined,
        width: 22,
        height: 22,
        borderTopWidth:    top  ? 2.5 : 0,
        borderBottomWidth: !top ? 2.5 : 0,
        borderLeftWidth:   left  ? 2.5 : 0,
        borderRightWidth:  !left ? 2.5 : 0,
        borderColor: colors.mint,
        borderTopLeftRadius:     top  && left  ? 4 : 0,
        borderTopRightRadius:    top  && !left ? 4 : 0,
        borderBottomLeftRadius:  !top && left  ? 4 : 0,
        borderBottomRightRadius: !top && !left ? 4 : 0,
      }}
    />
  );
}

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const { data: product, isLoading: productLoading, isError: productNotFound } = useProduct(scannedCode ?? '');
  const [torchOn, setTorchOn] = useState(false);
  const [mode, setMode] = useState<ConsumptionMode>('all');
  const [amount, setAmount] = useState(0.5);
  const scanning = useRef(false);

  function handleBarcodeScanned({ data }: { data: string }) {
    if (scanning.current) return;
    scanning.current = true;
    setScannedCode(data);
  }

  function handleScanAnother() {
    setScannedCode(null);
    setMode('all');
    setAmount(0.5);
    scanning.current = false;
  }

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-8">
        <Ionicons name="camera-outline" size={48} color="rgba(255,255,255,0.4)" />
        <Text className="text-white text-lg font-semibold mt-4 text-center">
          Se necesita acceso a la cámara
        </Text>
        <Text className="text-white/55 text-sm mt-2 text-center leading-5">
          Para escanear códigos de barras, acepta el permiso de cámara.
        </Text>
        <Pressable
          onPress={requestPermission}
          className="mt-7 bg-mint px-7 py-3 rounded-2xl"
        >
          <Text className="text-white font-semibold text-base">Permitir acceso</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="mt-4 p-2">
          <Text className="text-white/45 text-sm">Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        facing="back"
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
        }}
        onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
      />
      {/* Dimmed overlay with transparent scan window */}
      <View className="absolute inset-0" pointerEvents="none">
        <View className="flex-1 bg-black/[0.72]" />
        <View style={{ flexDirection: 'row', height: FRAME_H }}>
          <View className="flex-1 bg-black/[0.72]" />
          <View style={{ width: FRAME_W, height: FRAME_H }}>
            <ScanCorner pos="tl" />
            <ScanCorner pos="tr" />
            <ScanCorner pos="bl" />
            <ScanCorner pos="br" />
          </View>
          <View className="flex-1 bg-black/[0.72]" />
        </View>
        <View className="bg-black/[0.72]" style={{ flex: 2 }} />
      </View>

      {/* Close button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-4 w-9 h-9 rounded-full bg-white/15 items-center justify-center"
        style={{ top: insets.top + 16 }}
      >
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </Pressable>

      {/* Torch toggle */}
      <Pressable
        onPress={() => setTorchOn((v) => !v)}
        className="absolute right-4 w-9 h-9 rounded-full items-center justify-center"
        style={{
          top: insets.top + 16,
          backgroundColor: torchOn ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
        }}
      >
        <Ionicons
          name={torchOn ? 'flash' : 'flash-outline'}
          size={18}
          color={torchOn ? colors.ink : '#fff'}
        />
      </Pressable>

      {/* Instruction */}
      {!scannedCode && (
        <View
          className="absolute left-0 right-0 items-center"
          style={{ bottom: 100 + insets.bottom }}
          pointerEvents="none"
        >
          <Text className="text-sm text-white/70 tracking-wide">
            Apunta al código de barras
          </Text>
        </View>
      )}

      {/* Bottom sheet */}
      {scannedCode && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-cream rounded-t-3xl pt-3 px-5 shadow-2xl"
          style={{ paddingBottom: Math.max(32, insets.bottom + 16) }}
        >
          {/* Handle */}
          <View className="w-9 h-1 rounded-full bg-stone self-center mb-5" />

          {/* Product card */}
          <View className="flex-row items-center gap-3 p-3 bg-mist rounded-2xl mb-6">
            <View className="w-11 h-11 rounded-xl bg-white items-center justify-center shrink-0 overflow-hidden">
              {product?.image_url ? (
                <Image source={{ uri: product.image_url }} style={{ width: 44, height: 44 }} resizeMode="contain" />
              ) : (
                <Ionicons
                  name={productNotFound ? 'help-circle-outline' : 'barcode-outline'}
                  size={22}
                  color={productNotFound ? colors.muted : colors.mint}
                />
              )}
            </View>

            <View className="flex-1">
              {productLoading ? (
                <ActivityIndicator size="small" color={colors.mint} />
              ) : productNotFound ? (
                <>
                  <Text className="text-base font-semibold text-ink">No encontrado</Text>
                  <Text className="text-xs text-pebble font-mono">{scannedCode}</Text>
                </>
              ) : (
                <>
                  <Text className="text-base font-semibold text-ink" numberOfLines={1}>{product!.name}</Text>
                  <Text className="text-xs text-pebble">{product!.brand} · {product!.unit_amount}</Text>
                </>
              )}
            </View>

            <View className={`px-2 py-0.5 rounded-lg ${productNotFound ? 'bg-stone' : 'bg-emerald-50'}`}>
              <Text className={`text-xs font-semibold ${productNotFound ? 'text-pebble' : 'text-emerald-800'}`}>
                {productLoading ? '...' : productNotFound ? 'Sin coincidencia' : 'Detectado'}
              </Text>
            </View>
          </View>

          {/* Consumption label */}
          <Text className="text-xs font-semibold tracking-widest uppercase text-pebble mb-2.5">
            ¿Cuánto consumiste?
          </Text>

          {/* Mode selector */}
          <View className="flex-row gap-2.5 mb-5">
            {(
              [
                { key: 'all',     icon: 'trash-outline',         label: 'Se acabó'  },
                { key: 'partial', icon: 'remove-circle-outline', label: 'Una parte' },
              ] as { key: ConsumptionMode; icon: 'trash-outline' | 'remove-circle-outline'; label: string }[]
            ).map(({ key, icon, label }) => {
              const active = mode === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => {
                    setMode(key);
                    if (key === 'partial') setAmount(0.5);
                  }}
                  className="flex-1 py-3 rounded-2xl items-center gap-1"
                  style={{
                    backgroundColor: active ? colors.primary : '#fff',
                    borderWidth: active ? 0 : 1,
                    borderColor: colors.stone,
                  }}
                >
                  <Ionicons name={icon} size={16} color={active ? colors.cream : colors.muted} />
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: active ? colors.cream : colors.ink }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Amount stepper (partial only) */}
          {mode === 'partial' && (
            <View className="flex-row items-center bg-white rounded-2xl border border-stone p-1 gap-1 mb-5">
              <Pressable
                onPress={() => setAmount((p) => Math.max(0.5, +(p - 0.5).toFixed(1)))}
                className="w-13 h-13 rounded-xl bg-stone items-center justify-center shrink-0"
              >
                <Text className="text-3xl text-ink font-light leading-7">−</Text>
              </Pressable>
              <View className="flex-1 items-center">
                <Text className="text-4xl font-semibold text-ink leading-9">{amount.toFixed(1)}</Text>
              </View>
              <Pressable
                onPress={() => setAmount((p) => +(p + 0.5).toFixed(1))}
                className="w-13 h-13 rounded-xl bg-mist items-center justify-center shrink-0"
              >
                <Text className="text-3xl font-light leading-7" style={{ color: colors.mint }}>+</Text>
              </Pressable>
            </View>
          )}

          {/* Confirm */}
          <Pressable
            onPress={() => router.back()}
            className="w-full bg-forest rounded-xl py-3.5 items-center mb-2.5"
          >
            <Text className="text-base font-semibold text-cream">Registrar consumo</Text>
          </Pressable>

          {/* Scan another */}
          <Pressable onPress={handleScanAnother} className="w-full py-1.5 items-center">
            <Text className="text-sm text-pebble">Escanear otro</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
