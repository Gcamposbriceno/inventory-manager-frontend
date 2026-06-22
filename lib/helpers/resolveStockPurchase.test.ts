import { resolveStockPurchase } from './resolveStockPurchase';

const typeNames = new Map([['sku-1', 'Aceite']]);
const units = new Map([['sku-1', 1]]);

describe('resolveStockPurchase', () => {
  it('credits the needed quantity to the favorite product when it is in the pantry', () => {
    const updates = resolveStockPurchase(
      [{ pantryId: 'p1', typeName: 'Aceite', favoriteSku: 'sku-1', needed: 2 }],
      { p1: [{ product_sku: 'sku-1', stock: 1 }] },
      typeNames,
      units,
    );
    expect(updates).toEqual([{ pantryId: 'p1', sku: 'sku-1', stock: 3 }]);
  });

  it('falls back to any pantry product of the same type when there is no favorite', () => {
    const updates = resolveStockPurchase(
      [{ pantryId: 'p1', typeName: 'Aceite', favoriteSku: null, needed: 2 }],
      { p1: [{ product_sku: 'sku-1', stock: 1 }] },
      typeNames,
      units,
    );
    expect(updates).toEqual([{ pantryId: 'p1', sku: 'sku-1', stock: 3 }]);
  });

  it('falls back to a matching product when the favorite is not actually in the pantry', () => {
    const updates = resolveStockPurchase(
      [{ pantryId: 'p1', typeName: 'Aceite', favoriteSku: 'sku-missing', needed: 2 }],
      { p1: [{ product_sku: 'sku-1', stock: 1 }] },
      typeNames,
      units,
    );
    expect(updates).toEqual([{ pantryId: 'p1', sku: 'sku-1', stock: 3 }]);
  });

  it('skips items with no matching product in the pantry', () => {
    const updates = resolveStockPurchase(
      [{ pantryId: 'p1', typeName: 'Aceite', favoriteSku: null, needed: 2 }],
      { p1: [{ product_sku: 'sku-1', stock: 1 }] },
      new Map([['sku-1', 'Fideos']]),
      units,
    );
    expect(updates).toEqual([]);
  });

  it('converts measurement quantity to whole units using unit_multiplier_un', () => {
    // 1 unit of sku-1 = 0.33 l, need 0.5 l -> ceil(0.5/0.33) = 2 units
    const updates = resolveStockPurchase(
      [{ pantryId: 'p1', typeName: 'Aceite', favoriteSku: 'sku-1', needed: 0.5 }],
      { p1: [{ product_sku: 'sku-1', stock: 3 }] },
      typeNames,
      new Map([['sku-1', 0.33]]),
    );
    expect(updates).toEqual([{ pantryId: 'p1', sku: 'sku-1', stock: 5 }]);
  });

  it('accumulates multiple checked items in base units before converting to whole units', () => {
    const updates = resolveStockPurchase(
      [
        { pantryId: 'p1', typeName: 'Aceite', favoriteSku: 'sku-1', needed: 1 },
        { pantryId: 'p1', typeName: 'Aceite', favoriteSku: 'sku-1', needed: 1.5 },
      ],
      { p1: [{ product_sku: 'sku-1', stock: 0 }] },
      typeNames,
      units,
    );
    expect(updates).toEqual([{ pantryId: 'p1', sku: 'sku-1', stock: 3 }]);
  });

  it('keeps pantries independent', () => {
    const updates = resolveStockPurchase(
      [
        { pantryId: 'p1', typeName: 'Aceite', favoriteSku: 'sku-1', needed: 1 },
        { pantryId: 'p2', typeName: 'Aceite', favoriteSku: 'sku-1', needed: 1 },
      ],
      {
        p1: [{ product_sku: 'sku-1', stock: 0 }],
        p2: [{ product_sku: 'sku-1', stock: 5 }],
      },
      typeNames,
      units,
    );
    expect(updates).toEqual([
      { pantryId: 'p1', sku: 'sku-1', stock: 1 },
      { pantryId: 'p2', sku: 'sku-1', stock: 6 },
    ]);
  });
});
