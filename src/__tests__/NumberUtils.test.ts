import { describe, it, expect } from 'vitest';
import NumberUtils from '../NumberUtils';

describe('NumberUtils', () => {
  describe('formatNumber', () => {
    it('should format with default options', () => {
      expect(NumberUtils.formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('should format with custom decimals', () => {
      expect(NumberUtils.formatNumber(1234.5, { decimals: 3 })).toBe('1,234.500');
    });

    it('should format without separator', () => {
      expect(NumberUtils.formatNumber(1234567, { useSeparator: false, decimals: 0 })).toBe('1234567');
    });

    it('should format with custom separators', () => {
      expect(NumberUtils.formatNumber(1234.56, { separator: '.', decimalSeparator: ',' })).toBe('1.234,56');
    });

    it('should format negative with parentheses', () => {
      expect(NumberUtils.formatNumber(-1234, { negativeFormat: 'parentheses', decimals: 0 })).toBe('(1,234)');
    });

    it('should format negative with minus', () => {
      expect(NumberUtils.formatNumber(-1234, { decimals: 0 })).toBe('-1,234');
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.formatNumber(NaN)).toBe('0');
    });
  });

  describe('toPercent', () => {
    it('should format as percentage', () => {
      expect(NumberUtils.toPercent(0.1234)).toBe('12.34%');
    });

    it('should use custom decimals', () => {
      expect(NumberUtils.toPercent(0.5, 0)).toBe('50%');
    });

    it('should return 0% for NaN', () => {
      expect(NumberUtils.toPercent(NaN)).toBe('0%');
    });
  });

  describe('formatLargeNumber', () => {
    it('should format thousands', () => {
      expect(NumberUtils.formatLargeNumber(1500)).toBe('1.5K');
    });

    it('should format millions', () => {
      expect(NumberUtils.formatLargeNumber(2500000)).toBe('2.5M');
    });

    it('should format billions', () => {
      expect(NumberUtils.formatLargeNumber(1000000000)).toBe('1B');
    });

    it('should handle negative numbers', () => {
      expect(NumberUtils.formatLargeNumber(-1500)).toBe('-1.5K');
    });

    it('should handle small numbers', () => {
      expect(NumberUtils.formatLargeNumber(999)).toBe('999');
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.formatLargeNumber(NaN)).toBe('0');
    });
  });

  describe('parseNumber', () => {
    it('should parse plain number', () => {
      expect(NumberUtils.parseNumber('1234')).toBe(1234);
    });

    it('should parse number with commas', () => {
      expect(NumberUtils.parseNumber('1,234,567')).toBe(1234567);
    });

    it('should return NaN for non-string', () => {
      expect(NumberUtils.parseNumber(123 as unknown as string)).toBeNaN();
    });
  });

  describe('parseNumberWithUnit', () => {
    it('should parse K', () => {
      expect(NumberUtils.parseNumberWithUnit('1.5K')).toBe(1500);
    });

    it('should parse M', () => {
      expect(NumberUtils.parseNumberWithUnit('2M')).toBe(2000000);
    });

    it('should parse number without unit', () => {
      expect(NumberUtils.parseNumberWithUnit('123')).toBe(123);
    });

    it('should return NaN for invalid input', () => {
      expect(NumberUtils.parseNumberWithUnit('abc')).toBeNaN();
    });
  });

  describe('clamp', () => {
    it('should clamp value below min', () => {
      expect(NumberUtils.clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp value above max', () => {
      expect(NumberUtils.clamp(15, 0, 10)).toBe(10);
    });

    it('should return value within range', () => {
      expect(NumberUtils.clamp(5, 0, 10)).toBe(5);
    });

    it('should handle swapped min/max', () => {
      expect(NumberUtils.clamp(5, 10, 0)).toBe(5);
    });

    it('should return min for NaN', () => {
      expect(NumberUtils.clamp(NaN, 0, 10)).toBe(0);
    });
  });

  describe('isInRange', () => {
    it('should return true for value in range (inclusive)', () => {
      expect(NumberUtils.isInRange(5, 0, 10)).toBe(true);
    });

    it('should return true for boundary value (inclusive)', () => {
      expect(NumberUtils.isInRange(0, 0, 10)).toBe(true);
      expect(NumberUtils.isInRange(10, 0, 10)).toBe(true);
    });

    it('should return false for boundary value (exclusive)', () => {
      expect(NumberUtils.isInRange(0, 0, 10, false)).toBe(false);
      expect(NumberUtils.isInRange(10, 0, 10, false)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(NumberUtils.isInRange(NaN, 0, 10)).toBe(false);
    });
  });

  describe('round', () => {
    it('should round to integer', () => {
      expect(NumberUtils.round(1.5)).toBe(2);
      expect(NumberUtils.round(1.4)).toBe(1);
    });

    it('should round to decimals', () => {
      expect(NumberUtils.round(1.456, 2)).toBe(1.46);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.round(NaN)).toBe(0);
    });
  });

  describe('ceil', () => {
    it('should ceil to integer', () => {
      expect(NumberUtils.ceil(1.1)).toBe(2);
    });

    it('should ceil to decimals', () => {
      expect(NumberUtils.ceil(1.441, 2)).toBe(1.45);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.ceil(NaN)).toBe(0);
    });
  });

  describe('floor', () => {
    it('should floor to integer', () => {
      expect(NumberUtils.floor(1.9)).toBe(1);
    });

    it('should floor to decimals', () => {
      expect(NumberUtils.floor(1.459, 2)).toBe(1.45);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.floor(NaN)).toBe(0);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(NumberUtils.isEven(2)).toBe(true);
      expect(NumberUtils.isEven(0)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(NumberUtils.isEven(3)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(NumberUtils.isEven(NaN)).toBe(false);
    });
  });

  describe('isOdd', () => {
    it('should return true for odd numbers', () => {
      expect(NumberUtils.isOdd(3)).toBe(true);
    });

    it('should return false for even numbers', () => {
      expect(NumberUtils.isOdd(2)).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('should return true for integers', () => {
      expect(NumberUtils.isInteger(5)).toBe(true);
    });

    it('should return false for floats', () => {
      expect(NumberUtils.isInteger(5.5)).toBe(false);
    });
  });

  describe('isSafeInteger', () => {
    it('should return true for safe integers', () => {
      expect(NumberUtils.isSafeInteger(100)).toBe(true);
    });

    it('should return false for unsafe integers', () => {
      expect(NumberUtils.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      expect(NumberUtils.isPositive(1)).toBe(true);
    });

    it('should return false for zero and negative', () => {
      expect(NumberUtils.isPositive(0)).toBe(false);
      expect(NumberUtils.isPositive(-1)).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return true for negative numbers', () => {
      expect(NumberUtils.isNegative(-1)).toBe(true);
    });

    it('should return false for zero and positive', () => {
      expect(NumberUtils.isNegative(0)).toBe(false);
      expect(NumberUtils.isNegative(1)).toBe(false);
    });
  });

  describe('randomInt', () => {
    it('should generate number within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('difference', () => {
    it('should return absolute difference', () => {
      expect(NumberUtils.difference(5, 3)).toBe(2);
      expect(NumberUtils.difference(3, 5)).toBe(2);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.difference(NaN, 5)).toBe(0);
    });
  });

  describe('percentageChange', () => {
    it('should calculate percentage change', () => {
      expect(NumberUtils.percentageChange(100, 150)).toBe(50);
      expect(NumberUtils.percentageChange(100, 50)).toBe(-50);
    });

    it('should return 0 when oldValue is 0', () => {
      expect(NumberUtils.percentageChange(0, 100)).toBe(0);
    });
  });

  describe('degreesToRadians', () => {
    it('should convert degrees to radians', () => {
      expect(NumberUtils.degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(NumberUtils.degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.degreesToRadians(NaN)).toBe(0);
    });
  });

  describe('radiansToDegrees', () => {
    it('should convert radians to degrees', () => {
      expect(NumberUtils.radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(NumberUtils.radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.radiansToDegrees(NaN)).toBe(0);
    });
  });

  describe('abs', () => {
    it('should return absolute value', () => {
      expect(NumberUtils.abs(-5)).toBe(5);
      expect(NumberUtils.abs(5)).toBe(5);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.abs(NaN)).toBe(0);
    });
  });

  describe('sign', () => {
    it('should return sign', () => {
      expect(NumberUtils.sign(5)).toBe(1);
      expect(NumberUtils.sign(-5)).toBe(-1);
      expect(NumberUtils.sign(0)).toBe(0);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.sign(NaN)).toBe(0);
    });
  });

  describe('average', () => {
    it('should return average', () => {
      expect(NumberUtils.average(4, 6)).toBe(5);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.average(NaN, 5)).toBe(0);
    });
  });

  describe('lerp', () => {
    it('should interpolate', () => {
      expect(NumberUtils.lerp(0, 10, 0.5)).toBe(5);
      expect(NumberUtils.lerp(0, 10, 0)).toBe(0);
      expect(NumberUtils.lerp(0, 10, 1)).toBe(10);
    });

    it('should clamp t to 0-1', () => {
      expect(NumberUtils.lerp(0, 10, 2)).toBe(10);
      expect(NumberUtils.lerp(0, 10, -1)).toBe(0);
    });

    it('should return 0 for NaN', () => {
      expect(NumberUtils.lerp(NaN, 10, 0.5)).toBe(0);
    });
  });
});
