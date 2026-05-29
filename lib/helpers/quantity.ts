export function parseValidQty(raw: string, { min = 1, max = 99 } = {}): number {
  const num = parseInt(raw, 10);
  return isNaN(num) || num < min ? min : Math.min(num, max);
}
