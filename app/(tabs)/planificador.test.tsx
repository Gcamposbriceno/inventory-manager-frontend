import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { PlannerProvider, todayKey } from '@/context/PlannerContext';
import PlanificadorScreen from './planificador';

const mockMutateAsync = jest.fn().mockResolvedValue(undefined);

jest.mock('@/lib/api/pantries', () => ({
  usePantries: () => ({ data: [{ id: 'pantry-1', name: 'Despensa Casa' }] }),
  usePantryProducts: () => ({ data: [{ product_sku: 'SKU-A', stock: 5 }] }),
  useUpdatePantryStock: () => ({ mutateAsync: mockMutateAsync }),
}));

jest.mock('@/lib/api/products', () => ({
  useProducts: () => ({
    data: [{ sku: 'SKU-A', product_type_name: 'arroz', unit_multiplier_un: 1 }],
    isLoading: false,
  }),
}));

jest.mock('@/lib/api/productTypes', () => ({
  useProductTypes: () => ({
    data: [{ id: 'type-1', name: 'Arroz', measurement_unit: 'kg' }],
  }),
}));

jest.mock('@/lib/api/recipes', () => ({
  usePublicRecipes: () => ({ data: [] }),
  useRecipesMe: () => ({ data: [] }),
}));

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PlannerProvider>{children}</PlannerProvider>
);

beforeEach(async () => {
  mockMutateAsync.mockClear();
  await AsyncStorage.setItem(
    '@week_plan',
    JSON.stringify({
      [todayKey()]: [
        {
          uid: 'meal-1',
          recipeId: 'recipe-1',
          name: 'Pasta',
          totalTimeMinutes: 30,
          servings: 4,
          porciones: 4,
          ingredientes: [{ type_id: 'type-1', amount: 2, preferred_product_sku: 'SKU-A' }],
        },
      ],
    }),
  );
});

describe('PlanificadorScreen - marcar receta como cocinada', () => {
  it('shows the scaled ingredients to consume once a pantry is picked, and disables confirm without one', async () => {
    render(<PlanificadorScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText('Pasta')).toBeTruthy());

    fireEvent.press(screen.getByText('Marcar como cocinada'));

    expect(screen.getByText('• 2.00 kg Arroz')).toBeTruthy();

    fireEvent.press(screen.getByText('Confirmar'));
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('consumes stock from the selected pantry on confirm', async () => {
    render(<PlanificadorScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText('Pasta')).toBeTruthy());

    fireEvent.press(screen.getByText('Marcar como cocinada'));
    fireEvent.press(screen.getByText('Despensa Casa'));
    fireEvent.press(screen.getByText('Confirmar'));

    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith({
        pantryId: 'pantry-1',
        sku: 'SKU-A',
        stock: 3,
      }),
    );
  });
});
