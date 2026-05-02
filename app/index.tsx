import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const API_URL = "https://inventory-manager-backend-zd9h.onrender.com/";

export default function Index() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
