import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => setIsKeysRevealed(true),
          style: "destructive",
        },
      ]
    );
  };

  const content = loading
    ? "Connecting to backend..."
    : error
      ? `Error fetching API: ${error}`
      : JSON.stringify(data, null, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend response</Text>
      <ScrollView style={styles.responseBox} contentContainerStyle={styles.responseContent}>
        <Text style={styles.responseText}>{content}</Text>
      </ScrollView>
      <Pressable style={styles.revealButton} onPress={handleRevealKeys}>
        <Text style={styles.revealButtonText}>🔓 Revelar API keys</Text>
      </Pressable>
      {isKeysRevealed && <Text style={styles.jokeText}>Broma</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 20,
  },
  revealButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  revealButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  jokeText: {
    color: "#fbbf24",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  responseBox: {
    borderRadius: 16,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#334155",
    maxHeight: "70%",
  },
  responseContent: {
    padding: 16,
  },
  responseText: {
    color: "#e2e8f0",
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
  },
});
