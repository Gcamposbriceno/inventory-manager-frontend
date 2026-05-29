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
  it('has exactly 30 products', () => {
    expect(QUICK_FILL_PRODUCTS).toHaveLength(30);
  });

  it('all ids are unique', () => {
    const ids = QUICK_FILL_PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no product has an empty name', () => {
    QUICK_FILL_PRODUCTS.forEach((p) => {
      expect(p.name).toBeTruthy();
    });
  });

  it('no product has an empty emoji', () => {
    QUICK_FILL_PRODUCTS.forEach((p) => {
      expect(p.emoji).toBeTruthy();
    });
  });

  it('no product has an empty unit', () => {
    QUICK_FILL_PRODUCTS.forEach((p) => {
      expect(p.unit).toBeTruthy();
    });
  });

  it('all categories belong to the known set', () => {
    QUICK_FILL_PRODUCTS.forEach((p) => {
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
