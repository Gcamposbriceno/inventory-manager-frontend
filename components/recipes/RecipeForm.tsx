import { useProductTypeProducts, useProductTypes } from '@/lib/api/productTypes';
import { RecipeFormData } from '@/types/recipeForm';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type Props = {
  initialValues?: RecipeFormData;
  submitLabel: string;
  title: string;
  subtitle: string;
  isLoading?: boolean;
  onSubmit: (data: RecipeFormData) => void;
};
export function RecipeForm({
  initialValues,
  submitLabel,
  title,
  subtitle,
  isLoading = false,
  onSubmit,
}: Props) {
  const { data: productTypes = [] } = useProductTypes();

  const [name, setName] = useState(
    initialValues?.name ?? ''
  );

  const [description, setDescription] = useState(
    initialValues?.description ?? ''
  );

  const [total_time_minutes, setTime] = useState(
    initialValues?.total_time_minutes ?? ''
  );

  const [servings, setServings] = useState(
    initialValues?.servings ?? ''
  );

  const [isPublic, setIsPublic] = useState(
    initialValues?.is_public ?? false
  );

  const [ingredients, setIngredients] = useState(
    initialValues?.ingredients ?? []
  );

  const [showSearch, setShowSearch] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');

  const [selectedIngredientTypeId, setSelectedIngredientTypeId] =
    useState<string | null>(null);

  const [showPreferenceSearch, setShowPreferenceSearch] =
    useState(false);

  const [preferenceSearch, setPreferenceSearch] = useState('');

  const selectedIngredient = ingredients.find(
    (i) => i.type_id === selectedIngredientTypeId
  );

  const { data: products = [] } = useProductTypeProducts(
    selectedIngredient?.name ?? ''
  );

  const filteredTypes =
    ingredientSearch.trim() === ''
      ? []
      : productTypes.filter((type) =>
          type.name
            .toLowerCase()
            .includes(ingredientSearch.toLowerCase())
        );

  const filteredProducts =
    preferenceSearch.trim() === ''
      ? products
      : products.filter((product) =>
          product.name
            .toLowerCase()
            .includes(preferenceSearch.toLowerCase())
        );

  const handleSubmit = () => {
    const time = Number(total_time_minutes);
    const portion = Number(servings);

    if (!name.trim()) {
      alert('Debes ingresar un nombre');
      return;
    }

    if (!description.trim()) {
      alert('Debes ingresar una descripción');
      return;
    }

    if (!total_time_minutes || isNaN(time) || time <= 0) {
      alert('El tiempo debe ser un número mayor a 0');
      return;
    }

    if (!servings || isNaN(portion) || portion <= 0) {
      alert('Las porciones deben ser un número mayor a 0');
      return;
    }

    if (ingredients.length === 0) {
      alert('Debes agregar al menos un ingrediente');
      return;
    }

    for (const ingredient of ingredients) {
      const amount = Number(ingredient.amount);

      if (!ingredient.amount || isNaN(amount) || amount <= 0) {
        alert(
          `La cantidad del ingrediente "${ingredient.name}" debe ser mayor a 0`
        );
        return;
      }
      if (!ingredient.preferred_product_id) {
        alert(
          `Debes seleccionar un producto preferido para "${ingredient.name}"`
        );
        return;
      }
    }

    onSubmit({
      name,
      description,
      total_time_minutes,
      servings,
      is_public: isPublic,
      ingredients,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-[#161614]" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-2 pb-10"
      >
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-2"
          >
            <Ionicons name="arrow-back-outline" size={22} color="#2D2B27" />
            <Text className="text-[15px] font-semibold text-ink">
              Volver
            </Text>
          </Pressable>
        </View>

        <View className="mb-6">
            <Text className="font-display text-[28px] text-ink dark:text-[#F2F0EB]">
            {title}
            </Text>

            <Text className="text-[14px] text-pebble mt-0.5">
            {subtitle}
            </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">
              Nombre
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre de la receta"
              className="rounded-xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 text-ink dark:text-[#F2F0EB]"
            />
          </View>

          <View>
            <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">
              Descripción
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe la receta"
              multiline
              numberOfLines={4}
              className="rounded-xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 text-ink dark:text-[#F2F0EB]"
            />
          </View>

          <View>
            <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">
              Tiempo (minutos)
            </Text>
            <TextInput
              value={total_time_minutes}
              onChangeText={setTime}
              keyboardType="numeric"
              placeholder="45"
              className="rounded-xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 text-ink dark:text-[#F2F0EB]"
            />
          </View>

          <View>
            <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">
              Porciones
            </Text>
            <TextInput
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
              placeholder="4"
              className="rounded-xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 text-ink dark:text-[#F2F0EB]"
            />
          </View>

        <View>
        <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">
            Visibilidad
        </Text>

        <View className="flex-row gap-2">
            <Pressable
            onPress={() => setIsPublic(true)}
            className={`flex-1 rounded-2xl py-4 items-center ${
                isPublic
                ? 'bg-forest'
                : 'bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C]'
            }`}
            >
            <Text
                className={`font-semibold ${
                isPublic
                    ? 'text-cream'
                    : 'text-ink dark:text-[#F2F0EB]'
                }`}
            >
                Pública
            </Text>
            </Pressable>

            <Pressable
            onPress={() => setIsPublic(false)}
            className={`flex-1 rounded-2xl py-4 items-center ${
                !isPublic
                ? 'bg-forest'
                : 'bg-white dark:bg-[#1E1E1C] border border-stone dark:border-[#2E2E2C]'
            }`}
            >
            <Text
                className={`font-semibold ${
                !isPublic
                    ? 'text-cream'
                    : 'text-ink dark:text-[#F2F0EB]'
                }`}
            >
                Privada
            </Text>
            </Pressable>
        </View>
        </View>

        <View>
        <Text className="text-[11px] font-medium uppercase tracking-wide text-pebble mb-1.5">
            Ingredientes
        </Text>

        {ingredients.map((ingredient) => (
        <View
            key={ingredient.type_id}
            className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 mb-2"
        >
            <View className="flex-row justify-between items-center mb-3">
            <Text className="font-semibold text-ink dark:text-[#F2F0EB]">
                {ingredient.name}
            </Text>

            <Pressable
                onPress={() =>
                setIngredients((prev) =>
                    prev.filter((i) => i.type_id !== ingredient.type_id)
                )
                }
            >
                <Ionicons
                name="trash-outline"
                size={18}
                color="#DC2626"
                />
            </Pressable>
            </View>

            <View className="flex-row items-center">
            <TextInput
                value={String(ingredient.amount)}
                onChangeText={(value) => {
                setIngredients((prev) =>
                    prev.map((i) =>
                    i.type_id === ingredient.type_id
                        ? { ...i, amount: value }
                        : i
                    )
                );
                }}
                keyboardType="numeric"
                placeholder="Cantidad"
                className="flex-1 rounded-xl border border-stone dark:border-[#2E2E2C] px-3 py-2 text-ink dark:text-[#F2F0EB]"
            />

            <Text className="ml-3 font-medium text-pebble">
                {ingredient.measurement_unit}
            </Text>
            </View>

            <Pressable
            onPress={() => {
                setSelectedIngredientTypeId(ingredient.type_id);
                setShowPreferenceSearch(true);
            }}
            className="mt-3 rounded-xl border border-stone dark:border-[#2E2E2C] px-3 py-2"
            >
            <Text className="text-center text-forest font-semibold">
                {ingredient.preferred_product_name ??
                'Seleccionar preferencia'}
            </Text>
            </Pressable>
            {showPreferenceSearch &&
            selectedIngredientTypeId === ingredient.type_id && (
                <View className="mt-3">
                <TextInput
                    value={preferenceSearch}
                    onChangeText={setPreferenceSearch}
                    placeholder="Buscar producto..."
                    className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 mb-2 text-ink dark:text-[#F2F0EB]"
                />

                <ScrollView
                    style={{ maxHeight: 250 }}
                    className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C]"
                >
                    {filteredProducts.slice(0, 30).map((product) => (
                    <Pressable
                        key={product.sku}
                        onPress={() => {
                        setIngredients((prev) =>
                            prev.map((i) =>
                            i.type_id === ingredient.type_id
                                ? {
                                    ...i,
                                    preferred_product_id: product.sku,
                                    preferred_product_name: product.name,
                                }
                                : i
                            )
                        );

                        setPreferenceSearch('');
                        setShowPreferenceSearch(false);
                        setSelectedIngredientTypeId(null);
                        }}
                        className="px-4 py-3 border-b border-stone dark:border-[#2E2E2C]"
                    >
                        <Text className="text-ink dark:text-[#F2F0EB]">
                        {product.name}
                        </Text>
                    </Pressable>
                    ))}
                </ScrollView>
                </View>
            )}
        </View>
        ))}

            <Pressable
                onPress={() => setShowSearch(true)}
                className="rounded-2xl border border-dashed border-stone dark:border-[#2E2E2C] py-4 items-center"
            >
                <Text className="font-semibold text-forest">
                + Agregar ingrediente
                </Text>
            </Pressable>

            {showSearch && (
                <View className="mt-3">
                <TextInput
                    value={ingredientSearch}
                    onChangeText={setIngredientSearch}
                    placeholder="Buscar ingrediente..."
                    className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C] px-4 py-3 mb-2 text-ink dark:text-[#F2F0EB]"
                />

                <ScrollView
                    style={{ maxHeight: 250 }}
                    className="rounded-2xl border border-stone dark:border-[#2E2E2C] bg-white dark:bg-[#1E1E1C]"
                >
                    {filteredTypes.slice(0, 30).map((type) => (
                    <Pressable
                        key={type.id}
                        onPress={() => {
                        const exists = ingredients.some(
                            (i) => i.type_id === type.id
                        );

                        if (!exists) {
                            setIngredients((prev) => [
                            ...prev,
                            {
                                type_id: type.id,
                                name: type.name,
                                measurement_unit: type.measurement_unit,
                                amount: "",
                            },
                            ]);
                        }

                        setIngredientSearch('');
                        setShowSearch(false);
                        }}
                        className="px-4 py-3 border-b border-stone dark:border-[#2E2E2C]"
                    >
                        <Text className="text-ink dark:text-[#F2F0EB]">
                        {type.name}
                        </Text>
                    </Pressable>
                    ))}
                </ScrollView>
                </View>
            )}
            </View>

            <Pressable
            disabled={isLoading}
            onPress={handleSubmit}
            className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-forest py-3 active:opacity-80 active:scale-[0.98]"
            >
            <Ionicons name="save-outline" size={18} color="#F8F7F4" />

            <Text className="text-[15px] font-semibold text-cream">
                {isLoading ? 'Guardando...' : submitLabel}
            </Text>
            </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}