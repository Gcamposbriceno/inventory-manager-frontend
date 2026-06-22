import { getItemStatus, getNeededQuantity } from './shoppingListItem';
import type { PantryTypeOverview } from '@/types/pantry';

function makeType(overrides: Partial<PantryTypeOverview> = {}): PantryTypeOverview {
  return {
    type_id: '1',
    type_name: 'Arroz',
    measurement_unit: 'kg',
    rop: 2,
    desired_stock: 5,
    current_stock: 3,
    favorite_product_sku: null,
    ...overrides,
  };
}

describe('getItemStatus', () => {
  it('returns null when stock already meets desired_stock', () => {
    expect(getItemStatus(makeType({ current_stock: 5, desired_stock: 5 }))).toBeNull();
  });

  it('returns null when stock exceeds desired_stock', () => {
    expect(getItemStatus(makeType({ current_stock: 6, desired_stock: 5 }))).toBeNull();
  });

  it('returns "empty" when there is no stock at all', () => {
    expect(getItemStatus(makeType({ current_stock: 0 }))).toBe('empty');
  });

  it('returns "low" when stock is below the reorder point', () => {
    expect(getItemStatus(makeType({ current_stock: 1, rop: 2, desired_stock: 5 }))).toBe('low');
  });

  it('returns "partial" when stock is at or above rop but below desired_stock', () => {
    expect(getItemStatus(makeType({ current_stock: 3, rop: 2, desired_stock: 5 }))).toBe('partial');
  });

  it('treats stock exactly at rop as "partial", not "low"', () => {
    expect(getItemStatus(makeType({ current_stock: 2, rop: 2, desired_stock: 5 }))).toBe('partial');
  });
});

describe('getNeededQuantity', () => {
  it('returns the gap between desired_stock and current_stock', () => {
    expect(getNeededQuantity(makeType({ current_stock: 3, desired_stock: 5 }))).toBe(2);
  });

  it('rounds to 2 decimal places', () => {
    expect(getNeededQuantity(makeType({ current_stock: 1.111, desired_stock: 2 }))).toBe(0.89);
  });

  it('returns a negative value when stock exceeds desired_stock', () => {
    expect(getNeededQuantity(makeType({ current_stock: 6, desired_stock: 5 }))).toBe(-1);
  });
});
