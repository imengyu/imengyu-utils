import { describe, it, expect } from 'vitest';
import { LocalDateTime } from '../../datetime/LocalDateTime';
import { LocalDate } from '../../datetime/LocalDate';
import { LocalTime } from '../../datetime/LocalTime';

describe('LocalDateTime', () => {
  describe('of', () => {
    it('should create valid datetime', () => {
      const dt = LocalDateTime.of(2024, 3, 15, 14, 30, 45);
      expect(dt.year).toBe(2024);
      expect(dt.month).toBe(3);
      expect(dt.dayOfMonth).toBe(15);
      expect(dt.hour).toBe(14);
      expect(dt.minute).toBe(30);
      expect(dt.second).toBe(45);
    });
  });

  describe('parse', () => {
    it('should parse T separator', () => {
      const dt = LocalDateTime.parse('2024-03-15T14:30:45');
      expect(dt.year).toBe(2024);
      expect(dt.hour).toBe(14);
    });

    it('should parse space separator', () => {
      const dt = LocalDateTime.parse('2024-03-15 14:30:45');
      expect(dt.year).toBe(2024);
      expect(dt.hour).toBe(14);
    });
  });

  describe('plusHours with day overflow', () => {
    it('should roll over to next day', () => {
      const dt = LocalDateTime.of(2024, 1, 1, 23, 0).plusHours(3);
      expect(dt.dayOfMonth).toBe(2);
      expect(dt.hour).toBe(2);
    });

    it('should handle negative overflow', () => {
      const dt = LocalDateTime.of(2024, 1, 2, 1, 0).minusHours(3);
      expect(dt.dayOfMonth).toBe(1);
      expect(dt.hour).toBe(22);
    });
  });

  describe('conversion', () => {
    it('toLocalDate and toLocalTime', () => {
      const dt = LocalDateTime.of(2024, 3, 15, 14, 30);
      expect(dt.toLocalDate().toString()).toBe('2024-03-15');
      expect(dt.toLocalTime().hour).toBe(14);
    });

    it('toDate produces correct native Date', () => {
      const dt = LocalDateTime.of(2024, 3, 15, 14, 30, 0);
      const d = dt.toDate();
      expect(d.getFullYear()).toBe(2024);
      expect(d.getMonth()).toBe(2); // 0-based
      expect(d.getDate()).toBe(15);
      expect(d.getHours()).toBe(14);
    });

    it('fromDate round-trips', () => {
      const native = new Date(2024, 2, 15, 14, 30, 45, 123);
      const dt = LocalDateTime.fromDate(native);
      expect(dt.year).toBe(2024);
      expect(dt.month).toBe(3);
      expect(dt.millisecond).toBe(123);
    });
  });

  describe('atStartOfDay / atEndOfDay', () => {
    it('atStartOfDay resets time', () => {
      const dt = LocalDateTime.of(2024, 3, 15, 14, 30).atStartOfDay();
      expect(dt.hour).toBe(0);
      expect(dt.minute).toBe(0);
      expect(dt.dayOfMonth).toBe(15);
    });

    it('atEndOfDay sets to 23:59:59.999', () => {
      const dt = LocalDateTime.of(2024, 3, 15, 14, 30).atEndOfDay();
      expect(dt.hour).toBe(23);
      expect(dt.minute).toBe(59);
      expect(dt.second).toBe(59);
      expect(dt.millisecond).toBe(999);
    });
  });

  describe('comparison', () => {
    it('should compare correctly', () => {
      const a = LocalDateTime.of(2024, 1, 1, 10, 0);
      const b = LocalDateTime.of(2024, 1, 1, 11, 0);
      expect(a.isBefore(b)).toBe(true);
      expect(a.isEqual(LocalDateTime.of(2024, 1, 1, 10, 0))).toBe(true);
    });
  });

  describe('toString', () => {
    it('should produce ISO format', () => {
      expect(LocalDateTime.of(2024, 1, 5, 8, 3, 9).toString()).toBe('2024-01-05T08:03:09');
    });
  });
});
