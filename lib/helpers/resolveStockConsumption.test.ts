import { findStockShortages, resolveStockConsumption } from './resolveStockConsumption';
import type { RecipeIngredient } from '@/types/recipe';

function ingredient(overrides: Partial<RecipeIngredient> = {}): RecipeIngredient {
  return { type_id: 'type-1', amount: 2, preferred_product_sku: 'SKU-A', ...overrides };
}

describe('resolveStockConsumption', () => {
  it('consumes the preferred product when it has enough stock', () => {
    const updates = resolveStockConsumption(
      [ingredient({ amount: 2 })],
      1,
      [{ product_sku: 'SKU-A', stock: 10 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(updates).toEqual([{ sku: 'SKU-A', stock: 8 }]);
  });

  it('scales the amount needed by the factor (e.g. doubled portions)', () => {
    const updates = resolveStockConsumption(
      [ingredient({ amount: 2 })],
      2,
      [{ product_sku: 'SKU-A', stock: 10 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(updates).toEqual([{ sku: 'SKU-A', stock: 6 }]);
  });

  it('falls back to another product of the same type when the preferred one lacks stock', () => {
    const updates = resolveStockConsumption(
      [ingredient({ amount: 5 })],
      1,
      [
        { product_sku: 'SKU-A', stock: 1 },
        { product_sku: 'SKU-B', stock: 10 },
      ],
      new Map([
        ['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }],
        ['SKU-B', { product_type_name: 'arroz', unit_multiplier_un: 1 }],
      ]),
    );

    expect(updates).toEqual([
      { sku: 'SKU-A', stock: 0 },
      { sku: 'SKU-B', stock: 6 },
    ]);
  });

  it('ignores products of a different type than the one requested', () => {
    const updates = resolveStockConsumption(
      [ingredient({ amount: 5, preferred_product_sku: 'SKU-A' })],
      1,
      [
        { product_sku: 'SKU-A', stock: 1 },
        { product_sku: 'SKU-C', stock: 10 },
      ],
      new Map([
        ['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }],
        ['SKU-C', { product_type_name: 'fideos', unit_multiplier_un: 1 }],
      ]),
    );

    expect(updates).toEqual([{ sku: 'SKU-A', stock: 0 }]);
  });

  it('converts to base units using unit_multiplier_un before consuming', () => {
    // 1 unit of SKU-A = 1000 base units (e.g. 1 bag = 1kg), need 1500 base units
    const updates = resolveStockConsumption(
      [ingredient({ amount: 1500 })],
      1,
      [{ product_sku: 'SKU-A', stock: 3 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1000 }]]),
    );

    // ceil(1500/1000) = 2 units removed
    expect(updates).toEqual([{ sku: 'SKU-A', stock: 1 }]);
  });

  it('never drops stock below 0 even if not enough is available', () => {
    const updates = resolveStockConsumption(
      [ingredient({ amount: 100 })],
      1,
      [{ product_sku: 'SKU-A', stock: 2 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(updates).toEqual([{ sku: 'SKU-A', stock: 0 }]);
  });

  it('accumulates consumption across multiple ingredients sharing a product', () => {
    const updates = resolveStockConsumption(
      [ingredient({ amount: 2 }), ingredient({ amount: 3 })],
      1,
      [{ product_sku: 'SKU-A', stock: 10 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(updates).toEqual([{ sku: 'SKU-A', stock: 5 }]);
  });

  it('returns no updates when there is no stock available', () => {
    const updates = resolveStockConsumption(
      [ingredient({ amount: 2 })],
      1,
      [{ product_sku: 'SKU-A', stock: 0 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(updates).toEqual([]);
  });
});

describe('findStockShortages', () => {
  it('reports no shortage when stock fully covers the ingredient', () => {
    const shortages = findStockShortages(
      [ingredient({ amount: 2 })],
      1,
      [{ product_sku: 'SKU-A', stock: 10 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(shortages).toEqual([]);
  });

  it('reports the missing amount when stock is insufficient', () => {
    const shortages = findStockShortages(
      [ingredient({ amount: 5, type_id: 'type-1' })],
      1,
      [{ product_sku: 'SKU-A', stock: 2 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(shortages).toEqual([{ type_id: 'type-1', missingBase: 3 }]);
  });

  it('sums stock across fallback products of the same type before reporting a shortage', () => {
    const shortages = findStockShortages(
      [ingredient({ amount: 5 })],
      1,
      [
        { product_sku: 'SKU-A', stock: 1 },
        { product_sku: 'SKU-B', stock: 10 },
      ],
      new Map([
        ['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }],
        ['SKU-B', { product_type_name: 'arroz', unit_multiplier_un: 1 }],
      ]),
    );

    expect(shortages).toEqual([]);
  });

  it('reports an empty pantry as a full shortage', () => {
    const shortages = findStockShortages(
      [ingredient({ amount: 2, type_id: 'type-1' })],
      1,
      [{ product_sku: 'SKU-A', stock: 0 }],
      new Map([['SKU-A', { product_type_name: 'arroz', unit_multiplier_un: 1 }]]),
    );

    expect(shortages).toEqual([{ type_id: 'type-1', missingBase: 2 }]);
  });
});
