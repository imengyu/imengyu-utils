import { describe, it, expect } from 'vitest';
import { TemporalAdjusters } from '../../datetime/TemporalAdjusters';
import { LocalDate } from '../../datetime/LocalDate';
import { DayOfWeek } from '../../datetime/types';

describe('TemporalAdjusters', () => {
  describe('firstDayOfMonth', () => {
    it('should return first day', () => {
      const d = LocalDate.of(2024, 3, 15).with(TemporalAdjusters.firstDayOfMonth());
      expect(d.toString()).toBe('2024-03-01');
    });
  });

  describe('lastDayOfMonth', () => {
    it('should return last day', () => {
      const d = LocalDate.of(2024, 2, 10).with(TemporalAdjusters.lastDayOfMonth());
      expect(d.toString()).toBe('2024-02-29');
    });

    it('should handle non-leap February', () => {
      const d = LocalDate.of(2023, 2, 10).with(TemporalAdjusters.lastDayOfMonth());
      expect(d.toString()).toBe('2023-02-28');
    });
  });

  describe('firstDayOfYear / lastDayOfYear', () => {
    it('firstDayOfYear', () => {
      const d = LocalDate.of(2024, 6, 15).with(TemporalAdjusters.firstDayOfYear());
      expect(d.toString()).toBe('2024-01-01');
    });

    it('lastDayOfYear', () => {
      const d = LocalDate.of(2024, 6, 15).with(TemporalAdjusters.lastDayOfYear());
      expect(d.toString()).toBe('2024-12-31');
    });
  });

  describe('firstDayOfNextMonth', () => {
    it('should return first of next month', () => {
      const d = LocalDate.of(2024, 1, 31).with(TemporalAdjusters.firstDayOfNextMonth());
      expect(d.toString()).toBe('2024-02-01');
    });

    it('should cross year boundary', () => {
      const d = LocalDate.of(2024, 12, 15).with(TemporalAdjusters.firstDayOfNextMonth());
      expect(d.toString()).toBe('2025-01-01');
    });
  });

  describe('next / nextOrSame', () => {
    it('next(MONDAY) when today is Monday should return next week Monday', () => {
      // 2024-01-01 is Monday
      const d = LocalDate.of(2024, 1, 1).with(TemporalAdjusters.next(DayOfWeek.MONDAY));
      expect(d.toString()).toBe('2024-01-08');
    });

    it('next(WEDNESDAY) from Monday', () => {
      const d = LocalDate.of(2024, 1, 1).with(TemporalAdjusters.next(DayOfWeek.WEDNESDAY));
      expect(d.toString()).toBe('2024-01-03');
    });

    it('nextOrSame(MONDAY) when today is Monday should return same day', () => {
      const d = LocalDate.of(2024, 1, 1).with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
      expect(d.toString()).toBe('2024-01-01');
    });

    it('nextOrSame(TUESDAY) when today is Monday should return next day', () => {
      const d = LocalDate.of(2024, 1, 1).with(TemporalAdjusters.nextOrSame(DayOfWeek.TUESDAY));
      expect(d.toString()).toBe('2024-01-02');
    });
  });

  describe('previous / previousOrSame', () => {
    it('previous(SUNDAY) from Monday', () => {
      // 2024-01-01 is Monday, previous Sunday is 2023-12-31
      const d = LocalDate.of(2024, 1, 1).with(TemporalAdjusters.previous(DayOfWeek.SUNDAY));
      expect(d.toString()).toBe('2023-12-31');
    });

    it('previousOrSame(MONDAY) on Monday should return same day', () => {
      const d = LocalDate.of(2024, 1, 1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
      expect(d.toString()).toBe('2024-01-01');
    });
  });

  describe('dayOfWeekInMonth', () => {
    it('first Monday of January 2024', () => {
      // Jan 2024: 1st is Monday
      const d = LocalDate.of(2024, 1, 15).with(TemporalAdjusters.dayOfWeekInMonth(1, DayOfWeek.MONDAY));
      expect(d.toString()).toBe('2024-01-01');
    });

    it('second Friday of March 2024', () => {
      // March 2024: 1st is Friday, second Friday is 8th
      const d = LocalDate.of(2024, 3, 15).with(TemporalAdjusters.dayOfWeekInMonth(2, DayOfWeek.FRIDAY));
      expect(d.toString()).toBe('2024-03-08');
    });
  });
});
