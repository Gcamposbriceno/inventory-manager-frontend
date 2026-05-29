export const pantryKeys = {
  all:    () => ['pantries'] as const,
  detail: (id: string) => ['pantries', id] as const,
  items:  (id: string) => ['pantries', id, 'items'] as const,
};

export const recipeKeys = {
  all:    () => ['recipes'] as const,
  public: () => ['recipes', 'public'] as const,
  detail: (id: number) => ['recipes', id] as const,
};
