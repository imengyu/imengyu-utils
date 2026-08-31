import { describe, it, expect } from 'vitest';
import StringConv from '../StringConv';

describe('StringConv', () => {
  describe('strToHexCharCode', () => {
    it('should convert string to hex with 0x prefix by default', () => {
      expect(StringConv.strToHexCharCode('A')).toBe('0x41');
    });

    it('should convert without 0x prefix when with0x is false', () => {
      expect(StringConv.strToHexCharCode('A', false)).toBe('41');
    });

    it('should convert multi-character string', () => {
      expect(StringConv.strToHexCharCode('AB', false)).toBe('4142');
    });

    it('should return empty string for empty input', () => {
      expect(StringConv.strToHexCharCode('')).toBe('');
    });

    it('should handle Chinese characters', () => {
      const result = StringConv.strToHexCharCode('中', false);
      expect(result).toBe('4e2d');
    });
  });

  describe('getHashCode', () => {
    it('should return consistent hash for same input', () => {
      const hash1 = StringConv.getHashCode('test', true);
      const hash2 = StringConv.getHashCode('test', true);
      expect(hash1).toBe(hash2);
    });

    it('should return different hash for different input', () => {
      expect(StringConv.getHashCode('abc', true)).not.toBe(StringConv.getHashCode('def', true));
    });

    it('should be case sensitive when caseSensitive is true', () => {
      expect(StringConv.getHashCode('Test', true)).not.toBe(StringConv.getHashCode('test', true));
    });

    it('should be case insensitive when caseSensitive is false', () => {
      expect(StringConv.getHashCode('Test', false)).toBe(StringConv.getHashCode('test', false));
    });

    it('should return a hex string without 0x prefix', () => {
      const hash = StringConv.getHashCode('hello', true);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    it('should handle empty string', () => {
      const hash = StringConv.getHashCode('', true);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });
  });
});
