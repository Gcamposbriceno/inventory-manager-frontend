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
  is_admin: boolean;
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

export interface WeeklyStat {
  week_label: string;
  week_start: string;
  units: number;
  spend: number;
}

export interface ProductStat {
  product_sku: string;
  product_name: string;
  units: number;
  spend: number;
}

export interface PeriodStat {
  units: number;
  spend: number;
}

export interface MonthComparison {
  current: PeriodStat;
  previous: PeriodStat;
  units_change_pct: number | null;
  spend_change_pct: number | null;
}

export interface PantryHistory {
  money_spent_consumption_month: number;
  money_spent_total_month: number;
  weekly: WeeklyStat[];
  top_by_units: ProductStat[];
  top_by_spend: ProductStat[];
  month_comparison: MonthComparison;
}
