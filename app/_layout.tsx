import { PantryProvider } from '@/context/PantryContext';
import { PlannerProvider } from '@/context/PlannerContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useApiFetch } from '@/hooks/useApiFetch';
import { pantryKeys } from '@/lib/api/queryKeys';
import { Pantry } from '@/types/pantry';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { DMSerifDisplay_400Regular, useFonts } from '@expo-google-fonts/dm-serif-display';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  const apiFetch = useApiFetch();
  const { colorScheme } = useColorScheme();

  const {
    data: pantries,
    isLoading: isPantryLoading,
  } = useQuery<Pantry[]>({
    queryKey: pantryKeys.all(),
    queryFn: () => apiFetch('/pantries/'),
    enabled: isAuthLoaded && isSignedIn,
  });

  const hasPantry = (pantries?.length ?? 0) > 0;

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (isSignedIn && isPantryLoading) return;

    const current = segments[0];
    const inTabs = current === '(tabs)';
    const inPantryFlow =
      current === 'pantry-setup' || current === 'pantry-join';

    if (!isSignedIn) {
      if (inTabs || inPantryFlow) {
        router.replace('/');
      }
      return;
    }

    if (isSignedIn && !current) {
      router.replace(hasPantry ? '/(tabs)' : '/pantry-setup');
      return;
    }

    if (!hasPantry && inTabs) {
      router.replace('/pantry-setup');
      return;
    }

    if (hasPantry && inPantryFlow) {
      router.replace('/(tabs)');
    }
  }, [
    isAuthLoaded,
    isSignedIn,
    isPantryLoading,
    hasPantry,
    segments,
    router,
  ]);

  if (!isAuthLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900 px-6">
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? '#38bdf8' : '#0284c7'}
        />
      </View>
    );
  }

  if (isSignedIn && isPantryLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900 px-6">
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? '#38bdf8' : '#0284c7'}
        />

        <Text
          style={{ fontFamily: 'DMSerifDisplay_400Regular' }}
          className="text-2xl mt-4 text-center text-zinc-800 dark:text-zinc-100"
        >
          Preparando tu despensa...
        </Text>
      </View>
    );
  }

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
            <PlannerProvider>
              <ThemeProvider>
                <Layout />
              </ThemeProvider>
            </PlannerProvider>
          </PantryProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}