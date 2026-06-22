export interface PurchaseItem {
  pantryId: string;
  typeName: string;
  favoriteSku: string | null;
  needed: number;
}

export interface PantryProductStock {
  product_sku: string;
  stock: number;
}

export interface PurchaseUpdate {
  pantryId: string;
  sku: string;
  stock: number;
}

/**
 * Resolves checked shopping-list items into pantry stock updates. Credits
 * each type's `needed` quantity (in measurement units, e.g. liters) to its
 * favorite product when present in the pantry, otherwise falls back to any
 * product of that type already in the pantry (most types never get an
 * explicit favorite). `needed` is converted to whole product units via
 * `productUnitBySku` before being added to the integer `stock` count, since
 * stock tracks units (e.g. bottles), not measurement quantity. Items with no
 * matching product in the pantry are skipped — there is no sku to credit.
 */
export function resolveStockPurchase(
  items: PurchaseItem[],
  pantryProducts: Record<string, PantryProductStock[]>,
  productTypeNameBySku: Map<string, string>,
  productUnitBySku: Map<string, number>,
): PurchaseUpdate[] {
  const neededBase = new Map<string, number>();
  const order: { pantryId: string; sku: string }[] = [];

  function resolveSku(item: PurchaseItem): string | null {
    const products = pantryProducts[item.pantryId] ?? [];
    if (item.favoriteSku && products.some((p) => p.product_sku === item.favoriteSku)) {
      return item.favoriteSku;
    }
    const match = products.find((p) => productTypeNameBySku.get(p.product_sku) === item.typeName);
    return match?.product_sku ?? null;
  }

  for (const item of items) {
    const sku = resolveSku(item);
    if (!sku) continue;

    const key = `${item.pantryId}:${sku}`;
    if (!neededBase.has(key)) order.push({ pantryId: item.pantryId, sku });
    neededBase.set(key, (neededBase.get(key) ?? 0) + item.needed);
  }

  return order.map(({ pantryId, sku }) => {
    const currentStock = pantryProducts[pantryId]?.find((p) => p.product_sku === sku)?.stock ?? 0;
    const unit = productUnitBySku.get(sku) || 1;
    const unitsToAdd = Math.ceil(neededBase.get(`${pantryId}:${sku}`)! / unit - 1e-9);
    return { pantryId, sku, stock: currentStock + unitsToAdd };
  });
}
