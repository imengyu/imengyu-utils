import { describe, it, expect } from 'vitest';
import MathUtils from '../MathUtils';

describe('MathUtils', () => {
  describe('limitNumber', () => {
    it('should return the number if within range', () => {
      expect(MathUtils.limitNumber(5, 0, 10)).toBe(5);
    });

    it('should return min if below range', () => {
      expect(MathUtils.limitNumber(-1, 0, 10)).toBe(0);
    });

    it('should return max if above range', () => {
      expect(MathUtils.limitNumber(11, 0, 10)).toBe(10);
    });
  });

  describe('fixedNumber', () => {
    it('should round to n decimal places', () => {
      expect(MathUtils.fixedNumber(3.14159, 2)).toBe(3.14);
    });

    it('should round to 0 decimal places when n is 0', () => {
      expect(MathUtils.fixedNumber(3.5, 0)).toBe(4);
    });

    it('should handle negative n as round', () => {
      expect(MathUtils.fixedNumber(3.5, -1)).toBe(4);
    });

    it('should handle integer input', () => {
      expect(MathUtils.fixedNumber(5, 2)).toBe(5);
    });
  });

  describe('radiansToDegrees', () => {
    it('should convert radians to degrees', () => {
      expect(MathUtils.radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(MathUtils.radiansToDegrees(0)).toBeCloseTo(0);
      expect(MathUtils.radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
    });
  });

  describe('degreesToRadians', () => {
    it('should convert degrees to radians', () => {
      expect(MathUtils.degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(MathUtils.degreesToRadians(0)).toBeCloseTo(0);
      expect(MathUtils.degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      expect(MathUtils.distance(0, 0, 3, 4)).toBeCloseTo(5);
    });

    it('should return 0 for same point', () => {
      expect(MathUtils.distance(1, 1, 1, 1)).toBe(0);
    });
  });

  describe('average', () => {
    it('should calculate average of numbers', () => {
      expect(MathUtils.average(1, 2, 3, 4, 5)).toBe(3);
    });

    it('should return 0 for no arguments', () => {
      expect(MathUtils.average()).toBe(0);
    });

    it('should handle single number', () => {
      expect(MathUtils.average(5)).toBe(5);
    });
  });

  describe('sum', () => {
    it('should calculate sum of numbers', () => {
      expect(MathUtils.sum(1, 2, 3, 4, 5)).toBe(15);
    });

    it('should return 0 for no arguments', () => {
      expect(MathUtils.sum()).toBe(0);
    });

    it('should handle single number', () => {
      expect(MathUtils.sum(5)).toBe(5);
    });
  });

  describe('median', () => {
    it('should calculate median for odd length', () => {
      expect(MathUtils.median([1, 3, 2])).toBe(2);
    });

    it('should calculate median for even length', () => {
      expect(MathUtils.median([1, 2, 3, 4])).toBe(2.5);
    });

    it('should return 0 for empty array', () => {
      expect(MathUtils.median([])).toBe(0);
    });

    it('should handle unsorted input', () => {
      expect(MathUtils.median([5, 1, 3])).toBe(3);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of 0', () => {
      expect(MathUtils.factorial(0)).toBe(1);
    });

    it('should calculate factorial of 1', () => {
      expect(MathUtils.factorial(1)).toBe(1);
    });

    it('should calculate factorial of 5', () => {
      expect(MathUtils.factorial(5)).toBe(120);
    });

    it('should throw for negative input', () => {
      expect(() => MathUtils.factorial(-1)).toThrow('输入必须是非负整数');
    });
  });

  describe('gcd', () => {
    it('should calculate gcd of two numbers', () => {
      expect(MathUtils.gcd(12, 8)).toBe(4);
    });

    it('should handle coprime numbers', () => {
      expect(MathUtils.gcd(7, 13)).toBe(1);
    });

    it('should handle zero', () => {
      expect(MathUtils.gcd(0, 5)).toBe(5);
      expect(MathUtils.gcd(5, 0)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(MathUtils.gcd(-12, 8)).toBe(4);
    });
  });

  describe('lcm', () => {
    it('should calculate lcm of two numbers', () => {
      expect(MathUtils.lcm(4, 6)).toBe(12);
    });

    it('should handle zero', () => {
      expect(MathUtils.lcm(0, 5)).toBe(0);
      expect(MathUtils.lcm(5, 0)).toBe(0);
    });
  });

  describe('safeDivide', () => {
    it('should divide normally', () => {
      expect(MathUtils.safeDivide(10, 2)).toBe(5);
    });

    it('should return fallback when dividing by zero', () => {
      expect(MathUtils.safeDivide(10, 0)).toBe(0);
    });

    it('should use custom fallback', () => {
      expect(MathUtils.safeDivide(10, 0, -1)).toBe(-1);
    });
  });

  describe('safeMath', () => {
    it('should return result of successful operation', () => {
      expect(MathUtils.safeMath(() => 42)).toBe(42);
    });

    it('should return fallback on NaN', () => {
      expect(MathUtils.safeMath(() => NaN)).toBe(0);
    });

    it('should return fallback on Infinity', () => {
      expect(MathUtils.safeMath(() => Infinity)).toBe(0);
    });

    it('should return fallback on exception', () => {
      expect(MathUtils.safeMath(() => { throw new Error('boom'); })).toBe(0);
    });

    it('should use custom fallback', () => {
      expect(MathUtils.safeMath(() => NaN, -1)).toBe(-1);
    });
  });

  describe('standardDeviation', () => {
    it('should calculate standard deviation', () => {
      const result = MathUtils.standardDeviation([1, 2, 3, 4, 5]);
      expect(result).toBeCloseTo(Math.sqrt(2), 5);
    });

    it('should return 0 for single element', () => {
      expect(MathUtils.standardDeviation([5])).toBe(0);
    });

    it('should return 0 for empty array', () => {
      expect(MathUtils.standardDeviation([])).toBe(0);
    });
  });

  describe('lerp', () => {
    it('should interpolate at progress 0', () => {
      expect(MathUtils.lerp(10, 20, 0)).toBe(10);
    });

    it('should interpolate at progress 1', () => {
      expect(MathUtils.lerp(10, 20, 1)).toBe(20);
    });

    it('should interpolate at progress 0.5', () => {
      expect(MathUtils.lerp(10, 20, 0.5)).toBe(15);
    });

    it('should clamp progress between 0 and 1', () => {
      expect(MathUtils.lerp(10, 20, -0.5)).toBe(10);
      expect(MathUtils.lerp(10, 20, 1.5)).toBe(20);
    });
  });

  describe('inverseLerp', () => {
    it('should return 0 when value equals min', () => {
      expect(MathUtils.inverseLerp(10, 10, 20)).toBe(0);
    });

    it('should return 1 when value equals max', () => {
      expect(MathUtils.inverseLerp(20, 10, 20)).toBe(1);
    });

    it('should return 0.5 when value is midpoint', () => {
      expect(MathUtils.inverseLerp(15, 10, 20)).toBe(0.5);
    });

    it('should clamp result to [0, 1]', () => {
      expect(MathUtils.inverseLerp(5, 10, 20)).toBe(0);
      expect(MathUtils.inverseLerp(25, 10, 20)).toBe(1);
    });

    it('should return 0 when min equals max', () => {
      expect(MathUtils.inverseLerp(10, 10, 10)).toBe(0);
    });
  });

  describe('percentage', () => {
    it('should calculate percentage', () => {
      expect(MathUtils.percentage(25, 100)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(MathUtils.percentage(25, 0)).toBe(0);
    });

    it('should handle values over 100%', () => {
      expect(MathUtils.percentage(150, 100)).toBe(150);
    });
  });

  describe('roundToPrecision', () => {
    it('should round to nearest 10', () => {
      expect(MathUtils.roundToPrecision(13, 10)).toBe(10);
      expect(MathUtils.roundToPrecision(15, 10)).toBe(20);
    });

    it('should round to nearest 0.1', () => {
      expect(MathUtils.roundToPrecision(1.23, 0.1)).toBeCloseTo(1.2);
      expect(MathUtils.roundToPrecision(1.25, 0.1)).toBeCloseTo(1.3);
    });

    it('should round to nearest 100', () => {
      expect(MathUtils.roundToPrecision(550, 100)).toBe(600);
      expect(MathUtils.roundToPrecision(549, 100)).toBe(500);
    });
  });

  describe('square', () => {
    it('should calculate square', () => {
      expect(MathUtils.square(5)).toBe(25);
    });

    it('should handle negative numbers', () => {
      expect(MathUtils.square(-5)).toBe(25);
    });

    it('should handle zero', () => {
      expect(MathUtils.square(0)).toBe(0);
    });
  });

  describe('cube', () => {
    it('should calculate cube', () => {
      expect(MathUtils.cube(3)).toBe(27);
    });

    it('should handle negative numbers', () => {
      expect(MathUtils.cube(-3)).toBe(-27);
    });
  });

  describe('abs', () => {
    it('should return positive for positive input', () => {
      expect(MathUtils.abs(5)).toBe(5);
    });

    it('should return positive for negative input', () => {
      expect(MathUtils.abs(-5)).toBe(5);
    });

    it('should return 0 for zero', () => {
      expect(MathUtils.abs(0)).toBe(0);
    });
  });

  describe('sign', () => {
    it('should return 1 for positive number', () => {
      expect(MathUtils.sign(5)).toBe(1);
    });

    it('should return -1 for negative number', () => {
      expect(MathUtils.sign(-5)).toBe(-1);
    });

    it('should return 0 for zero', () => {
      expect(MathUtils.sign(0)).toBe(0);
    });
  });
});
