import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'nativewind';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeCtx {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => Promise<void>;
}

const Context = createContext<ThemeCtx | null>(null);
const KEY = '@app_theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') {
        setModeState(v);
        setColorScheme(v);
      }
    });
  }, [setColorScheme]);

  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    setColorScheme(m);
    await AsyncStorage.setItem(KEY, m);
  };

  return <Context.Provider value={{ mode, setMode }}>{children}</Context.Provider>;
}

export function useTheme() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useTheme requires ThemeProvider');
  return ctx;
}
