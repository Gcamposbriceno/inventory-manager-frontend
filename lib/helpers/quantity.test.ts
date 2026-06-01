import { parseValidQty } from './quantity';

describe('parseValidQty', () => {
  it('returns the parsed number for a valid string', () => {
    expect(parseValidQty('5')).toBe(5);
  });

  it('clamps to min (1) when value is 0', () => {
    expect(parseValidQty('0')).toBe(1);
  });

  it('clamps to max (99) when value exceeds it', () => {
    expect(parseValidQty('100')).toBe(99);
  });

  it('returns min when string is non-numeric', () => {
    expect(parseValidQty('abc')).toBe(1);
  });

  it('returns min when string is empty', () => {
    expect(parseValidQty('')).toBe(1);
  });

  it('handles the exact min boundary', () => {
    expect(parseValidQty('1')).toBe(1);
  });

  it('handles the exact max boundary', () => {
    expect(parseValidQty('99')).toBe(99);
  });

  it('respects custom min/max options', () => {
    expect(parseValidQty('0', { min: 0, max: 10 })).toBe(0);
    expect(parseValidQty('15', { min: 1, max: 10 })).toBe(10);
  });
});
