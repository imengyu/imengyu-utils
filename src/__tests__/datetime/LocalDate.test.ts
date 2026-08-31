import { describe, it, expect } from 'vitest';
import { LocalDate } from '../../datetime/LocalDate';
import { DayOfWeek } from '../../datetime/types';

describe('LocalDate', () => {
  describe('of', () => {
    it('should create a valid date', () => {
      const d = LocalDate.of(2024, 3, 15);
      expect(d.year).toBe(2024);
      expect(d.month).toBe(3);
      expect(d.dayOfMonth).toBe(15);
    });

    it('should throw on invalid month', () => {
      expect(() => LocalDate.of(2024, 0, 1)).toThrow(RangeError);
      expect(() => LocalDate.of(2024, 13, 1)).toThrow(RangeError);
    });

    it('should throw on invalid day', () => {
      expect(() => LocalDate.of(2024, 2, 30)).toThrow(RangeError);
      expect(() => LocalDate.of(2023, 2, 29)).toThrow(RangeError);
    });

    it('should allow Feb 29 on leap year', () => {
      const d = LocalDate.of(2024, 2, 29);
      expect(d.dayOfMonth).toBe(29);
    });
  });

  describe('parse', () => {
    it('should parse ISO date string', () => {
      const d = LocalDate.parse('2024-01-05');
      expect(d.year).toBe(2024);
      expect(d.month).toBe(1);
      expect(d.dayOfMonth).toBe(5);
    });

    it('should throw on invalid format', () => {
      expect(() => LocalDate.parse('2024/01/05')).toThrow();
    });
  });

  describe('dayOfWeek', () => {
    it('should return correct day of week', () => {
      // 2024-01-01 is Monday
      expect(LocalDate.of(2024, 1, 1).dayOfWeek).toBe(DayOfWeek.MONDAY);
      // 2024-01-07 is Sunday
      expect(LocalDate.of(2024, 1, 7).dayOfWeek).toBe(DayOfWeek.SUNDAY);
    });
  });

  describe('dayOfYear', () => {
    it('should compute correct day of year', () => {
      expect(LocalDate.of(2024, 1, 1).dayOfYear).toBe(1);
      expect(LocalDate.of(2024, 3, 1).dayOfYear).toBe(61); // Jan31 + Feb29 + 1
    });
  });

  describe('plusMonths', () => {
    it('should add months normally', () => {
      const d = LocalDate.of(2024, 1, 15).plusMonths(2);
      expect(d.toString()).toBe('2024-03-15');
    });

    it('should clamp day on overflow', () => {
      const d = LocalDate.of(2024, 1, 31).plusMonths(1);
      expect(d.toString()).toBe('2024-02-29');
    });

    it('should handle year crossing', () => {
      const d = LocalDate.of(2024, 11, 15).plusMonths(3);
      expect(d.toString()).toBe('2025-02-15');
    });
  });

  describe('minusMonths', () => {
    it('should subtract months', () => {
      const d = LocalDate.of(2024, 3, 31).minusMonths(1);
      expect(d.toString()).toBe('2024-02-29');
    });
  });

  describe('plusDays', () => {
    it('should cross month boundary', () => {
      const d = LocalDate.of(2024, 1, 31).plusDays(1);
      expect(d.toString()).toBe('2024-02-01');
    });
  });

  describe('comparison', () => {
    it('isBefore / isAfter / isEqual', () => {
      const a = LocalDate.of(2024, 1, 1);
      const b = LocalDate.of(2024, 1, 2);
      expect(a.isBefore(b)).toBe(true);
      expect(b.isAfter(a)).toBe(true);
      expect(a.isEqual(LocalDate.of(2024, 1, 1))).toBe(true);
    });
  });

  describe('isLeapYear', () => {
    it('should identify leap years', () => {
      expect(LocalDate.of(2024, 1, 1).isLeapYear()).toBe(true);
      expect(LocalDate.of(2023, 1, 1).isLeapYear()).toBe(false);
      expect(LocalDate.of(2000, 1, 1).isLeapYear()).toBe(true);
      expect(LocalDate.of(1900, 1, 1).isLeapYear()).toBe(false);
    });
  });

  describe('lengthOfMonth', () => {
    it('should return correct days', () => {
      expect(LocalDate.of(2024, 2, 1).lengthOfMonth()).toBe(29);
      expect(LocalDate.of(2023, 2, 1).lengthOfMonth()).toBe(28);
      expect(LocalDate.of(2024, 4, 1).lengthOfMonth()).toBe(30);
    });
  });

  describe('with', () => {
    it('withYear should clamp day', () => {
      const d = LocalDate.of(2024, 2, 29).withYear(2023);
      expect(d.toString()).toBe('2023-02-28');
    });

    it('withMonth should clamp day', () => {
      const d = LocalDate.of(2024, 3, 31).withMonth(2);
      expect(d.toString()).toBe('2024-02-29');
    });
  });

  describe('toString / format', () => {
    it('toString returns ISO format', () => {
      expect(LocalDate.of(2024, 1, 5).toString()).toBe('2024-01-05');
    });
  });

  describe('immutability', () => {
    it('operations do not modify original', () => {
      const original = LocalDate.of(2024, 1, 15);
      original.plusDays(10);
      original.plusMonths(3);
      expect(original.toString()).toBe('2024-01-15');
    });
  });
});
