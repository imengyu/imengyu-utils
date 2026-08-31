import { describe, it, expect } from 'vitest';
import FormatUtils from '../FormatUtils';

describe('FormatUtils', () => {
  describe('formatNumberWithZero', () => {
    it('should pad number with leading zeros', () => {
      expect(FormatUtils.formatNumberWithZero(5, 3)).toBe('005');
      expect(FormatUtils.formatNumberWithZero(123, 5)).toBe('00123');
    });

    it('should not pad when length is sufficient', () => {
      expect(FormatUtils.formatNumberWithZero(123, 3)).toBe('123');
      expect(FormatUtils.formatNumberWithZero(12345, 3)).toBe('12345');
    });

    it('should handle zero', () => {
      expect(FormatUtils.formatNumberWithZero(0, 4)).toBe('0000');
    });
  });

  describe('formatNumberWithComma', () => {
    it('should format number with comma separated thousands and decimals', () => {
      expect(FormatUtils.formatNumberWithComma(1234567)).toBe('1,234,567.00');
    });

    it('should format number without decimals when addComma is false', () => {
      expect(FormatUtils.formatNumberWithComma(1234567, false)).toBe('1,234,567');
    });

    it('should handle string numbers', () => {
      expect(FormatUtils.formatNumberWithComma('1234567')).toBe('1,234,567.00');
    });

    it('should return 0 for non-numeric input', () => {
      expect(FormatUtils.formatNumberWithComma('abc')).toBe('0');
    });

    it('should return 0 for null or empty', () => {
      expect(FormatUtils.formatNumberWithComma('')).toBe('0');
    });

    it('should handle small numbers', () => {
      expect(FormatUtils.formatNumberWithComma(123)).toBe('123.00');
    });
  });

  describe('formatSize', () => {
    it('should format bytes', () => {
      expect(FormatUtils.formatSize(500)).toBe('500B');
    });

    it('should format KB', () => {
      const result = FormatUtils.formatSize(2048);
      expect(result).toMatch(/^2\.00K$/);
    });

    it('should format MB', () => {
      const result = FormatUtils.formatSize(2097152);
      expect(result).toMatch(/^2\.00M$/);
    });

    it('should use custom point length', () => {
      const result = FormatUtils.formatSize(2048, 0);
      expect(result).toMatch(/^2K$/);
    });

    it('should use custom units', () => {
      const result = FormatUtils.formatSize(2 * 1024 * 1024 * 1024, 2, ['B', 'KB', 'MB', 'GB']);
      expect(result).toMatch(/^2\.00GB$/);
    });
  });

  describe('formatCurrency', () => {
    it('should format number with default currency', () => {
      expect(FormatUtils.formatCurrency(1234567)).toBe('¥1,234,567.00');
    });

    it('should format with custom currency', () => {
      expect(FormatUtils.formatCurrency(99.9, '$')).toBe('$99.90');
    });

    it('should handle string input', () => {
      expect(FormatUtils.formatCurrency('99.9')).toBe('¥99.90');
    });

    it('should handle NaN', () => {
      expect(FormatUtils.formatCurrency('abc')).toBe('¥0.00');
    });

    it('should use custom decimals', () => {
      expect(FormatUtils.formatCurrency(123.456, '¥', 3)).toBe('¥123.456');
    });
  });

  describe('formatPercent', () => {
    it('should format decimal as percentage', () => {
      expect(FormatUtils.formatPercent(0.25)).toBe('25.00%');
    });

    it('should handle string input', () => {
      expect(FormatUtils.formatPercent('0.25')).toBe('25.00%');
    });

    it('should handle NaN', () => {
      expect(FormatUtils.formatPercent('abc')).toBe('0.00%');
    });

    it('should use custom decimals', () => {
      expect(FormatUtils.formatPercent(0.256, 1)).toBe('25.6%');
    });
  });

  describe('formatPhone', () => {
    it('should format 11-digit phone number with default template', () => {
      expect(FormatUtils.formatPhone('13812345678')).toBe('138-1234-5678');
    });

    it('should return original input for non-11-digit number', () => {
      expect(FormatUtils.formatPhone('12345')).toBe('12345');
    });

    it('should strip non-digit characters', () => {
      expect(FormatUtils.formatPhone('138-1234-5678')).toBe('138-1234-5678');
    });
  });

  describe('formatBankCard', () => {
    it('should format bank card with default 4-digit groups', () => {
      expect(FormatUtils.formatBankCard('6222021234567894')).toBe('6222 0212 3456 7894');
    });

    it('should use custom separator', () => {
      expect(FormatUtils.formatBankCard('6222021234567894', '-')).toBe('6222-0212-3456-7894');
    });

    it('should handle non-digit characters', () => {
      expect(FormatUtils.formatBankCard('6222 0212 3456 7894')).toBe('6222 0212 3456 7894');
    });

    it('should return original for empty input', () => {
      expect(FormatUtils.formatBankCard('')).toBe('');
    });
  });

  describe('formatIdCard', () => {
    it('should mask middle 8 digits of 18-digit ID', () => {
      expect(FormatUtils.formatIdCard('110101199001011234')).toBe('110101********1234');
    });

    it('should return original input for non-18-digit', () => {
      expect(FormatUtils.formatIdCard('12345')).toBe('12345');
    });

    it('should strip non-digit characters', () => {
      expect(FormatUtils.formatIdCard('110101-19900101-1234')).toBe('110101********1234');
    });
  });

  describe('formatString', () => {
    it('should replace positional placeholders', () => {
      expect(FormatUtils.formatString('Hello {0}, welcome to {1}', 'Alice', 'Wonderland')).toBe('Hello Alice, welcome to Wonderland');
    });

    it('should keep placeholders when no argument provided', () => {
      expect(FormatUtils.formatString('Hello {0}')).toBe('Hello {0}');
    });

    it('should handle multiple occurrences', () => {
      expect(FormatUtils.formatString('{0} + {0} = {1}', 1, 2)).toBe('1 + 1 = 2');
    });
  });

  describe('truncateString', () => {
    it('should return original string if within max length', () => {
      expect(FormatUtils.truncateString('hello', 10)).toBe('hello');
    });

    it('should truncate and add ellipsis', () => {
      expect(FormatUtils.truncateString('this is a long string', 10)).toBe('this is...');
    });

    it('should use custom ellipsis', () => {
      expect(FormatUtils.truncateString('this is a long string', 10, '..')).toBe('this is ..');
    });

    it('should return falsy values as is', () => {
      expect(FormatUtils.truncateString('', 10)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should return 0 Bytes for zero', () => {
      expect(FormatUtils.formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes', () => {
      expect(FormatUtils.formatFileSize(500)).toBe('500 Bytes');
    });

    it('should format KB', () => {
      expect(FormatUtils.formatFileSize(1500)).toBe('1.5 KB');
    });

    it('should format MB', () => {
      expect(FormatUtils.formatFileSize(1500000)).toBe('1.5 MB');
    });

    it('should format GB', () => {
      expect(FormatUtils.formatFileSize(1500000000)).toBe('1.5 GB');
    });
  });

  describe('formatDistance', () => {
    it('should return meters when less than 1000', () => {
      expect(FormatUtils.formatDistance(500)).toBe('500m');
    });

    it('should return kilometers when 1000 or more', () => {
      expect(FormatUtils.formatDistance(1500)).toBe('1.50km');
    });

    it('should handle exact 1000', () => {
      expect(FormatUtils.formatDistance(1000)).toBe('1.00km');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers less than 1000', () => {
      expect(FormatUtils.formatNumber(123)).toBe('123.00');
    });

    it('should format thousands as K', () => {
      expect(FormatUtils.formatNumber(1234)).toBe('1.23K');
    });

    it('should format millions as M', () => {
      expect(FormatUtils.formatNumber(1234567)).toBe('1.23M');
    });

    it('should format billions as B', () => {
      expect(FormatUtils.formatNumber(1234567890)).toBe('1.23B');
    });

    it('should handle negative numbers', () => {
      expect(FormatUtils.formatNumber(-1000)).toBe('-1.00K');
    });
  });

  describe('formatRating', () => {
    it('should return full stars for max score', () => {
      expect(FormatUtils.formatRating(5)).toBe('★★★★★');
    });

    it('should return empty stars for zero score', () => {
      expect(FormatUtils.formatRating(0)).toBe('☆☆☆☆☆');
    });

    it('should cap at max score', () => {
      expect(FormatUtils.formatRating(10)).toBe('★★★★★');
    });

    it('should clamp negative to 0', () => {
      expect(FormatUtils.formatRating(-1)).toBe('☆☆☆☆☆');
    });

    it('should use custom characters', () => {
      expect(FormatUtils.formatRating(3, 5, '#', '.')).toBe('###..');
    });
  });

  describe('formatIpAddress', () => {
    it('should format valid IPv4 address', () => {
      expect(FormatUtils.formatIpAddress('192.168.1.1')).toBe('192.168.1.1');
    });

    it('should clamp values to 0-255', () => {
      expect(FormatUtils.formatIpAddress('192.300.1.1')).toBe('192.255.1.1');
    });

    it('should pad missing parts with 0', () => {
      expect(FormatUtils.formatIpAddress('192.168')).toBe('192.168.0.0');
    });

    it('should handle invalid parts as 0', () => {
      expect(FormatUtils.formatIpAddress('abc.def')).toBe('0.0.0.0');
    });
  });

  describe('formatPriceRange', () => {
    it('should format range when min and max differ', () => {
      expect(FormatUtils.formatPriceRange(10, 20)).toBe('¥10.00-¥20.00');
    });

    it('should format single price when min equals max', () => {
      expect(FormatUtils.formatPriceRange(10, 10)).toBe('¥10.00');
    });
  });

  describe('formatList', () => {
    it('should join items with separator', () => {
      expect(FormatUtils.formatList(['a', 'b', 'c'])).toBe('a, b, c');
    });

    it('should truncate when exceeding maxItems', () => {
      expect(FormatUtils.formatList(['a', 'b', 'c', 'd', 'e'], ', ', 3)).toBe('a, b, c 等5项');
    });

    it('should return empty string for empty array', () => {
      expect(FormatUtils.formatList([])).toBe('');
    });

    it('should handle null or undefined', () => {
      expect(FormatUtils.formatList(null as any)).toBe('');
    });
  });

  describe('formatCoordinates', () => {
    it('should format positive coordinates', () => {
      const result = FormatUtils.formatCoordinates(116.397, 39.907);
      expect(result).toBe(`东经116°23'49" 北纬39°54'25"`);
    });

    it('should format negative coordinates', () => {
      const result = FormatUtils.formatCoordinates(-74.006, -40.712);
      expect(result).toBe(`西经74°0'21" 南纬40°42'43"`);
    });
  });
});
