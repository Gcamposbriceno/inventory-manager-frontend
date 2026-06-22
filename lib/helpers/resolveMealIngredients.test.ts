import { resolveMealIngredients } from './resolveMealIngredients';
import type { ProductType } from '@/types/productType';
import type { RecipeIngredient } from '@/types/recipe';

const productTypeMap: Record<string, ProductType> = {
  'type-1': { id: 'type-1', name: 'Arroz', measurement_unit: 'kg' },
};

function ingredient(overrides: Partial<RecipeIngredient> = {}): RecipeIngredient {
  return { type_id: 'type-1', amount: 2, preferred_product_sku: 'SKU-A', ...overrides };
}

describe('resolveMealIngredients', () => {
  it('resolves name and unit from the product type', () => {
    const result = resolveMealIngredients([ingredient()], 1, productTypeMap);
    expect(result).toEqual([{ name: 'Arroz', amount: 2, unit: 'kg' }]);
  });

  it('scales the amount by the given factor', () => {
    const result = resolveMealIngredients([ingredient({ amount: 2 })], 2.5, productTypeMap);
    expect(result[0].amount).toBe(5);
  });

  it('falls back to "Desconocido" and null unit for an unknown type_id', () => {
    const result = resolveMealIngredients([ingredient({ type_id: 'missing' })], 1, productTypeMap);
    expect(result).toEqual([{ name: 'Desconocido', amount: 2, unit: null }]);
  });

  it('returns an empty array for no ingredients', () => {
    expect(resolveMealIngredients([], 1, productTypeMap)).toEqual([]);
  });
});
