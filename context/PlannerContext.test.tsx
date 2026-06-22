import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';
import { PlannerProvider, usePlanner } from './PlannerContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PlannerProvider>{children}</PlannerProvider>
);

const recipe = {
  id: 'recipe-1',
  name: 'Pasta',
  total_time_minutes: 30,
  servings: 4,
  ingredients: [],
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('PlannerContext', () => {
  it('initializes with an empty plan when no data is stored', async () => {
    const { result } = renderHook(() => usePlanner(), { wrapper });

    await waitFor(() =>
      expect(result.current.weekPlan).toEqual({
        lun: [],
        mar: [],
        mie: [],
        jue: [],
        vie: [],
        sab: [],
        dom: [],
      }),
    );
  });

  it('hydrates the plan from AsyncStorage', async () => {
    await AsyncStorage.setItem(
      '@week_plan',
      JSON.stringify({
        lun: [
          {
            uid: '1',
            recipeId: 'recipe-1',
            name: 'Pasta',
            totalTimeMinutes: 30,
            servings: 4,
            porciones: 4,
            ingredientes: [],
          },
        ],
      }),
    );

    const { result } = renderHook(() => usePlanner(), { wrapper });

    await waitFor(() =>
      expect(result.current.weekPlan.lun).toHaveLength(1),
    );
  });

  it('ignores corrupted AsyncStorage data during hydration', async () => {
    await AsyncStorage.setItem('@week_plan', 'not-json');

    const { result } = renderHook(() => usePlanner(), { wrapper });

    await waitFor(() =>
      expect(result.current.weekPlan).toEqual({
        lun: [],
        mar: [],
        mie: [],
        jue: [],
        vie: [],
        sab: [],
        dom: [],
      }),
    );
  });

  it('adds a recipe to a day', async () => {
    const { result } = renderHook(() => usePlanner(), { wrapper });

    act(() => {
      result.current.addRecipeToDay('lun', recipe);
    });

    expect(result.current.weekPlan.lun).toHaveLength(1);
    expect(result.current.weekPlan.lun[0]).toMatchObject({
      recipeId: recipe.id,
      name: recipe.name,
      servings: recipe.servings,
      porciones: recipe.servings,
    });
  });

  it('updates portions for an existing meal', async () => {
    const { result } = renderHook(() => usePlanner(), { wrapper });

    act(() => {
      result.current.addRecipeToDay('lun', recipe);
    });

    const uid = result.current.weekPlan.lun[0].uid;

    act(() => {
      result.current.updatePorciones('lun', uid, 2);
    });

    expect(result.current.weekPlan.lun[0].porciones).toBe(6);
  });

  it('never reduces portions below 1', async () => {
    const { result } = renderHook(() => usePlanner(), { wrapper });

    act(() => {
      result.current.addRecipeToDay('lun', recipe);
    });

    const uid = result.current.weekPlan.lun[0].uid;

    act(() => {
      result.current.updatePorciones('lun', uid, -999);
    });

    expect(result.current.weekPlan.lun[0].porciones).toBe(1);
  });

  it('removes a meal from a day', async () => {
    const { result } = renderHook(() => usePlanner(), { wrapper });

    act(() => {
      result.current.addRecipeToDay('lun', recipe);
    });

    const uid = result.current.weekPlan.lun[0].uid;

    act(() => {
      result.current.removeFromDay('lun', uid);
    });

    expect(result.current.weekPlan.lun).toHaveLength(0);
  });

  it('persists plan changes to AsyncStorage', async () => {
    const { result } = renderHook(() => usePlanner(), { wrapper });

    act(() => {
      result.current.addRecipeToDay('lun', recipe);
    });

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem('@week_plan');
      expect(stored).toContain('recipe-1');
    });
  });

  it('throws when usePlanner is used outside PlannerProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => usePlanner())).toThrow(
      'usePlanner requires PlannerProvider',
    );

    consoleError.mockRestore();
  });
});