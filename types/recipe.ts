export interface RecipeIngredient {
  type_id: string;
  amount: number;
  preferred_product_sku: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  total_time_minutes: number;
  servings: number;
  is_public: boolean;
  user_id: string;
  ingredients: RecipeIngredient[];
}