import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { type ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof Ionicons>['name'];

const COLORS = {
  light: { bar: '#F8F7F4', border: '#E8E6E1', active: '#1B4332', inactive: '#9E9B95' },
  dark:  { bar: '#161614', border: '#2E2E2C', active: '#52B788', inactive: '#9E9B95' },
};

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const { colorScheme } = useColorScheme();
  const c = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IconName)}
      size={22}
      color={focused ? c.active : c.inactive}
    />
  );
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const c = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.bar,
          borderTopColor: c.border,
          borderTopWidth: 1,
          height: 64 + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
        },
        tabBarActiveTintColor: c.active,
        tabBarInactiveTintColor: c.inactive,
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
