import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { type ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

type IconName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const colors = useThemeColors();
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IconName)}
      size={22}
      color={focused ? colors.primary : colors.muted}
    />
  );
}

export default function TabLayout() {
  const colors = useThemeColors();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#161614' : colors.cream,
          borderTopColor: isDark ? '#2E2E2C' : colors.stone,
          borderTopWidth: 1,
          height: 64 + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Inicio',   tabBarIcon: ({ focused }) => <TabIcon name="home"           focused={focused} /> }} />
      <Tabs.Screen name="despensa" options={{ title: 'Despensa', tabBarIcon: ({ focused }) => <TabIcon name="file-tray-full" focused={focused} /> }} />
      <Tabs.Screen name="recetas" options={{ title: 'Recetas', tabBarIcon: ({ focused }) => <TabIcon name="book" focused={focused} /> }} />
      <Tabs.Screen name="lista"    options={{ title: 'Lista',    tabBarIcon: ({ focused }) => <TabIcon name="cart"           focused={focused} /> }} />
      <Tabs.Screen name="historial"options={{ title: 'Historial',tabBarIcon: ({ focused }) => <TabIcon name="time"           focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes',  tabBarIcon: ({ focused }) => <TabIcon name="settings"      focused={focused} /> }} />
    </Tabs>
  );
}
