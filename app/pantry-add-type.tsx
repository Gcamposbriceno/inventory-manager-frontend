import { useAddPantryProduct, useAddPantryProductType, useUpdatePantryStock } from '@/lib/api/pantries';
import { useProductTypeProducts, useProductTypes } from '@/lib/api/productTypes';
import type { ProductType } from '@/types/productType';
import type { Product } from '@/types/product';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ── constants ────────────────────────────────────────────────────────────────

const UNIT_SHORT: Record<string, string> = { kg: 'kg', l: 'L', ml: 'ml', g: 'g', un: 'ud.' };
const UNIT_LONG: Record<string, string>  = { kg: 'kilogramos', l: 'litros', ml: 'mililitros', g: 'gramos', un: 'unidades' };
const STEP_SIZE: Record<string, number>  = { un: 1, kg: 0.5, l: 0.5, ml: 100, g: 50 };
const DECIMALS: Record<string, number>   = { un: 0, kg: 1, l: 1, ml: 0, g: 0 };

type Step = 'search' | 'configure' | 'products';

// ── step indicator ────────────────────────────────────────────────────────────

const STEPS = [
  { n: '1', label: 'Tipo'      },
  { n: '2', label: 'Umbrales'  },
  { n: '3', label: 'Productos' },
];

function StepIndicator({ active }: { active: 0 | 1 | 2 }) {
  return (
    <View className="flex-row items-center mb-6">
      {STEPS.map((s, i) => {
        const done = i < active;
        const curr = i === active;
        return (
          <View key={s.n} className={`flex-row items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
            <View className="flex-row items-center gap-1.5 flex-shrink-0">
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  done ? 'bg-mist dark:bg-[#0D2B1A]' : curr ? 'bg-forest dark:bg-mint' : 'bg-stone dark:bg-[#2E2E2C]'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    done ? 'text-forest dark:text-mint' : curr ? 'text-cream dark:text-[#161614]' : 'text-pebble'
                  }`}
                >
                  {done ? '✓' : s.n}
                </Text>
              </View>
              <Text
                className={`text-[12px] ${curr ? 'font-semibold text-ink dark:text-[#F2F0EB]' : 'font-normal text-pebble'}`}
              >
                {s.label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View
                className={`flex-1 h-px mx-2 ${done ? 'bg-mint' : 'bg-stone dark:bg-[#2E2E2C]'}`}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── type anchor card ──────────────────────────────────────────────────────────

function TypeCard({ name, unit, pantryName }: { name: string; unit: string; pantryName: string }) {
  return (
    <View className="bg-mist dark:bg-[#0D2B1A] rounded-2xl px-4 py-3 mb-7 flex-row items-center gap-3">
      <View className="w-9 h-9 rounded-xl bg-white dark:bg-[#1E1E1C] items-center justify-center flex-shrink-0">
        <Ionicons name="cube-outline" size={18} color="#2D6A4F" />
      </View>
      <View>
        <Text className="text-[15px] font-semibold text-ink dark:text-[#F2F0EB]">{name}</Text>
        <Text className="text-[12px] text-pebble">{unit} · {pantryName}</Text>
      </View>
    </View>
  );
}

// ── stepper ───────────────────────────────────────────────────────────────────

function Stepper({
  label,
  hint,
  value,
  unit,
  decimals,
  onMinus,
  onPlus,
}: {
  label: string;
  hint: string;
  value: number;
  unit: string;
  decimals: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="text-[15px] font-semibold text-ink dark:text-[#F2F0EB] mb-0.5">{label}</Text>
        <Text className="text-[12px] text-pebble">{hint}</Text>
      </View>
      <View className="flex-row items-center bg-white dark:bg-[#1E1E1C] rounded-2xl border border-stone dark:border-[#2E2E2C] p-1 gap-1">
        <Pressable
          onPress={onMinus}
          disabled={value <= 0}
          className={`w-14 h-14 rounded-xl items-center justify-center ${value > 0 ? 'bg-stone dark:bg-[#2E2E2C]' : 'bg-transparent'}`}
        >
          <Text
            className="text-[26px] font-light leading-none"
            style={{ color: value > 0 ? '#1C1C1A' : '#E8E6E1' }}
          >
            −
          </Text>
        </Pressable>
        <View className="flex-1 items-center py-2">
          <Text className="text-[32px] font-semibold text-ink dark:text-[#F2F0EB] leading-none">
            {value.toFixed(decimals)}
          </Text>
          <Text className="text-[13px] text-pebble mt-1">{unit}</Text>
        </View>
        <Pressable
          onPress={onPlus}
          className="w-14 h-14 rounded-xl bg-mist dark:bg-[#0D2B1A] items-center justify-center"
        >
          <Text className="text-[26px] font-light leading-none text-sage dark:text-mint">+</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── local product row (step 3) ────────────────────────────────────────────────

function LocalProductRow({
  product,
  count,
  onAdd,
  onInc,
  onDec,
  isLast,
}: {
  product: Product;
  count: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  isLast: boolean;
}) {
  const added = count > 0;
  return (
    <View>
      <View className="flex-row items-center gap-3 py-3.5 px-0">
        <View className="w-10 h-10 rounded-xl bg-stone dark:bg-[#2E2E2C] overflow-hidden items-center justify-center flex-shrink-0">
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={{ width: 40, height: 40 }} resizeMode="contain" />
          ) : (
            <Ionicons name="cube-outline" size={18} color="#9E9B95" />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-[14px] font-medium text-ink dark:text-[#F2F0EB]" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="text-[12px] text-pebble">{product.brand}</Text>
        </View>
        {added ? (
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={onDec}
              className="w-8 h-8 rounded-lg bg-stone dark:bg-[#2E2E2C] items-center justify-center active:opacity-70"
            >
              <Text className="text-[18px] leading-none text-ink dark:text-[#F2F0EB]">−</Text>
            </Pressable>
            <Text className="text-[14px] font-semibold text-ink dark:text-[#F2F0EB] text-center" style={{ minWidth: 20 }}>
              {count}
            </Text>
            <Pressable
              onPress={onInc}
              className="w-8 h-8 rounded-lg bg-mist dark:bg-[#0D2B1A] items-center justify-center active:opacity-70"
            >
              <Text className="text-[18px] leading-none text-sage dark:text-mint">+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={onAdd}
            className="px-4 py-1.5 rounded-full bg-mist dark:bg-[#0D2B1A] active:opacity-70"
          >
            <Text className="text-[13px] font-semibold text-forest dark:text-mint">Agregar</Text>
          </Pressable>
        )}
      </View>
      {!isLast && <View className="h-px bg-stone dark:bg-[#2E2E2C]" />}
    </View>
  );
}

// ── step 3: products ──────────────────────────────────────────────────────────

function ProductsStep({
  typeName,
  addedSkus,
  onToggle,
  onInc,
  onDec,
  onBack,
  onSubmit,
  isSubmitting,
  submitError,
}: {
  typeName: string;
  addedSkus: Record<string, number>;
  onToggle: (sku: string) => void;
  onInc: (sku: string) => void;
  onDec: (sku: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const { muted } = useThemeColors();
  const [search, setSearch] = useState('');

  const { data: typeProducts, isLoading } = useProductTypeProducts(typeName);
  const q = search.toLowerCase();
  const filtered = (typeProducts ?? []).filter(
    (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
  );
  const addedCount = Object.values(addedSkus).filter((v) => v > 0).length;

  return (
    <View className="flex-1 bg-cream dark:bg-[#161614]">
      {/* Fixed header */}
      <View className="px-5 pt-4 pb-3 flex-shrink-0">
        <Pressable
          className="flex-row items-center gap-1 mb-4 self-start active:opacity-70"
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={18} color={muted} />
          <Text className="text-[14px] text-pebble">Volver a umbrales</Text>
        </Pressable>

        {/* Search */}
        <View className="flex-row items-center bg-stone dark:bg-[#1E1E1C] rounded-xl px-3 gap-2">
          <Ionicons name="search-outline" size={18} color={muted} />
          <TextInput
            className="flex-1 py-3.5 text-[15px] text-ink dark:text-[#F2F0EB]"
            placeholder="Buscar producto…"
            placeholderTextColor={muted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} className="p-1">
              <Ionicons name="close-circle" size={16} color={muted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Product list */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.sku}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <LocalProductRow
              product={item}
              count={addedSkus[item.sku] ?? 0}
              onAdd={() => onToggle(item.sku)}
              onInc={() => onInc(item.sku)}
              onDec={() => onDec(item.sku)}
              isLast={index === filtered.length - 1}
            />
          )}
          ListEmptyComponent={
            <View className="items-center py-12 gap-3">
              <Ionicons name="search-outline" size={48} color={muted} />
              <Text className="text-[15px] text-pebble text-center">Sin resultados</Text>
            </View>
          }
        />
      )}

      {/* Fixed footer */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-6 bg-cream dark:bg-[#161614] border-t border-stone dark:border-[#2E2E2C]">
        {submitError && (
          <Text className="text-red-500 text-[12px] text-center mb-2">{submitError}</Text>
        )}
        <Pressable
          className="w-full bg-forest dark:bg-mint rounded-xl items-center py-4 mb-2.5 active:opacity-80"
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#F2F0EB" />
          ) : (
            <Text className="text-[15px] font-semibold text-cream dark:text-[#161614]">
              {addedCount > 0
                ? `Agregar a despensa · ${addedCount} producto${addedCount > 1 ? 's' : ''}`
                : 'Agregar a despensa'}
            </Text>
          )}
        </Pressable>
        <Pressable
          className="w-full items-center py-2 active:opacity-70"
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          <Text className="text-[14px] text-pebble">Saltar por ahora</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────

export default function PantryAddTypeScreen() {
  const { pantryId, pantryName } = useLocalSearchParams<{ pantryId: string; pantryName: string }>();
  const { muted } = useThemeColors();

  const [step, setStep] = useState<Step>('search');
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [search, setSearch] = useState('');
  const [rop, setRop] = useState(0);
  const [desiredStock, setDesiredStock] = useState(0);
  const [addedSkus, setAddedSkus] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: allTypes, isLoading: typesLoading } = useProductTypes();
  const addType    = useAddPantryProductType();
  const addProduct = useAddPantryProduct();
  const updateStock = useUpdatePantryStock();

  const unitKey    = selectedType?.measurement_unit ?? 'un';
  const unitShort  = UNIT_SHORT[unitKey] ?? unitKey;
  const unitLong   = UNIT_LONG[unitKey]  ?? unitKey;
  const stepSize   = STEP_SIZE[unitKey]  ?? 1;
  const dec        = DECIMALS[unitKey]   ?? 0;

  const desInvalid  = desiredStock > 0 && desiredStock < rop;
  const canContinue = rop > 0 && desiredStock >= rop;

  const filtered = (allTypes ?? []).filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  function selectType(type: ProductType) {
    setSelectedType(type);
    setRop(0);
    setDesiredStock(0);
    setStep('configure');
  }

  function backToSearch() {
    setStep('search');
  }

  function adjustRop(delta: number) {
    setRop((prev) => Math.max(0, +(prev + delta).toFixed(dec)));
  }

  function adjustDesiredStock(delta: number) {
    setDesiredStock((prev) => Math.max(0, +(prev + delta).toFixed(dec)));
  }

  function toggleSku(sku: string) {
    setAddedSkus((prev) => ({ ...prev, [sku]: prev[sku] ? 0 : 1 }));
  }

  function incSku(sku: string) {
    setAddedSkus((prev) => ({ ...prev, [sku]: (prev[sku] ?? 0) + 1 }));
  }

  function decSku(sku: string) {
    setAddedSkus((prev) => {
      const next = { ...prev, [sku]: Math.max(0, (prev[sku] ?? 1) - 1) };
      if (next[sku] === 0) delete next[sku];
      return next;
    });
  }

  async function handleSubmit() {
    if (!selectedType || !pantryId) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await addType.mutateAsync({
        pantryId,
        data: { type_id: selectedType.id, rop, desired_stock: desiredStock },
      });
      const skusToAdd = Object.entries(addedSkus).filter(([, v]) => v > 0);
      for (const [sku, qty] of skusToAdd) {
        await addProduct.mutateAsync({ pantryId, sku });
        if (qty > 0) {
          await updateStock.mutateAsync({ pantryId, sku, stock: qty });
        }
      }
      router.back();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ocurrió un error. Intenta de nuevo.';
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  }

  // ── step 3 ────────────────────────────────────────────────────────────────
  if (step === 'products' && selectedType) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
        <ProductsStep
          typeName={selectedType.name}
          addedSkus={addedSkus}
          onToggle={toggleSku}
          onInc={incSku}
          onDec={decSku}
          onBack={() => setStep('configure')}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </SafeAreaView>
    );
  }

  // ── step 2 ────────────────────────────────────────────────────────────────
  if (step === 'configure' && selectedType) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-4 pb-16"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            className="flex-row items-center gap-1 mb-4 self-start active:opacity-70"
            onPress={backToSearch}
          >
            <Ionicons name="chevron-back" size={18} color={muted} />
            <Text className="text-[14px] text-pebble">Cambiar tipo</Text>
          </Pressable>

          <StepIndicator active={1} />

          <TypeCard name={selectedType.name} unit={unitShort} pantryName={pantryName ?? ''} />

          <Stepper
            label="Mínimo aceptable"
            hint="Recibirás una alerta cuando el stock caiga por debajo de este valor."
            value={rop}
            unit={unitShort}
            decimals={dec}
            onMinus={() => adjustRop(-stepSize)}
            onPlus={() => adjustRop(stepSize)}
          />

          <Stepper
            label="Stock deseado"
            hint="La cantidad que quieres tener habitualmente en tu despensa."
            value={desiredStock}
            unit={unitShort}
            decimals={dec}
            onMinus={() => adjustDesiredStock(-stepSize)}
            onPlus={() => adjustDesiredStock(stepSize)}
          />

          {desInvalid && (
            <View className="flex-row items-center gap-2 bg-red-50 dark:bg-red-950 rounded-xl px-3.5 py-2.5 mb-5">
              <Ionicons name="warning-outline" size={16} color="#DC2626" />
              <Text className="text-[13px] text-red-600 dark:text-red-400 flex-1">
                El stock deseado debe ser mayor o igual al mínimo.
              </Text>
            </View>
          )}

          <Pressable
            className={`rounded-xl py-4 items-center ${canContinue ? 'bg-forest dark:bg-mint active:opacity-80' : 'bg-stone dark:bg-[#2E2E2C]'}`}
            disabled={!canContinue}
            onPress={() => {
              setAddedSkus({});
              setStep('products');
            }}
          >
            <Text
              className={`text-[15px] font-semibold ${
                canContinue ? 'text-cream dark:text-[#161614]' : 'text-pebble'
              }`}
            >
              Continuar
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── step 1 (search) ───────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <View className="px-5 pt-4 pb-3">
        <Pressable
          className="flex-row items-center gap-1 mb-4 self-start active:opacity-70"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={18} color={muted} />
          <Text className="text-[14px] text-pebble">Volver</Text>
        </Pressable>

        <Text className="font-display text-[26px] text-ink dark:text-[#F2F0EB] mb-0.5">
          Agregar tipo
        </Text>
        {pantryName ? (
          <Text className="text-[13px] font-semibold text-forest dark:text-mint mb-1">{pantryName}</Text>
        ) : null}
        <Text className="text-[13px] text-pebble mb-5">¿Qué tipo de producto quieres seguir?</Text>

        <StepIndicator active={0} />

        <View className="flex-row items-center bg-stone dark:bg-[#1E1E1C] rounded-xl px-3 gap-2">
          <Ionicons name="search-outline" size={18} color={muted} />
          <TextInput
            className="flex-1 py-3.5 text-base text-ink dark:text-[#F2F0EB]"
            placeholder="Buscar tipo…"
            placeholderTextColor={muted}
            value={search}
            onChangeText={setSearch}
            autoFocus
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} className="p-1">
              <Ionicons name="close-circle" size={16} color={muted} />
            </Pressable>
          )}
        </View>
      </View>

      {typesLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => (
            <View className="h-px bg-stone dark:bg-[#2E2E2C]" />
          )}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center justify-between py-3.5 active:opacity-70"
              onPress={() => selectType(item)}
            >
              <View>
                <Text className="text-[15px] font-medium text-ink dark:text-[#F2F0EB]">
                  {item.name}
                </Text>
                <Text className="text-[12px] text-pebble mt-0.5">
                  {UNIT_LONG[item.measurement_unit] ?? item.measurement_unit}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={muted} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="items-center py-12 gap-3">
              <Ionicons name="search-outline" size={48} color={muted} />
              <Text className="text-[15px] text-pebble text-center">
                Sin resultados para &quot;{search}&quot;
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
