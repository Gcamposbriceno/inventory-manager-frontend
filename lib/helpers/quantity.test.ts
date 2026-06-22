import { formatQty, parseValidQty } from './quantity';

describe('parseValidQty', () => {
  it('parses valid numeric string', () => {
    expect(parseValidQty('5')).toBe(5);
  });

  it('clamps values below min to min', () => {
    expect(parseValidQty('0')).toBe(1);
  });

  it('clamps values above max to max', () => {
    expect(parseValidQty('100')).toBe(99);
  });

  it('returns min for invalid input', () => {
    expect(parseValidQty('abc')).toBe(1);
    expect(parseValidQty('')).toBe(1);
  });

  it('respects custom min and max options', () => {
    expect(parseValidQty('0', { min: 0, max: 10 })).toBe(0);
    expect(parseValidQty('15', { min: 1, max: 10 })).toBe(10);
  });
});

describe('formatQty', () => {
  it('strips floating-point noise', () => {
    expect(formatQty(1.4000000000000001)).toBe('1.4');
  });

  it('drops trailing zeros', () => {
    expect(formatQty(1)).toBe('1');
  });

  it('respects custom decimal precision', () => {
    expect(formatQty(1.23456, 3)).toBe('1.235');
  });
});