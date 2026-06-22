import type { ProductType } from '@/types/productType';
import type { RecipeIngredient } from '@/types/recipe';

export interface ResolvedIngredient {
  name: string;
  amount: number;
  unit: string | null;
}

/**
 * Scales a recipe's ingredients by the ratio between planned portions and
 * the recipe's base servings, resolving each ingredient's display name and
 * unit from its product type.
 */
export function resolveMealIngredients(
  ingredients: RecipeIngredient[],
  factor: number,
  productTypeMap: Record<string, ProductType>,
): ResolvedIngredient[] {
  return ingredients.map((ingredient) => {
    const type = productTypeMap[ingredient.type_id];

    return {
      name: type?.name ?? 'Desconocido',
      amount: ingredient.amount * factor,
      unit: type?.measurement_unit ?? null,
    };
  });
}
