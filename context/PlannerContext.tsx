import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type DayKey = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export type PlannedMeal = {
  uid: string;
  recipeId: string;
  name: string;
  totalTimeMinutes: number;
  servings: number;
  porciones: number;
};

export type WeekPlan = Record<DayKey, PlannedMeal[]>;

export const DAYS: { key: DayKey; label: string; full: string }[] = [
  { key: 'lun', label: 'Lun', full: 'Lunes' },
  { key: 'mar', label: 'Mar', full: 'Martes' },
  { key: 'mie', label: 'Mié', full: 'Miércoles' },
  { key: 'jue', label: 'Jue', full: 'Jueves' },
  { key: 'vie', label: 'Vie', full: 'Viernes' },
  { key: 'sab', label: 'Sáb', full: 'Sábado' },
  { key: 'dom', label: 'Dom', full: 'Domingo' },
];

const EMPTY_PLAN: WeekPlan = { lun: [], mar: [], mie: [], jue: [], vie: [], sab: [], dom: [] };
const STORAGE_KEY = '@week_plan';
const JS_DAY_TO_KEY: DayKey[] = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

export function todayKey(): DayKey {
  return JS_DAY_TO_KEY[new Date().getDay()];
}

type RecipeLike = { id: string; name: string; total_time_minutes: number; servings: number };

interface PlannerCtx {
  weekPlan: WeekPlan;
  addRecipeToDay: (day: DayKey, recipe: RecipeLike) => void;
  updatePorciones: (day: DayKey, uid: string, delta: number) => void;
  removeFromDay: (day: DayKey, uid: string) => void;
}

const Context = createContext<PlannerCtx | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(EMPTY_PLAN);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        try {
          setWeekPlan({ ...EMPTY_PLAN, ...JSON.parse(raw) });
        } catch {
          // ignore corrupted data
        }
      })
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(weekPlan));
  }, [weekPlan, isHydrated]);

  const addRecipeToDay = useCallback((day: DayKey, recipe: RecipeLike) => {
    const meal: PlannedMeal = {
      uid: `${recipe.id}-${Date.now()}`,
      recipeId: recipe.id,
      name: recipe.name,
      totalTimeMinutes: recipe.total_time_minutes,
      servings: recipe.servings,
      porciones: recipe.servings,
    };
    setWeekPlan((prev) => ({ ...prev, [day]: [...prev[day], meal] }));
  }, []);

  const updatePorciones = useCallback((day: DayKey, uid: string, delta: number) => {
    setWeekPlan((prev) => ({
      ...prev,
      [day]: prev[day].map((m) => (m.uid === uid ? { ...m, porciones: Math.max(1, m.porciones + delta) } : m)),
    }));
  }, []);

  const removeFromDay = useCallback((day: DayKey, uid: string) => {
    setWeekPlan((prev) => ({ ...prev, [day]: prev[day].filter((m) => m.uid !== uid) }));
  }, []);

  const value = useMemo(
    () => ({ weekPlan, addRecipeToDay, updatePorciones, removeFromDay }),
    [weekPlan, addRecipeToDay, updatePorciones, removeFromDay],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePlanner() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('usePlanner requires PlannerProvider');
  return ctx;
}
