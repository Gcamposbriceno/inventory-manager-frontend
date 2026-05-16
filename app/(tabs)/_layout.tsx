import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { type ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

const COLORS = {
  light: { bar: '#FFFFFF', border: '#E2E8F0', active: '#1D4ED8', inactive: '#64748B' },
  dark:  { bar: '#111827', border: '#1F2937', active: '#60A5FA', inactive: '#9CA3AF' },
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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.bar,
          borderTopColor: c.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: c.active,
        tabBarInactiveTintColor: c.inactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Inicio',   tabBarIcon: ({ focused }) => <TabIcon name="home"           focused={focused} /> }} />
      <Tabs.Screen name="despensa" options={{ title: 'Despensa', tabBarIcon: ({ focused }) => <TabIcon name="file-tray-full" focused={focused} /> }} />
      <Tabs.Screen name="lista"    options={{ title: 'Lista',    tabBarIcon: ({ focused }) => <TabIcon name="cart"           focused={focused} /> }} />
      <Tabs.Screen name="historial"options={{ title: 'Historial',tabBarIcon: ({ focused }) => <TabIcon name="time"           focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes',  tabBarIcon: ({ focused }) => <TabIcon name="settings"      focused={focused} /> }} />
    </Tabs>
  );
}
