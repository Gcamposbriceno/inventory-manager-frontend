export const productTypeKeys = {
  all:      () => ['productTypes'] as const,
  detail:   (id: string) => ['productTypes', id] as const,
  products: (name: string) => ['productTypes', name, 'products'] as const,
};

export const productKeys = {
  all:    () => ['products'] as const,
  detail: (sku: string) => ['products', sku] as const,
};

export const pantryKeys = {
  all:          () => ['pantries'] as const,
  detail:       (id: string) => ['pantries', id] as const,
  members:      (id: string) => ['pantries', id, 'members'] as const,
  products:     (id: string) => ['pantries', id, 'products'] as const,
  productTypes: (id: string) => ['pantries', id, 'productTypes'] as const,
  overview:     (id: string) => ['pantries', id, 'overview'] as const,
  // kept for backwards-compat
  items:        (id: string) => ['pantries', id, 'items'] as const,
};

export const recipeKeys = {
  all:    () => ['recipes'] as const,
  public: () => ['recipes', 'public'] as const,
  detail: (id: number) => ['recipes', id] as const,
};
