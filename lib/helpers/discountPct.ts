export function discountPct(original: number, sale: number): number {
  return Math.round((1 - sale / original) * 100);
}
