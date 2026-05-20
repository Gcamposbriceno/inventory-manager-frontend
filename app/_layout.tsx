import { ThemeProvider } from '@/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function Layout() {
  const { colorScheme } = useColorScheme();
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ DMSerifDisplay_400Regular });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Layout />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
