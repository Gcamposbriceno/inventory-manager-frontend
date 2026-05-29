import { usePersistedState } from '@/hooks/usePersistedState';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

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

export function PantryProvider({ children }: { children: ReactNode }) {
  const [pantryId, persistPantryId, isHydrated] = usePersistedState<PantryId>(
    '@pantry_membership_id',
    null,
  );

  const joinPantry = useCallback(
    async (idOrCode: string) => {
      const normalized = idOrCode.trim();
      if (!normalized) return;
      await persistPantryId(normalized);
    },
    [persistPantryId],
  );

  const createPantry = useCallback(async () => {
    await persistPantryId(`pantry_${Date.now()}`);
  }, [persistPantryId]);

  const leavePantry = useCallback(async () => {
    await persistPantryId(null);
  }, [persistPantryId]);

  const value = useMemo(
    () => ({ pantryId, hasPantry: !!pantryId, isHydrated, joinPantry, createPantry, leavePantry }),
    [isHydrated, pantryId, joinPantry, createPantry, leavePantry],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePantry() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('usePantry requires PantryProvider');
  return ctx;
}
