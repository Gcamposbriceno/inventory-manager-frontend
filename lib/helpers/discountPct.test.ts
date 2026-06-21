import { discountPct } from './discountPct';

describe('discountPct', () => {
  it('calculates correct discount percentage with rounding', () => {
    expect(discountPct(1290, 990)).toBe(23);
  });

  it('returns 0 when there is no discount', () => {
    expect(discountPct(500, 500)).toBe(0);
  });

  it('returns 100 when price is fully discounted', () => {
    expect(discountPct(1000, 0)).toBe(100);
  });
});