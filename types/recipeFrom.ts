export type RecipeFormData = {
  name: string;
  description: string;
  total_time_minutes: string;
  servings: string;
  is_public: boolean;
  ingredients: {
    type_id: string;
    amount: string;
    preferred_product_sku: string;
  }[];
};