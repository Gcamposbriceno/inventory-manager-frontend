import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

const API_URL = "https://inventory-manager-backend-zd9h.onrender.com/";

export default function Index() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isKeysRevealed, setIsKeysRevealed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadApiData() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();

        if (isMounted) {
          setData(json);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Unknown error",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadApiData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRevealKeys = () => {
    Alert.alert(
      "⚠️ Información Sensible",
      "Las API keys incluyen información sensible que podría comprometer la seguridad de toda la aplicación. ¿Estás seguro que quieres continuar?",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Continuar",
          onPress: () => setIsKeysRevealed(true),
          style: "destructive",
        },
      ],
    );
  };

  const content = loading
    ? "Conectando al backend..."
    : error
      ? `Error: ${error}`
      : JSON.stringify(data, null, 2);

  return (
    <View className="flex-1 bg-slate-900 p-6 justify-center">
      <Text className="text-slate-50 text-3xl font-bold mb-2">
        Conexión con backend
      </Text>
      <ScrollView
        className="rounded-2xl bg-gray-900 border border-slate-700 max-h-[70%] mb-4"
        contentContainerClassName="p-4"
      >
        <Text className="text-slate-200 font-mono text-sm leading-5">
          {content}
        </Text>
      </ScrollView>
      <Pressable
        className="bg-red-600 py-3.5 px-5 rounded-xl mb-4 items-center justify-center"
        onPress={handleRevealKeys}
      >
        <Text className="text-white text-base font-bold tracking-wide">
          🔓 Revelar API keys
        </Text>
      </Pressable>
      {isKeysRevealed && (
        <Text className="text-amber-400 text-lg font-bold mb-3 text-center">
          Broma
        </Text>
      )}
    </View>
  );
}
