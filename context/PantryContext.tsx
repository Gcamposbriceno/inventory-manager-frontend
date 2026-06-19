import { createContext, useContext, useState } from 'react';

interface PantryContextType {
  activePantryId: string | null;
  setActivePantryId: (id: string | null) => void;
}

const PantryContext = createContext<PantryContextType | null>(null);

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const [activePantryId, setActivePantryId] = useState<string | null>(null);

  return (
    <PantryContext.Provider
      value={{
        activePantryId,
        setActivePantryId,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
}

export function usePantryContext() {
  const context = useContext(PantryContext);

  if (!context) {
    throw new Error('usePantryContext must be used inside PantryProvider');
  }

  return context;
}