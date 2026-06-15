import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FRAME_W = 252;
const FRAME_H = 140;

const C = {
  cream:  '#F8F7F4',
  forest: '#1B4332',
  mint:   '#52B788',
  mist:   '#D8F3DC',
  stone:  '#E8E6E1',
  pebble: '#9E9B95',
  ink:    '#1C1C1A',
  DIM:    'rgba(0,0,0,0.72)',
} as const;

const MOCK = {
  name:    'Leche Entera 1L',
  brand:   'Soprole',
  icon:    'water-outline' as const,
  current: 2,
  unit:    'L',
};

type ConsumptionMode = 'all' | 'partial';

function ScanCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
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
        borderColor: C.mint,
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
  const [showSheet, setShowSheet] = useState(false);
  const [mode, setMode] = useState<ConsumptionMode>('all');
  const [amount, setAmount] = useState(0.5);

  function handleSimulate() {
    setShowSheet(true);
    setMode('all');
    setAmount(0.5);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#111' }}>

      {/* Overlay with transparent scan window cut-out */}
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: C.DIM }} />
        <View style={{ flexDirection: 'row', height: FRAME_H }}>
          <View style={{ flex: 1, backgroundColor: C.DIM }} />
          {/* Transparent scan window */}
          <View style={{ width: FRAME_W, height: FRAME_H }}>
            <ScanCorner pos="tl" />
            <ScanCorner pos="tr" />
            <ScanCorner pos="bl" />
            <ScanCorner pos="br" />
          </View>
          <View style={{ flex: 1, backgroundColor: C.DIM }} />
        </View>
        <View style={{ flex: 2, backgroundColor: C.DIM }} />
      </View>

      {/* Close button */}
      <Pressable
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: insets.top + 16,
          left: 16,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </Pressable>

      {/* Instruction + simulate button */}
      {!showSheet && (
        <View
          style={{
            position: 'absolute',
            bottom: 100 + insets.bottom,
            left: 0,
            right: 0,
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.2 }}>
            Apunta al código de barras
          </Text>
          <Pressable
            onPress={handleSimulate}
            style={{
              paddingHorizontal: 22,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
            }}
          >
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
              ✦  Simular escaneo
            </Text>
          </Pressable>
        </View>
      )}

      {/* Bottom sheet */}
      {showSheet && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: C.cream,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 12,
            paddingHorizontal: 20,
            paddingBottom: Math.max(32, insets.bottom + 16),
            shadowColor: '#000',
            shadowOpacity: 0.35,
            shadowRadius: 40,
            elevation: 8,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.stone,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          />

          {/* Product card */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              backgroundColor: C.mist,
              borderRadius: 16,
              marginBottom: 22,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Ionicons name={MOCK.icon} size={22} color={C.mint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: C.ink }}>{MOCK.name}</Text>
              <Text style={{ fontSize: 12, color: C.pebble }}>
                {MOCK.brand}  ·  stock: {MOCK.current} {MOCK.unit}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 8,
                backgroundColor: '#ECFDF5',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#065F46' }}>Detectado</Text>
            </View>
          </View>

          {/* Consumption label */}
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: C.pebble,
              marginBottom: 10,
            }}
          >
            ¿Cuánto consumiste?
          </Text>

          {/* Mode selector */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            {(
              [
                { key: 'all',     icon: 'trash-outline',          label: 'Se acabó'  },
                { key: 'partial', icon: 'remove-circle-outline',  label: 'Una parte' },
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
                  style={{
                    flex: 1,
                    paddingVertical: 13,
                    borderRadius: 14,
                    backgroundColor: active ? C.forest : '#fff',
                    borderWidth: active ? 0 : 1,
                    borderColor: C.stone,
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Ionicons name={icon} size={16} color={active ? C.cream : C.pebble} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: active ? C.cream : C.ink }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Amount stepper (partial only) */}
          {mode === 'partial' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: C.stone,
                padding: 4,
                gap: 4,
                marginBottom: 20,
              }}
            >
              <Pressable
                onPress={() => setAmount((p) => Math.max(0.5, +(p - 0.5).toFixed(1)))}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  backgroundColor: C.stone,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text style={{ fontSize: 26, color: C.ink, lineHeight: 26, fontWeight: '300' }}>−</Text>
              </Pressable>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 30, fontWeight: '600', color: C.ink, lineHeight: 34 }}>
                  {amount.toFixed(1)}
                </Text>
                <Text style={{ fontSize: 12, color: C.pebble, marginTop: 2 }}>{MOCK.unit}</Text>
              </View>
              <Pressable
                onPress={() =>
                  setAmount((p) => Math.min(MOCK.current, +(p + 0.5).toFixed(1)))
                }
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  backgroundColor: C.mist,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text style={{ fontSize: 26, color: C.mint, lineHeight: 26, fontWeight: '300' }}>+</Text>
              </Pressable>
            </View>
          )}

          {/* Confirm */}
          <Pressable
            onPress={() => router.back()}
            style={{
              width: '100%',
              backgroundColor: C.forest,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.cream }}>
              Registrar consumo
            </Text>
          </Pressable>

          {/* Cancel */}
          <Pressable
            onPress={() => setShowSheet(false)}
            style={{ width: '100%', paddingVertical: 6, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 14, color: C.pebble }}>Cancelar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
