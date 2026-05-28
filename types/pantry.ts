export interface QuickFillProduct {
  id: number;
  name: string;
  emoji: string;
  unit: string;
  category: string;
}

export interface PantryItem {
  productId: number;
  name: string;
  emoji: string;
  unit: string;
  category: string;
  quantity: number | null;
}
