import { describe, it, expect } from 'vitest';
import { Period } from '../../datetime/Period';
import { LocalDate } from '../../datetime/LocalDate';

describe('Period', () => {
  describe('factory methods', () => {
    it('of', () => {
      const p = Period.of(1, 2, 3);
      expect(p.years).toBe(1);
      expect(p.months).toBe(2);
      expect(p.days).toBe(3);
    });

    it('ofYears', () => {
      expect(Period.ofYears(2).totalMonths).toBe(24);
    });
  });

  describe('between', () => {
    it('same month', () => {
      const p = Period.between(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 15));
      expect(p.years).toBe(0);
      expect(p.months).toBe(0);
      expect(p.days).toBe(14);
    });

    it('across months', () => {
      const p = Period.between(LocalDate.of(2024, 1, 15), LocalDate.of(2024, 3, 10));
      expect(p.years).toBe(0);
      expect(p.months).toBe(1);
      expect(p.days).toBe(24);
    });

    it('across years', () => {
      const p = Period.between(LocalDate.of(2023, 6, 15), LocalDate.of(2025, 3, 10));
      expect(p.years).toBe(1);
      expect(p.months).toBe(8);
      expect(p.days).toBe(23);
    });
  });

  describe('arithmetic', () => {
    it('plus', () => {
      const a = Period.of(1, 2, 3);
      const b = Period.of(0, 3, 5);
      const result = a.plus(b);
      expect(result.years).toBe(1);
      expect(result.months).toBe(5);
      expect(result.days).toBe(8);
    });

    it('multipliedBy', () => {
      const p = Period.of(1, 2, 3).multipliedBy(2);
      expect(p.years).toBe(2);
      expect(p.months).toBe(4);
      expect(p.days).toBe(6);
    });
  });

  describe('normalized', () => {
    it('should convert excess months to years', () => {
      const p = Period.of(0, 14, 5).normalized();
      expect(p.years).toBe(1);
      expect(p.months).toBe(2);
      expect(p.days).toBe(5);
    });
  });

  describe('parse', () => {
    it('should parse P1Y2M3D', () => {
      const p = Period.parse('P1Y2M3D');
      expect(p.years).toBe(1);
      expect(p.months).toBe(2);
      expect(p.days).toBe(3);
    });

    it('should parse negative', () => {
      const p = Period.parse('-P1Y');
      expect(p.years).toBe(-1);
    });
  });

  describe('toString', () => {
    it('should format as ISO-8601', () => {
      expect(Period.of(1, 2, 3).toString()).toBe('P1Y2M3D');
    });

    it('zero period', () => {
      expect(Period.of(0, 0, 0).toString()).toBe('P0D');
    });

    it('omits zero components', () => {
      expect(Period.of(1, 0, 3).toString()).toBe('P1Y3D');
    });
  });
});
