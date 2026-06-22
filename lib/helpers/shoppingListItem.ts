import type { PantryTypeOverview } from '@/types/pantry';

export type ItemStatus = 'empty' | 'low' | 'partial';

export function getItemStatus(t: PantryTypeOverview): ItemStatus | null {
  if (t.current_stock >= t.desired_stock) return null;
  if (t.current_stock === 0) return 'empty';
  if (t.current_stock < t.rop) return 'low';
  return 'partial';
}

export function getNeededQuantity(t: PantryTypeOverview): number {
  return +(t.desired_stock - t.current_stock).toFixed(2);
}
