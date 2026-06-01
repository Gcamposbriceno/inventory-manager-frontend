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

// --- API response shapes ---

export interface Pantry {
  id: string;
  name: string;
  id_code: string;
}

export interface PantryMember {
  user_id: string;
  nickname: string;
  role: string;
}

export interface PantryProduct {
  product_sku: string;
  stock: number;
}

export interface PantryProductType {
  type_id: string;
  rop: number;
  desired_stock: number;
  favorite_product_sku: string | null;
}

export interface AddPantryProductTypeData {
  type_id: string;
  rop: number;
  desired_stock: number;
  favorite_product_sku?: string;
}

export interface UpdatePantryProductTypeData {
  rop?: number;
  desired_stock?: number;
  favorite_product_sku?: string | null;
}

export interface PantryTypeOverview {
  type_id: string;
  type_name: string;
  measurement_unit: string;
  rop: number;
  desired_stock: number;
  current_stock: number;
  favorite_product_sku: string | null;
}
