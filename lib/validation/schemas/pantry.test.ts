import {
  addPantryTypeSchema,
  pantryCreateSchema,
  pantryJoinSchema,
} from './pantry';

describe('pantryCreateSchema', () => {
  it('validates pantry name length rules', () => {
    expect(pantryCreateSchema.safeParse({ name: 'Mi despensa' }).success).toBe(true);
    expect(pantryCreateSchema.safeParse({ name: 'A'.repeat(20) }).success).toBe(true);
  });

  it('rejects invalid pantry name', () => {
    expect(pantryCreateSchema.safeParse({ name: '' }).success).toBe(false);
    expect(pantryCreateSchema.safeParse({}).success).toBe(false);
  });
});

describe('pantryJoinSchema', () => {
  it('accepts valid code formats', () => {
    expect(pantryJoinSchema.safeParse({ code: 'ABC123' }).success).toBe(true);
    expect(pantryJoinSchema.safeParse({ code: '12345678' }).success).toBe(true);
  });

  it('rejects invalid codes', () => {
    expect(pantryJoinSchema.safeParse({ code: '' }).success).toBe(false);
    expect(pantryJoinSchema.safeParse({}).success).toBe(false);
  });
});

describe('addPantryTypeSchema', () => {
  it('accepts valid pantry type input', () => {
    expect(addPantryTypeSchema.safeParse({ rop: '1', desired_stock: '2' }).success).toBe(true);
  });

  it('rejects invalid rop', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '', desired_stock: '2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ropIssue = result.error.issues.find((i) => i.path.includes('rop'));
      expect(ropIssue?.message).toBe('Ingresa un valor');
    }
  });

  it('rejects rop of zero or negative with the correct message', () => {
    for (const rop of ['0', '-1']) {
      const result = addPantryTypeSchema.safeParse({ rop, desired_stock: '2' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const ropIssue = result.error.issues.find((i) => i.path.includes('rop'));
        expect(ropIssue?.message).toBe('Debe ser mayor a 0');
      }
    }
  });

  it('rejects invalid desired_stock', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '1', desired_stock: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('desired_stock'));
      expect(issue?.message).toBe('Ingresa un valor');
    }
  });

  it('rejects cross-field constraint (desired_stock must be > rop) and places error on desired_stock', () => {
    const result = addPantryTypeSchema.safeParse({
      rop: '2',
      desired_stock: '2',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('desired_stock'));
      expect(issue?.message).toBe('Debe ser mayor al mínimo');
      expect(result.error.issues.some((i) => i.path.includes('rop'))).toBe(false);
    }
  });
});