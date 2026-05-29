import { discountPct } from './discountPct';

describe('discountPct', () => {
  it('returns 20 for 1000 → 800', () => {
    expect(discountPct(1000, 800)).toBe(20);
  });

  it('returns 23 for 1290 → 990 (rounded)', () => {
    expect(discountPct(1290, 990)).toBe(23);
  });

  it('returns 0 when sale equals original', () => {
    expect(discountPct(500, 500)).toBe(0);
  });

  it('returns 100 when sale is 0', () => {
    expect(discountPct(1000, 0)).toBe(100);
  });

  it('returns NaN when original is 0 (contracts current behavior, no guards added)', () => {
    expect(discountPct(0, 0)).toBeNaN();
  });
});
