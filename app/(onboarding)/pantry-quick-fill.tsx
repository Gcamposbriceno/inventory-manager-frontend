import { usePantry } from '@/context/PantryContext';
import { useQuickFillProductTypes } from '@/lib/api/productTypes';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SWIPE_THRESHOLD = 80;

const UNIT_LABEL: Record<string, string> = {
  kg: 'kilogramos',
  l: 'litros',
  ml: 'mililitros',
  g: 'gramos',
  un: 'unidades',
};

export default function PantryQuickFillScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation();
  const { pantryId } = usePantry();
  const { data: types, isLoading } = useQuickFillProductTypes();

  const [index, setIndex] = useState(0);

  const pan = useRef(new Animated.ValueXY()).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const intentionalExit = useRef(false);

  const cardRotation = pan.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const yesOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const noOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Multiplied by overlayOpacity so both go to 0 instantly during card transitions
  const combinedYesOpacity = useRef(Animated.multiply(yesOpacity, overlayOpacity)).current;
  const combinedNoOpacity = useRef(Animated.multiply(noOpacity, overlayOpacity)).current;

  const total = types?.length ?? 0;
  const done = !isLoading && index >= total;

  // Intercept back navigation (Android gesture + iOS swipe) while filling is in progress
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isLoading || done || intentionalExit.current) return;
      e.preventDefault();
      Alert.alert(
        '¿Salir del llenado?',
        'Si sales ahora terminarás el llenado rápido. Lo que ya agregaste queda guardado en tu despensa.',
        [
          { text: 'Seguir llenando', style: 'cancel' },
          {
            text: 'Sí, salir',
            style: 'destructive',
            onPress: () => {
              intentionalExit.current = true;
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, isLoading, done]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > Math.abs(dy),
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, { dx }) => {
        if (dx > SWIPE_THRESHOLD) {
          animateOut('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          animateOut('left');
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  function animateOut(direction: 'left' | 'right') {
    const toX = direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5;
    Animated.timing(pan, {
      toValue: { x: toX, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (direction === 'right') {
        handleTengo();
      } else {
        advanceCard();
      }
    });
  }

  // Fires synchronously after React commits the new index, before paint.
  // Safe to reset pan and restore opacity here — new card content is already in the tree.
  useLayoutEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    cardOpacity.setValue(1);
    overlayOpacity.setValue(1);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  function advanceCard() {
    cardOpacity.setValue(0);
    overlayOpacity.setValue(0);
    setIndex((i) => i + 1);
  }

  // "Sí tengo" → jump to the full add-type flow (thresholds → products) for this
  // type, then resume the deck on the next card when we pop back. Advancing the
  // index up front means a type the user backs out of is simply skipped.
  function handleTengo() {
    const type = types?.[index];
    if (!type) return;
    setIndex((i) => i + 1);
    if (pantryId) {
      router.push(`/pantry-add-type?pantryId=${pantryId}&typeId=${type.id}`);
    }
  }

  function handleYes() {
    animateOut('right');
  }

  function handleNo() {
    animateOut('left');
  }

  function handleFinish() {
    intentionalExit.current = true;
    router.replace('/(tabs)');
  }

  function handleSkip() {
    Alert.alert('¿Entrar ahora?', 'Lo que ya agregaste queda guardado en tu despensa.', [
      { text: 'Sí, entrar', onPress: handleFinish },
      { text: 'Seguir llenando', style: 'cancel' },
    ]);
  }

  // ── Cargando ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614] items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  // ── Pantalla de cierre ──────────────────────────────────────────────────────
  if (done) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614] items-center justify-center px-6">
        <View className="bg-sage rounded-full p-5 mb-6">
          <Ionicons name="checkmark" size={40} color="white" />
        </View>
        <Text className="font-display text-[32px] text-ink dark:text-[#F2F0EB] text-center mb-3">
          ¡Listo!
        </Text>
        <Text className="text-[15px] text-pebble text-center mb-10">
          {total === 0
            ? 'Puedes agregar productos a tu despensa cuando quieras.'
            : 'Tu despensa quedó lista. Puedes seguir agregando productos cuando quieras.'}
        </Text>
        <Pressable
          className="bg-sage rounded-xl py-5 px-10 items-center active:opacity-80"
          onPress={handleFinish}
        >
          <Text className="text-white font-semibold text-base">Entrar a mi despensa</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const type = types![index];
  const progress = index / total;

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]">
      {/* ── Header ── */}
      <View className="px-5 pt-2 pb-3 gap-3">
        <View className="flex-row justify-end">
          <Pressable onPress={handleSkip} className="active:opacity-60">
            <Text className="text-[15px] text-pebble">Saltar y entrar</Text>
          </Pressable>
        </View>

        {/* Barra de progreso */}
        <View className="h-1 bg-mist rounded-full overflow-hidden">
          <View className="h-full bg-sage rounded-full" style={{ width: `${progress * 100}%` }} />
        </View>
        <Text className="text-[12px] text-pebble text-center">
          {index} de {total}
        </Text>
      </View>

      {/* ── Tarjeta ── */}
      <View className="flex-1 justify-center">
        <Animated.View
          style={{
            opacity: cardOpacity,
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate: cardRotation },
            ],
          }}
          {...panResponder.panHandlers}
        >
          <View
            className="bg-white dark:bg-[#1E1E1C] rounded-3xl mx-6 p-8 items-center"
            style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 }}
          >
            {/* Overlay Sí */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                backgroundColor: '#2D6A4F22',
                opacity: combinedYesOpacity,
              }}
            />

            {/* Overlay No */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                backgroundColor: '#E76F5122',
                opacity: combinedNoOpacity,
              }}
            />

            <View className="w-20 h-20 rounded-3xl bg-mist dark:bg-[#0D2B1A] items-center justify-center mb-4">
              <Ionicons name="cube-outline" size={40} color="#2D6A4F" />
            </View>
            <Text className="text-[22px] font-semibold text-ink dark:text-[#F2F0EB] text-center mb-1">
              {type.name}
            </Text>
            <Text className="text-[12px] text-pebble uppercase tracking-widest text-center">
              {UNIT_LABEL[type.measurement_unit] ?? type.measurement_unit}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* ── Indicador de swipe ── */}
      <View className="h-12 items-center justify-center my-2">
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            opacity: combinedYesOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 18 }}>✓</Text>
          <Text className="text-sage font-semibold text-base">Tengo</Text>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            opacity: combinedNoOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 18 }}>✗</Text>
          <Text className="text-expired font-semibold text-base">No tengo</Text>
        </Animated.View>
      </View>

      {/* ── Botones inferiores ── */}
      <View className="flex-row gap-4 mx-6 mb-8">
        <Pressable
          className="flex-1 border border-stone rounded-2xl py-4 items-center active:opacity-70"
          onPress={handleNo}
        >
          <Text className="text-pebble font-semibold">✗ No tengo</Text>
        </Pressable>
        <Pressable
          className="flex-1 border border-sage rounded-2xl py-4 items-center active:opacity-70"
          onPress={handleYes}
        >
          <Text className="text-sage font-semibold">✓ Sí tengo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
