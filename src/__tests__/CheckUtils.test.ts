import { describe, it, expect } from 'vitest';
import CheckUtils from '../CheckUtils';

describe('CheckUtils', () => {
  describe('checkIsNotEmpty', () => {
    it('should return true for non-empty string', () => {
      expect(CheckUtils.checkIsNotEmpty('test')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(CheckUtils.checkIsNotEmpty('')).toBe(false);
    });

    it('should return false for non-string types', () => {
      expect(CheckUtils.checkIsNotEmpty(null as any)).toBe(false);
      expect(CheckUtils.checkIsNotEmpty(undefined as any)).toBe(false);
      expect(CheckUtils.checkIsNotEmpty(123 as any)).toBe(false);
    });
  });

  describe('checkIsNotEmptyAndSpace', () => {
    it('should return true for non-empty string', () => {
      expect(CheckUtils.checkIsNotEmptyAndSpace('test')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(CheckUtils.checkIsNotEmptyAndSpace('')).toBe(false);
    });

    it('should return false for whitespace-only string', () => {
      expect(CheckUtils.checkIsNotEmptyAndSpace('   ')).toBe(false);
    });

    it('should return false for non-string types', () => {
      expect(CheckUtils.checkIsNotEmptyAndSpace(null as any)).toBe(false);
    });
  });

  describe('checkIsCardNumber', () => {
    it('should return true for valid 18-digit ID number', () => {
      expect(CheckUtils.checkIsCardNumber('110101199001011234')).toBe(true);
    });

    it('should return true for valid 18-digit ID number ending with X', () => {
      expect(CheckUtils.checkIsCardNumber('11010119900101123X')).toBe(true);
    });

    it('should return true for valid 15-digit ID number', () => {
      expect(CheckUtils.checkIsCardNumber('110101900101123')).toBe(true);
    });

    it('should return false for invalid ID number', () => {
      expect(CheckUtils.checkIsCardNumber('123')).toBe(false);
      expect(CheckUtils.checkIsCardNumber('abcdefghijklmnopqr')).toBe(false);
    });
  });

  describe('checkIsChineseName', () => {
    it('should return true for valid Chinese name', () => {
      expect(CheckUtils.checkIsChineseName('张三')).toBe(true);
    });

    it('should return false for non-Chinese characters', () => {
      expect(CheckUtils.checkIsChineseName('John')).toBe(false);
    });
  });

  describe('checkIsChinesePhoneNumber', () => {
    it('should return true for valid Chinese phone numbers', () => {
      expect(CheckUtils.checkIsChinesePhoneNumber('13800138000')).toBe(true);
      expect(CheckUtils.checkIsChinesePhoneNumber('15912345678')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(CheckUtils.checkIsChinesePhoneNumber('12345678901')).toBe(false);
      expect(CheckUtils.checkIsChinesePhoneNumber('1380013800')).toBe(false);
      expect(CheckUtils.checkIsChinesePhoneNumber('abc')).toBe(false);
    });
  });

  describe('checkIsUrl', () => {
    it('should return true for valid URLs', () => {
      expect(CheckUtils.checkIsUrl('https://example.com')).toBe(true);
      expect(CheckUtils.checkIsUrl('http://test.org/path')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(CheckUtils.checkIsUrl('not a url')).toBe(false);
      expect(CheckUtils.checkIsUrl('')).toBe(false);
    });
  });

  describe('checkIsImageFile', () => {
    it('should return true for image file extensions', () => {
      expect(CheckUtils.checkIsImageFile('photo.jpg')).toBe(true);
      expect(CheckUtils.checkIsImageFile('photo.jpeg')).toBe(true);
      expect(CheckUtils.checkIsImageFile('photo.png')).toBe(true);
      expect(CheckUtils.checkIsImageFile('photo.gif')).toBe(true);
      expect(CheckUtils.checkIsImageFile('photo.bmp')).toBe(true);
      expect(CheckUtils.checkIsImageFile('photo.webp')).toBe(true);
      expect(CheckUtils.checkIsImageFile('photo.svg')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(CheckUtils.checkIsImageFile('photo.JPG')).toBe(true);
      expect(CheckUtils.checkIsImageFile('photo.PNG')).toBe(true);
    });

    it('should return false for non-image file extensions', () => {
      expect(CheckUtils.checkIsImageFile('document.pdf')).toBe(false);
      expect(CheckUtils.checkIsImageFile('file.txt')).toBe(false);
      expect(CheckUtils.checkIsImageFile('')).toBe(false);
    });
  });

  describe('compareVersion', () => {
    it('should return 1 when v1 > v2', () => {
      expect(CheckUtils.compareVersion('2.0.0', '1.0.0')).toBe(1);
      expect(CheckUtils.compareVersion('1.0.1', '1.0.0')).toBe(1);
    });

    it('should return -1 when v1 < v2', () => {
      expect(CheckUtils.compareVersion('1.0.0', '2.0.0')).toBe(-1);
      expect(CheckUtils.compareVersion('1.0.0', '1.0.1')).toBe(-1);
    });

    it('should return 0 when v1 === v2', () => {
      expect(CheckUtils.compareVersion('1.0.0', '1.0.0')).toBe(0);
    });

    it('should handle different lengths', () => {
      expect(CheckUtils.compareVersion('1.0', '1.0.0')).toBe(0);
      expect(CheckUtils.compareVersion('1.0.1', '1.0')).toBe(1);
    });
  });

  describe('checkIsEmail', () => {
    it('should return true for valid email', () => {
      expect(CheckUtils.checkIsEmail('test@example.com')).toBe(true);
      expect(CheckUtils.checkIsEmail('user.name@domain.org')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(CheckUtils.checkIsEmail('invalid')).toBe(false);
      expect(CheckUtils.checkIsEmail('invalid@')).toBe(false);
      expect(CheckUtils.checkIsEmail('')).toBe(false);
    });
  });

  describe('checkIsChinesePostalCode', () => {
    it('should return true for valid postal code', () => {
      expect(CheckUtils.checkIsChinesePostalCode('100000')).toBe(true);
      expect(CheckUtils.checkIsChinesePostalCode('518000')).toBe(true);
    });

    it('should return false for invalid postal code', () => {
      expect(CheckUtils.checkIsChinesePostalCode('12345')).toBe(false);
      expect(CheckUtils.checkIsChinesePostalCode('012345')).toBe(false);
      expect(CheckUtils.checkIsChinesePostalCode('abcdef')).toBe(false);
    });
  });

  describe('checkIsBankCard', () => {
    it('should return true for valid bank card numbers', () => {
      expect(CheckUtils.checkIsBankCard('4111111111111111')).toBe(true);
    });

    it('should return false for invalid bank card numbers', () => {
      expect(CheckUtils.checkIsBankCard('123')).toBe(false);
      expect(CheckUtils.checkIsBankCard('12345678901234567890')).toBe(false);
      expect(CheckUtils.checkIsBankCard('abcdefghijklmnop')).toBe(false);
    });
  });

  describe('checkIsIPv4', () => {
    it('should return true for valid IPv4 addresses', () => {
      expect(CheckUtils.checkIsIPv4('192.168.1.1')).toBe(true);
      expect(CheckUtils.checkIsIPv4('255.255.255.255')).toBe(true);
      expect(CheckUtils.checkIsIPv4('0.0.0.0')).toBe(true);
    });

    it('should return false for invalid IPv4 addresses', () => {
      expect(CheckUtils.checkIsIPv4('256.1.1.1')).toBe(false);
      expect(CheckUtils.checkIsIPv4('192.168.1')).toBe(false);
      expect(CheckUtils.checkIsIPv4('abc')).toBe(false);
    });
  });

  describe('checkIsIPv6', () => {
    it('should return true for valid IPv6 addresses', () => {
      expect(CheckUtils.checkIsIPv6('::1')).toBe(true);
      expect(CheckUtils.checkIsIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    });

    it('should return false for invalid IPv6 addresses', () => {
      expect(CheckUtils.checkIsIPv6('abc')).toBe(false);
      expect(CheckUtils.checkIsIPv6('')).toBe(false);
    });
  });

  describe('checkIsDate', () => {
    it('should return true for valid dates', () => {
      expect(CheckUtils.checkIsDate('2024-01-01')).toBe(true);
      expect(CheckUtils.checkIsDate('2023-12-31')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(CheckUtils.checkIsDate('2024-13-01')).toBe(false);
      expect(CheckUtils.checkIsDate('2024-01-32')).toBe(false);
      expect(CheckUtils.checkIsDate('not-a-date')).toBe(false);
    });

    it('should return false for invalid format', () => {
      expect(CheckUtils.checkIsDate('01-01-2024')).toBe(false);
      expect(CheckUtils.checkIsDate('2024/01/01')).toBe(false);
    });
  });

  describe('checkIsChineseCarPlate', () => {
    it('should return true for valid Chinese car plates', () => {
      expect(CheckUtils.checkIsChineseCarPlate('京A12345')).toBe(true);
      expect(CheckUtils.checkIsChineseCarPlate('沪B88888')).toBe(true);
    });

    it('should return false for invalid plates', () => {
      expect(CheckUtils.checkIsChineseCarPlate('AB12345')).toBe(false);
      expect(CheckUtils.checkIsChineseCarPlate('')).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should return true for strong password', () => {
      expect(CheckUtils.checkPasswordStrength('Abc123!@')).toBe(true);
    });

    it('should return false for weak password without min length', () => {
      expect(CheckUtils.checkPasswordStrength('Ab1!')).toBe(false);
    });

    it('should return false for password with only one type', () => {
      expect(CheckUtils.checkPasswordStrength('abcdefgh')).toBe(false);
    });

    it('should respect minLength parameter', () => {
      expect(CheckUtils.checkPasswordStrength('Ab1!', 4)).toBe(true);
      expect(CheckUtils.checkPasswordStrength('Ab1!', 5)).toBe(false);
    });
  });

  describe('checkIsUnifiedSocialCreditCode', () => {
    it('should return true for valid format', () => {
      expect(CheckUtils.checkIsUnifiedSocialCreditCode('91110108784194244T')).toBe(true);
    });

    it('should return false for invalid format', () => {
      expect(CheckUtils.checkIsUnifiedSocialCreditCode('123')).toBe(false);
      expect(CheckUtils.checkIsUnifiedSocialCreditCode('')).toBe(false);
    });
  });

  describe('checkIsMacAddress', () => {
    it('should return true for valid MAC addresses', () => {
      expect(CheckUtils.checkIsMacAddress('00:1A:2B:3C:4D:5E')).toBe(true);
      expect(CheckUtils.checkIsMacAddress('00-1A-2B-3C-4D-5E')).toBe(true);
    });

    it('should return false for invalid MAC addresses', () => {
      expect(CheckUtils.checkIsMacAddress('00:1A:2B:3C:4D')).toBe(false);
      expect(CheckUtils.checkIsMacAddress('invalid')).toBe(false);
    });
  });

  describe('checkIsQQ', () => {
    it('should return true for valid QQ numbers', () => {
      expect(CheckUtils.checkIsQQ('123456')).toBe(true);
      expect(CheckUtils.checkIsQQ('10001')).toBe(true);
    });

    it('should return false for invalid QQ numbers', () => {
      expect(CheckUtils.checkIsQQ('012345')).toBe(false);
      expect(CheckUtils.checkIsQQ('123')).toBe(false);
      expect(CheckUtils.checkIsQQ('')).toBe(false);
    });
  });

  describe('checkIsWechat', () => {
    it('should return true for valid WeChat IDs', () => {
      expect(CheckUtils.checkIsWechat('test_account')).toBe(true);
      expect(CheckUtils.checkIsWechat('a12345')).toBe(true);
    });

    it('should return false for invalid WeChat IDs', () => {
      expect(CheckUtils.checkIsWechat('123abc')).toBe(false);
      expect(CheckUtils.checkIsWechat('ab')).toBe(false);
      expect(CheckUtils.checkIsWechat('')).toBe(false);
    });
  });

  describe('checkIsAllNumber', () => {
    it('should return true for numeric string', () => {
      expect(CheckUtils.checkIsAllNumber('123456')).toBe(true);
    });

    it('should return false for non-numeric string', () => {
      expect(CheckUtils.checkIsAllNumber('123abc')).toBe(false);
      expect(CheckUtils.checkIsAllNumber('')).toBe(false);
    });
  });

  describe('checkIsAllLetter', () => {
    it('should return true for alphabetic string', () => {
      expect(CheckUtils.checkIsAllLetter('abcXYZ')).toBe(true);
    });

    it('should return false for non-alphabetic string', () => {
      expect(CheckUtils.checkIsAllLetter('abc123')).toBe(false);
      expect(CheckUtils.checkIsAllLetter('')).toBe(false);
    });
  });

  describe('checkContainsSpecialChar', () => {
    it('should return true for string with special characters', () => {
      expect(CheckUtils.checkContainsSpecialChar('hello@world')).toBe(true);
      expect(CheckUtils.checkContainsSpecialChar('test!')).toBe(true);
    });

    it('should return false for string without special characters', () => {
      expect(CheckUtils.checkContainsSpecialChar('helloWorld')).toBe(false);
      expect(CheckUtils.checkContainsSpecialChar('你好世界123')).toBe(false);
    });
  });

  describe('checkNumberInRange', () => {
    it('should return true when number is within range', () => {
      expect(CheckUtils.checkNumberInRange(5, 0, 10)).toBe(true);
      expect(CheckUtils.checkNumberInRange(0, 0, 10)).toBe(true);
      expect(CheckUtils.checkNumberInRange(10, 0, 10)).toBe(true);
    });

    it('should return false when number is outside range', () => {
      expect(CheckUtils.checkNumberInRange(-1, 0, 10)).toBe(false);
      expect(CheckUtils.checkNumberInRange(11, 0, 10)).toBe(false);
    });

    it('should handle string numbers', () => {
      expect(CheckUtils.checkNumberInRange('5', 0, 10)).toBe(true);
      expect(CheckUtils.checkNumberInRange('abc', 0, 10)).toBe(false);
    });
  });
});
