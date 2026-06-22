import type { RecipeIngredient } from '@/types/recipe';

export interface ConsumablePantryProduct {
  product_sku: string;
  stock: number;
}

export interface ProductInfo {
  product_type_name?: string;
  unit_multiplier_un?: number;
}

export interface StockUpdate {
  sku: string;
  stock: number;
}

/**
 * Determines which pantry products to deduct stock from, and by how much, to
 * cover a recipe's scaled ingredients. Prefers each ingredient's preferred
 * product, then falls back to other products of the same type, consuming the
 * one with the most available stock first. Returns one update per affected
 * product (last computed stock wins), in the order they should be applied.
 */
function getCandidates(
  ingredient: RecipeIngredient,
  pantryProducts: ConsumablePantryProduct[],
  productBySku: Map<string, ProductInfo>,
  getStock: (sku: string) => number,
) {
  const targetSku = ingredient.preferred_product_sku;
  const targetTypeId = targetSku ? productBySku.get(targetSku)?.product_type_name : undefined;

  return pantryProducts
    .map((p) => {
      const info = productBySku.get(p.product_sku);
      const unit = info?.unit_multiplier_un ?? 1;
      const stock = getStock(p.product_sku);

      return {
        sku: p.product_sku,
        unit,
        type: info?.product_type_name,
        stock,
        availableBase: stock * unit,
      };
    })
    .filter((p) => p.availableBase > 0 && (p.sku === targetSku || p.type === targetTypeId))
    .sort((a, b) =>
      a.sku === targetSku ? -1 : b.sku === targetSku ? 1 : b.availableBase - a.availableBase,
    );
}

export function resolveStockConsumption(
  ingredients: RecipeIngredient[],
  factor: number,
  pantryProducts: ConsumablePantryProduct[],
  productBySku: Map<string, ProductInfo>,
): StockUpdate[] {
  const stockOverrides = new Map<string, number>();
  const order: string[] = [];

  const getStock = (sku: string) =>
    stockOverrides.get(sku) ?? pantryProducts.find((p) => p.product_sku === sku)?.stock ?? 0;

  for (const ingredient of ingredients) {
    let remaining = ingredient.amount * factor;

    const candidates = getCandidates(ingredient, pantryProducts, productBySku, getStock);

    for (const product of candidates) {
      if (remaining <= 0) break;

      const consumeBase = Math.min(product.availableBase, remaining);
      const unitsToRemove = Math.ceil(consumeBase / product.unit);
      const newStock = Math.max(0, product.stock - unitsToRemove);

      if (!stockOverrides.has(product.sku)) order.push(product.sku);
      stockOverrides.set(product.sku, newStock);
      remaining -= consumeBase;
    }
  }

  return order.map((sku) => ({ sku, stock: Number(stockOverrides.get(sku)!.toFixed(3)) }));
}

export interface IngredientShortage {
  type_id: string;
  missingBase: number;
}

/**
 * Reports ingredients whose required amount (scaled by `factor`) exceeds
 * what's available in the pantry, so the UI can warn before consuming stock.
 */
export function findStockShortages(
  ingredients: RecipeIngredient[],
  factor: number,
  pantryProducts: ConsumablePantryProduct[],
  productBySku: Map<string, ProductInfo>,
): IngredientShortage[] {
  const getStock = (sku: string) =>
    pantryProducts.find((p) => p.product_sku === sku)?.stock ?? 0;

  const shortages: IngredientShortage[] = [];

  for (const ingredient of ingredients) {
    const needed = ingredient.amount * factor;
    const candidates = getCandidates(ingredient, pantryProducts, productBySku, getStock);
    const available = candidates.reduce((sum, p) => sum + p.availableBase, 0);

    if (available < needed) {
      shortages.push({ type_id: ingredient.type_id, missingBase: +(needed - available).toFixed(3) });
    }
  }

  return shortages;
}
