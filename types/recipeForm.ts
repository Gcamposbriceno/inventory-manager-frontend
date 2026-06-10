export type RecipeFormData = {
  name: string;
  description: string;
  total_time_minutes: string;
  servings: string;
  is_public: boolean;
  ingredients: {
    type_id: string;
    name: string;
    measurement_unit: string;
    amount: string;
    preferred_product_id?: string;
    preferred_product_name?: string;
  }[];
};
