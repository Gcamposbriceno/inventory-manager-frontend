import { usePersistedState } from '@/hooks/usePersistedState';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

type PantryId = string | null;

interface PantryCtx {
  pantryId: PantryId;
  pantryIdCode: string | null;
  hasPantry: boolean;
  isHydrated: boolean;
  setActivePantry: (id: string, id_code: string) => Promise<void>;
  clearPantry: () => Promise<void>;
}

const Context = createContext<PantryCtx | null>(null);

export function PantryProvider({ children }: { children: ReactNode }) {
  const [pantryId, persistPantryId, isHydrated] = usePersistedState<PantryId>(
    '@pantry_membership_id',
    null,
  );
  const [pantryIdCode, persistPantryIdCode] = usePersistedState<string | null>(
    '@pantry_id_code',
    null,
  );

  const setActivePantry = useCallback(
    async (id: string, id_code: string) => {
      await persistPantryId(id);
      await persistPantryIdCode(id_code);
    },
    [persistPantryId, persistPantryIdCode],
  );

  const clearPantry = useCallback(async () => {
    await persistPantryId(null);
    await persistPantryIdCode(null);
  }, [persistPantryId, persistPantryIdCode]);

  const value = useMemo(
    () => ({ pantryId, pantryIdCode, hasPantry: !!pantryId, isHydrated, setActivePantry, clearPantry }),
    [isHydrated, pantryId, pantryIdCode, setActivePantry, clearPantry],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePantry() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('usePantry requires PantryProvider');
  return ctx;
}
