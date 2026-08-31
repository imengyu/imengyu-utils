import { describe, it, expect } from 'vitest';
import { Duration } from '../../datetime/Duration';
import { LocalTime } from '../../datetime/LocalTime';
import { LocalDateTime } from '../../datetime/LocalDateTime';

describe('Duration', () => {
  describe('factory methods', () => {
    it('ofHours', () => {
      expect(Duration.ofHours(2).toMillis()).toBe(7200000);
    });

    it('ofMinutes', () => {
      expect(Duration.ofMinutes(30).toSeconds()).toBe(1800);
    });

    it('ofSeconds', () => {
      expect(Duration.ofSeconds(90).toMinutes()).toBe(1);
    });
  });

  describe('between', () => {
    it('between two LocalTimes', () => {
      const d = Duration.between(LocalTime.of(10, 0), LocalTime.of(12, 30));
      expect(d.toHours()).toBe(2);
      expect(d.toMinutes()).toBe(150);
    });

    it('between two LocalDateTimes', () => {
      const d = Duration.between(
        LocalDateTime.of(2024, 1, 1, 0, 0),
        LocalDateTime.of(2024, 1, 2, 12, 0)
      );
      expect(d.toHours()).toBe(36);
    });

    it('can be negative', () => {
      const d = Duration.between(LocalTime.of(12, 0), LocalTime.of(10, 0));
      expect(d.isNegative()).toBe(true);
    });
  });

  describe('arithmetic', () => {
    it('plus', () => {
      const a = Duration.ofHours(2);
      const b = Duration.ofMinutes(30);
      expect(a.plus(b).toMinutes()).toBe(150);
    });

    it('multipliedBy', () => {
      expect(Duration.ofHours(2).multipliedBy(3).toHours()).toBe(6);
    });

    it('negated', () => {
      expect(Duration.ofHours(2).negated().toHours()).toBe(-2);
    });

    it('abs', () => {
      expect(Duration.ofHours(-2).abs().toHours()).toBe(2);
    });
  });

  describe('parse', () => {
    it('should parse PT8H30M', () => {
      const d = Duration.parse('PT8H30M');
      expect(d.toMinutes()).toBe(510);
    });

    it('should parse negative', () => {
      const d = Duration.parse('-PT2H');
      expect(d.isNegative()).toBe(true);
      expect(d.toHours()).toBe(-2);
    });
  });

  describe('toString', () => {
    it('should format as ISO-8601', () => {
      expect(Duration.ofHours(8).plus(Duration.ofMinutes(30)).toString()).toBe('PT8H30M');
    });

    it('zero duration', () => {
      expect(Duration.ofMillis(0).toString()).toBe('PT0S');
    });
  });

  describe('compareTo', () => {
    it('should compare correctly', () => {
      expect(Duration.ofHours(1).compareTo(Duration.ofMinutes(30))).toBe(1);
      expect(Duration.ofMinutes(30).compareTo(Duration.ofHours(1))).toBe(-1);
      expect(Duration.ofMinutes(60).compareTo(Duration.ofHours(1))).toBe(0);
    });
  });
});
