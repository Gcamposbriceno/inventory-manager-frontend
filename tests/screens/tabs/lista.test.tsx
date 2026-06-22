import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import ListaScreen from '@/app/(tabs)/lista';
import type { Pantry, PantryTypeOverview } from '@/types/pantry';

const pantries: Pantry[] = [
  { id: 'p1', name: 'Casa' } as Pantry,
  { id: 'p2', name: 'Oficina' } as Pantry,
];

const overviewByPantry: Record<string, PantryTypeOverview[]> = {
  p1: [
    {
      type_id: 't1',
      type_name: 'Arroz',
      measurement_unit: 'kg',
      rop: 2,
      desired_stock: 5,
      current_stock: 0,
      favorite_product_sku: null,
    }, // empty -> urgent
    {
      type_id: 't2',
      type_name: 'Aceite',
      measurement_unit: 'l',
      rop: 1,
      desired_stock: 3,
      current_stock: 2,
      favorite_product_sku: null,
    }, // partial -> suggested
  ],
  p2: [
    {
      type_id: 't3',
      type_name: 'Pasta',
      measurement_unit: 'kg',
      rop: 2,
      desired_stock: 4,
      current_stock: 1,
      favorite_product_sku: null,
    }, // below rop -> urgent
  ],
};

jest.mock('@/lib/api/pantries', () => ({
  usePantries: () => ({ data: pantries, isLoading: false }),
  useAllPantriesOverview: (ps: Pantry[]) =>
    ps.map((p) => ({ data: overviewByPantry[p.id] ?? [], isLoading: false })),
  useAllPantriesProducts: (ps: Pantry[]) => ps.map(() => ({ data: [], isLoading: false })),
  useUpdatePantryStock: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('@/lib/api/products', () => ({
  useProducts: () => ({ data: [], isLoading: false }),
}));

describe('ListaScreen', () => {
  it('groups items into urgent and suggested sections across all pantries', () => {
    render(<ListaScreen />);

    expect(screen.getByText('Arroz')).toBeTruthy();
    expect(screen.getByText('Aceite')).toBeTruthy();
    expect(screen.getByText('Pasta')).toBeTruthy();
    expect(screen.getByText('3 de 3 pendientes')).toBeTruthy();
  });

  it('filters items by pantry when a pill is selected', () => {
    render(<ListaScreen />);

    fireEvent.press(screen.getAllByText('Oficina')[0]);

    expect(screen.getByText('Pasta')).toBeTruthy();
    expect(screen.queryByText('Arroz')).toBeNull();
    expect(screen.queryByText('Aceite')).toBeNull();
    expect(screen.getByText('1 de 1 pendientes')).toBeTruthy();
  });

  it('checking an item updates the pending counter and shows the clear action', () => {
    render(<ListaScreen />);

    fireEvent.press(screen.getByText('Arroz'));

    expect(screen.getByText('2 de 3 pendientes')).toBeTruthy();
    expect(screen.getByText('Registrar compra de 1 producto')).toBeTruthy();
  });
});
