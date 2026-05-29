import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw !== null) setValue(raw as unknown as T);
      })
      .finally(() => setIsHydrated(true));
  }, [key]);

  const persist = useCallback(
    async (newValue: T | null) => {
      setValue(newValue as T);
      if (newValue === null || newValue === undefined) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, String(newValue));
      }
    },
    [key],
  );

  return [value, persist, isHydrated] as const;
}
