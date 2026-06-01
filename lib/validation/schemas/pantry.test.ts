import { addPantryTypeSchema, pantryCreateSchema, pantryJoinSchema } from './pantry';

// ── pantryCreateSchema ───────────────────────────────────────────────────────

describe('pantryCreateSchema', () => {
  it('accepts a normal name', () => {
    expect(pantryCreateSchema.safeParse({ name: 'Mi despensa' }).success).toBe(true);
  });

  it('accepts a name of exactly 20 characters', () => {
    expect(pantryCreateSchema.safeParse({ name: 'A'.repeat(20) }).success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = pantryCreateSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe('Ingresa un nombre para la despensa');
  });

  it('rejects a name longer than 20 characters', () => {
    const result = pantryCreateSchema.safeParse({ name: 'A'.repeat(21) });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe('El nombre no puede superar 20 caracteres');
  });

  it('rejects when name field is missing', () => {
    expect(pantryCreateSchema.safeParse({}).success).toBe(false);
  });
});

// ── pantryJoinSchema ─────────────────────────────────────────────────────────

describe('pantryJoinSchema', () => {
  it('accepts a valid code', () => {
    expect(pantryJoinSchema.safeParse({ code: 'ABC123' }).success).toBe(true);
  });

  it('accepts a code of exactly 8 characters', () => {
    expect(pantryJoinSchema.safeParse({ code: '12345678' }).success).toBe(true);
  });

  it('accepts a single-character code', () => {
    expect(pantryJoinSchema.safeParse({ code: 'X' }).success).toBe(true);
  });

  it('rejects an empty code', () => {
    const result = pantryJoinSchema.safeParse({ code: '' });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe('Ingresa el código de la despensa');
  });

  it('rejects a code longer than 8 characters', () => {
    const result = pantryJoinSchema.safeParse({ code: '123456789' });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe('El código no puede superar 8 caracteres');
  });

  it('rejects when code field is missing', () => {
    expect(pantryJoinSchema.safeParse({}).success).toBe(false);
  });
});

// ── addPantryTypeSchema ──────────────────────────────────────────────────────

describe('addPantryTypeSchema', () => {
  // ── valid inputs ─────────────────────────────────────────────────────────

  it('accepts integer strings where desired_stock > rop', () => {
    expect(addPantryTypeSchema.safeParse({ rop: '1', desired_stock: '2' }).success).toBe(true);
  });

  it('accepts decimal strings', () => {
    expect(addPantryTypeSchema.safeParse({ rop: '0.5', desired_stock: '1.5' }).success).toBe(true);
  });

  it('accepts large values', () => {
    expect(addPantryTypeSchema.safeParse({ rop: '100', desired_stock: '500' }).success).toBe(true);
  });

  // ── rop field ─────────────────────────────────────────────────────────────

  it('rejects empty rop', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '', desired_stock: '2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ropIssue = result.error.issues.find((i) => i.path.includes('rop'));
      expect(ropIssue?.message).toBe('Ingresa un valor');
    }
  });

  it('rejects rop of zero', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '0', desired_stock: '2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ropIssue = result.error.issues.find((i) => i.path.includes('rop'));
      expect(ropIssue?.message).toBe('Debe ser mayor a 0');
    }
  });

  it('rejects negative rop', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '-1', desired_stock: '2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ropIssue = result.error.issues.find((i) => i.path.includes('rop'));
      expect(ropIssue?.message).toBe('Debe ser mayor a 0');
    }
  });

  it('rejects non-numeric rop', () => {
    const result = addPantryTypeSchema.safeParse({ rop: 'abc', desired_stock: '2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ropIssue = result.error.issues.find((i) => i.path.includes('rop'));
      expect(ropIssue?.message).toBe('Debe ser mayor a 0');
    }
  });

  // ── desired_stock field ───────────────────────────────────────────────────

  it('rejects empty desired_stock', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '1', desired_stock: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('desired_stock'));
      expect(issue?.message).toBe('Ingresa un valor');
    }
  });

  it('rejects desired_stock of zero', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '1', desired_stock: '0' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('desired_stock'));
      expect(issue?.message).toBe('Debe ser mayor a 0');
    }
  });

  it('rejects non-numeric desired_stock', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '1', desired_stock: 'xyz' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('desired_stock'));
      expect(issue?.message).toBe('Debe ser mayor a 0');
    }
  });

  // ── cross-field refinement ────────────────────────────────────────────────

  it('rejects when desired_stock equals rop', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '2', desired_stock: '2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('desired_stock'));
      expect(issue?.message).toBe('Debe ser mayor al mínimo');
    }
  });

  it('rejects when desired_stock is less than rop', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '5', desired_stock: '3' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('desired_stock'));
      expect(issue?.message).toBe('Debe ser mayor al mínimo');
    }
  });

  it('places the cross-field error on the desired_stock path', () => {
    const result = addPantryTypeSchema.safeParse({ rop: '3', desired_stock: '1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path);
      expect(paths.some((p) => p.includes('desired_stock'))).toBe(true);
      expect(paths.some((p) => p.includes('rop'))).toBe(false);
    }
  });
});
