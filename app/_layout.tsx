import { PantryProvider, usePantry } from '@/context/PantryContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DMSerifDisplay_400Regular, useFonts } from '@expo-google-fonts/dm-serif-display';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const { isHydrated, hasPantry } = usePantry();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (!isHydrated) return;

    const current = segments[0] ?? '';
    const inTabs = current === '(tabs)';
    const inPantryFlow =
      current === 'pantry-setup' || current === 'pantry-join';

    if (!hasPantry && inTabs) {
      router.replace('/pantry-setup');
      return;
    }

    if (hasPantry && inPantryFlow) {
      router.replace('/(tabs)');
    }
  }, [hasPantry, isHydrated, router, segments]);

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
        <PantryProvider>
          <ThemeProvider>
            <Layout />
          </ThemeProvider>
        </PantryProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
