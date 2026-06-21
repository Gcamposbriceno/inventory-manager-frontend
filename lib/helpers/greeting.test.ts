import { greeting } from './greeting';

function dateAt(hour: number): Date {
  const d = new Date(2024, 0, 1);
  d.setHours(hour, 0, 0, 0);
  return d;
}

describe('greeting', () => {
  it('returns morning greeting before noon', () => {
    expect(greeting(dateAt(0))).toBe('Buenos días');
  });

  it('returns afternoon greeting at start of afternoon', () => {
    expect(greeting(dateAt(12))).toBe('Buenas tardes');
  });

  it('returns night greeting at start of night', () => {
    expect(greeting(dateAt(19))).toBe('Buenas noches');
  });

  it('switches correctly at boundary 11 → 12', () => {
    expect(greeting(dateAt(11))).toBe('Buenos días');
    expect(greeting(dateAt(12))).toBe('Buenas tardes');
  });

  it('switches correctly at boundary 18 → 19', () => {
    expect(greeting(dateAt(18))).toBe('Buenas tardes');
    expect(greeting(dateAt(19))).toBe('Buenas noches');
  });
});