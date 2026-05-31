import { PantryProvider, usePantry } from '@/context/PantryContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const { isHydrated, hasPantry } = usePantry();
  const { colorScheme } = useColorScheme();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isHydrated) return;

    const current = segments[0] ?? '';
    const inTabs = current === '(tabs)';
    const inPantryFlow =
      current === 'pantry-setup' || current === 'pantry-join';

    if (isSignedIn && current === '') {
      router.replace(hasPantry ? '/(tabs)' : '/pantry-setup');
      return;
    }

    if (!isSignedIn && inTabs) {
      router.replace('/');
      return;
    }

    if (!hasPantry && inTabs) {
      router.replace('/pantry-setup');
      return;
    }

    if (hasPantry && inPantryFlow) {
      router.replace('/(tabs)');
    }
  }, [hasPantry, isHydrated, isLoaded, isSignedIn, router, segments]);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PantryProvider>
            <ThemeProvider>
              <Layout />
            </ThemeProvider>
          </PantryProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}