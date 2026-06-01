import { greeting } from './greeting';

function dateAt(hour: number): Date {
  const d = new Date(2024, 0, 1);
  d.setHours(hour, 0, 0, 0);
  return d;
}

describe('greeting', () => {
  it('returns "Buenos días" at midnight (00:00)', () => {
    expect(greeting(dateAt(0))).toBe('Buenos días');
  });

  it('returns "Buenos días" at 06:00', () => {
    expect(greeting(dateAt(6))).toBe('Buenos días');
  });

  it('returns "Buenos días" at 11:00', () => {
    expect(greeting(dateAt(11))).toBe('Buenos días');
  });

  it('returns "Buenas tardes" at 12:00', () => {
    expect(greeting(dateAt(12))).toBe('Buenas tardes');
  });

  it('returns "Buenas tardes" at 15:00', () => {
    expect(greeting(dateAt(15))).toBe('Buenas tardes');
  });

  it('returns "Buenas tardes" at 18:00', () => {
    expect(greeting(dateAt(18))).toBe('Buenas tardes');
  });

  it('returns "Buenas noches" at 19:00', () => {
    expect(greeting(dateAt(19))).toBe('Buenas noches');
  });

  it('returns "Buenas noches" at 23:00', () => {
    expect(greeting(dateAt(23))).toBe('Buenas noches');
  });
});
