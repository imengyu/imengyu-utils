import { describe, it, expect, vi, beforeEach } from 'vitest';
import RandomUtils from '../RandomUtils';

describe('RandomUtils', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.Math, 'random').mockRestore?.();
  });

  describe('genRandom', () => {
    it('should generate integer within range', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
      expect(RandomUtils.genRandom(1, 10)).toBe(6);
    });

    it('should swap min and max if min > max', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
      expect(RandomUtils.genRandom(10, 1)).toBe(6);
    });

    it('should generate with decimal places', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
      expect(RandomUtils.genRandom(0, 10, 2)).toBe(5);
    });

    it('should handle min equals max', () => {
      expect(RandomUtils.genRandom(5, 5)).toBe(5);
    });
  });

  describe('genNonDuplicateID', () => {
    it('should generate string with timestamp prefix', () => {
      const id = RandomUtils.genNonDuplicateID(8);
      expect(id.length).toBeGreaterThanOrEqual(8);
      expect(typeof id).toBe('string');
    });

    it('should default to length 8 when given 0 or negative', () => {
      const id = RandomUtils.genNonDuplicateID(0);
      expect(id.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('genNonDuplicateIDHEX', () => {
    it('should generate hex string', () => {
      const id = RandomUtils.genNonDuplicateIDHEX(8);
      expect(id).toMatch(/^[0-9a-f]+$/i);
    });
  });

  describe('genAutoincrementNumber / setAutoincrementNumberValue', () => {
    beforeEach(() => {
      RandomUtils.setAutoincrementNumberValue(0);
    });

    it('should start from 1', () => {
      expect(RandomUtils.genAutoincrementNumber()).toBe(1);
    });

    it('should increment each call', () => {
      expect(RandomUtils.genAutoincrementNumber()).toBe(1);
      expect(RandomUtils.genAutoincrementNumber()).toBe(2);
      expect(RandomUtils.genAutoincrementNumber()).toBe(3);
    });

    it('should respect custom start value', () => {
      RandomUtils.setAutoincrementNumberValue(100);
      expect(RandomUtils.genAutoincrementNumber()).toBe(101);
    });
  });

  describe('randomString', () => {
    it('should generate string of specified length', () => {
      expect(RandomUtils.randomString(10)).toHaveLength(10);
    });

    it('should default to 32 characters', () => {
      expect(RandomUtils.randomString()).toHaveLength(32);
    });

    it('should only contain valid characters', () => {
      const result = RandomUtils.randomString(100);
      expect(result).toMatch(/^[ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678]+$/);
    });
  });

  describe('randomNumberString', () => {
    it('should generate number string of specified length', () => {
      expect(RandomUtils.randomNumberString(10)).toHaveLength(10);
    });

    it('should default to 32 characters', () => {
      expect(RandomUtils.randomNumberString()).toHaveLength(32);
    });

    it('should only contain digits', () => {
      expect(RandomUtils.randomNumberString(50)).toMatch(/^\d+$/);
    });
  });

  describe('randomChoice', () => {
    it('should return an element from the array', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0);
      expect(RandomUtils.randomChoice(['a', 'b', 'c'])).toBe('a');
    });

    it('should return undefined for empty array', () => {
      expect(RandomUtils.randomChoice([])).toBeUndefined();
    });

    it('should return undefined for null', () => {
      expect(RandomUtils.randomChoice(null as any)).toBeUndefined();
    });
  });

  describe('randomSample', () => {
    it('should return array of requested size', () => {
      const arr = [1, 2, 3, 4, 5];
      const sample = RandomUtils.randomSample(arr, 3);
      expect(sample).toHaveLength(3);
    });

    it('should return all elements shuffled when count >= length', () => {
      const arr = [1, 2, 3];
      const sample = RandomUtils.randomSample(arr, 5);
      expect(sample).toHaveLength(3);
      expect(sample.sort()).toEqual([1, 2, 3]);
    });

    it('should return empty for invalid input', () => {
      expect(RandomUtils.randomSample([], 3)).toEqual([]);
      expect(RandomUtils.randomSample([1, 2, 3], 0)).toEqual([]);
    });
  });

  describe('shuffle', () => {
    it('should return array of same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = RandomUtils.shuffle(arr);
      expect(shuffled).toHaveLength(5);
    });

    it('should contain all original elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = RandomUtils.shuffle(arr);
      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should not mutate original array', () => {
      const arr = [1, 2, 3];
      const copy = [...arr];
      RandomUtils.shuffle(arr);
      expect(arr).toEqual(copy);
    });

    it('should return empty for null', () => {
      expect(RandomUtils.shuffle(null as any)).toEqual([]);
    });
  });

  describe('randomBoolean', () => {
    it('should return true when random < probability', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.3);
      expect(RandomUtils.randomBoolean(0.5)).toBe(true);
    });

    it('should return false when random >= probability', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.7);
      expect(RandomUtils.randomBoolean(0.5)).toBe(false);
    });

    it('should clamp probability to [0, 1]', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
      expect(RandomUtils.randomBoolean(1.5)).toBe(true);
      expect(RandomUtils.randomBoolean(-0.5)).toBe(false);
    });
  });

  describe('randomFloat', () => {
    it('should generate float in range', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
      expect(RandomUtils.randomFloat(10, 20)).toBe(15);
    });

    it('should swap if min > max', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
      expect(RandomUtils.randomFloat(20, 10)).toBe(15);
    });
  });

  describe('randomDate', () => {
    it('should generate date within range', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const result = RandomUtils.randomDate(start, end);
      expect(result.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(end.getTime());
    });
  });

  describe('randomEmail', () => {
    it('should generate email with @ symbol', () => {
      const email = RandomUtils.randomEmail();
      expect(email).toMatch(/^.+@.+\..+$/);
    });

    it('should use specified domain', () => {
      const email = RandomUtils.randomEmail('example.com');
      expect(email).toMatch(/@example\.com$/);
    });
  });

  describe('randomPhoneNumber', () => {
    it('should generate 11-digit phone number', () => {
      const phone = RandomUtils.randomPhoneNumber();
      expect(phone).toHaveLength(11);
      expect(phone).toMatch(/^1\d{10}$/);
    });
  });

  describe('randomColor', () => {
    it('should generate hex color by default', () => {
      expect(RandomUtils.randomColor()).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('should generate rgb color', () => {
      expect(RandomUtils.randomColor('rgb')).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
    });

    it('should generate rgba color', () => {
      expect(RandomUtils.randomColor('rgba')).toMatch(/^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, \d\.\d{2}\)$/);
    });
  });

  describe('randomUUID', () => {
    it('should generate UUID v4 format', () => {
      const uuid = RandomUtils.randomUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });
  });
});
