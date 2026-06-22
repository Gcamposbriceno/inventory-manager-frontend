import { QUICK_FILL_PRODUCTS } from './quickFillProducts';

const KNOWN_CATEGORIES = new Set([
  'Abarrotes',
  'Verduras',
  'Lácteos/Frescos',
  'Panadería',
  'Carnes/Freezer',
  'Especias',
  'Salsas',
  'Bebidas',
]);

describe('QUICK_FILL_PRODUCTS', () => {
  it('has expected number of products', () => {
    expect(QUICK_FILL_PRODUCTS).toHaveLength(30);
  });

  it('has unique product ids', () => {
    const ids = QUICK_FILL_PRODUCTS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all products are valid entries', () => {
    QUICK_FILL_PRODUCTS.forEach(p => {
      expect(p.name).toBeTruthy();
      expect(p.emoji).toBeTruthy();
      expect(p.unit).toBeTruthy();
    });
  });

  it('all categories are valid', () => {
    QUICK_FILL_PRODUCTS.forEach(p => {
      expect(KNOWN_CATEGORIES.has(p.category)).toBe(true);
    });
  });

  it('ids are sequential starting from 1', () => {
    const sorted = [...QUICK_FILL_PRODUCTS].sort((a, b) => a.id - b.id);
    sorted.forEach((p, i) => {
      expect(p.id).toBe(i + 1);
    });
  });
});