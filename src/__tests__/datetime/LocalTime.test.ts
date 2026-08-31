import { describe, it, expect } from 'vitest';
import { LocalTime } from '../../datetime/LocalTime';

describe('LocalTime', () => {
  describe('of', () => {
    it('should create valid time', () => {
      const t = LocalTime.of(14, 30, 15, 500);
      expect(t.hour).toBe(14);
      expect(t.minute).toBe(30);
      expect(t.second).toBe(15);
      expect(t.millisecond).toBe(500);
    });

    it('should throw on invalid hour', () => {
      expect(() => LocalTime.of(24, 0)).toThrow(RangeError);
      expect(() => LocalTime.of(-1, 0)).toThrow(RangeError);
    });

    it('should throw on invalid minute', () => {
      expect(() => LocalTime.of(0, 60)).toThrow(RangeError);
    });
  });

  describe('parse', () => {
    it('should parse HH:mm', () => {
      const t = LocalTime.parse('14:30');
      expect(t.hour).toBe(14);
      expect(t.minute).toBe(30);
      expect(t.second).toBe(0);
    });

    it('should parse HH:mm:ss', () => {
      const t = LocalTime.parse('14:30:45');
      expect(t.second).toBe(45);
    });

    it('should parse HH:mm:ss.SSS', () => {
      const t = LocalTime.parse('14:30:45.123');
      expect(t.millisecond).toBe(123);
    });
  });

  describe('plusHours wraps at 24h', () => {
    it('should wrap around midnight', () => {
      const t = LocalTime.of(23, 0).plusHours(2);
      expect(t.hour).toBe(1);
    });

    it('should wrap negative', () => {
      const t = LocalTime.of(1, 0).minusHours(3);
      expect(t.hour).toBe(22);
    });
  });

  describe('comparison', () => {
    it('should compare correctly', () => {
      const a = LocalTime.of(10, 30);
      const b = LocalTime.of(14, 0);
      expect(a.isBefore(b)).toBe(true);
      expect(b.isAfter(a)).toBe(true);
      expect(a.isEqual(LocalTime.of(10, 30))).toBe(true);
    });
  });

  describe('toMillisOfDay', () => {
    it('should compute correct value', () => {
      expect(LocalTime.of(1, 0, 0, 0).toMillisOfDay()).toBe(3600000);
      expect(LocalTime.of(0, 1, 0, 0).toMillisOfDay()).toBe(60000);
    });
  });

  describe('toString', () => {
    it('should format without millis when zero', () => {
      expect(LocalTime.of(8, 5, 3).toString()).toBe('08:05:03');
    });

    it('should include millis when non-zero', () => {
      expect(LocalTime.of(8, 5, 3, 42).toString()).toBe('08:05:03.042');
    });
  });

  describe('immutability', () => {
    it('operations do not modify original', () => {
      const original = LocalTime.of(10, 30, 0);
      original.plusHours(5);
      expect(original.hour).toBe(10);
    });
  });
});
