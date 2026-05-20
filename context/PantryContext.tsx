import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type PantryId = string | null;

interface PantryCtx {
  pantryId: PantryId;
  hasPantry: boolean;
  isHydrated: boolean;
  joinPantry: (idOrCode: string) => Promise<void>;
  createPantry: () => Promise<void>;
  leavePantry: () => Promise<void>;
}

const Context = createContext<PantryCtx | null>(null);
const KEY = '@pantry_membership_id';

export function PantryProvider({ children }: { children: ReactNode }) {
  const [pantryId, setPantryId] = useState<PantryId>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((stored) => {
        setPantryId(stored || null);
      })
      .finally(() => {
        setIsHydrated(true);
      });
  }, []);

  const joinPantry = async (idOrCode: string) => {
    const normalized = idOrCode.trim();
    if (!normalized) return;
    setPantryId(normalized);
    await AsyncStorage.setItem(KEY, normalized);
  };

  const createPantry = async () => {
    const newId = `pantry_${Date.now()}`;
    setPantryId(newId);
    await AsyncStorage.setItem(KEY, newId);
  };

  const leavePantry = async () => {
    setPantryId(null);
    await AsyncStorage.removeItem(KEY);
  };

  const value = useMemo(
    () => ({
      pantryId,
      hasPantry: !!pantryId,
      isHydrated,
      joinPantry,
      createPantry,
      leavePantry,
    }),
    [isHydrated, pantryId]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePantry() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('usePantry requires PantryProvider');
  return ctx;
}
