import { describe, it, expect } from 'vitest';
import StringUtils from '../StringUtils';

describe('StringUtils', () => {
  describe('isNullOrEmpty', () => {
    it('should return true for null', () => {
      expect(StringUtils.isNullOrEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(StringUtils.isNullOrEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(StringUtils.isNullOrEmpty('')).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(StringUtils.isNullOrEmpty('test')).toBe(false);
    });
  });

  describe('isBase64', () => {
    it('should return true for valid base64', () => {
      expect(StringUtils.isBase64('SGVsbG8gV29ybGQ=')).toBe(true);
    });

    it('should return true for base64 with padding', () => {
      expect(StringUtils.isBase64('YWJjZA==')).toBe(true);
    });

    it('should return false for invalid base64', () => {
      expect(StringUtils.isBase64('invalid!@#')).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for positive numbers', () => {
      expect(StringUtils.isNumber('123')).toBe(true);
      expect(StringUtils.isNumber('123.45')).toBe(true);
    });

    it('should return true for negative numbers', () => {
      expect(StringUtils.isNumber('-123')).toBe(true);
      expect(StringUtils.isNumber('-123.45')).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(StringUtils.isNumber('abc')).toBe(false);
      expect(StringUtils.isNumber('12a3')).toBe(false);
    });
  });

  describe('isStringAllEnglish', () => {
    it('should return true for all english', () => {
      expect(StringUtils.isStringAllEnglish('Hello World')).toBe(true);
    });

    it('should return false for chinese', () => {
      expect(StringUtils.isStringAllEnglish('你好')).toBe(false);
    });

    it('should return false for mixed', () => {
      expect(StringUtils.isStringAllEnglish('Hello你好')).toBe(false);
    });
  });

  describe('isStringAllChinese', () => {
    it('should return true for all chinese', () => {
      expect(StringUtils.isStringAllChinese('你好世界')).toBe(true);
    });

    it('should return false for english', () => {
      expect(StringUtils.isStringAllChinese('Hello')).toBe(false);
    });

    it('should return false for mixed', () => {
      expect(StringUtils.isStringAllChinese('Hello你好')).toBe(false);
    });
  });

  describe('isEmail', () => {
    it('should return true for valid email', () => {
      expect(StringUtils.isEmail('test@example.com')).toBe(true);
      expect(StringUtils.isEmail('user.name@domain.org')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(StringUtils.isEmail('invalid')).toBe(false);
      expect(StringUtils.isEmail('invalid@')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should return true for valid URL', () => {
      expect(StringUtils.isUrl('https://example.com')).toBe(true);
      expect(StringUtils.isUrl('http://test.org/path')).toBe(true);
    });

    it('should return false for invalid URL', () => {
      expect(StringUtils.isUrl('not a url')).toBe(false);
    });
  });

  describe('getCharCount', () => {
    it('should count occurrences', () => {
      expect(StringUtils.getCharCount('hello world', 'l')).toBe(3);
    });

    it('should return 0 for no matches', () => {
      expect(StringUtils.getCharCount('hello', 'x')).toBe(0);
    });
  });

  describe('stringHashCode', () => {
    it('should return consistent hash', () => {
      const hash1 = StringUtils.stringHashCode('test');
      const hash2 = StringUtils.stringHashCode('test');
      expect(hash1).toBe(hash2);
    });

    it('should return different hashes for different strings', () => {
      expect(StringUtils.stringHashCode('abc')).not.toBe(StringUtils.stringHashCode('def'));
    });
  });

  describe('cutString', () => {
    it('should return original string if length is within limit', () => {
      expect(StringUtils.cutString('short', 10)).toBe('short');
    });

    it('should truncate and add ellipsis', () => {
      expect(StringUtils.cutString('this is a long string', 10)).toBe('this is a ...');
    });
  });

  describe('trim', () => {
    it('should remove all spaces', () => {
      expect(StringUtils.trim('  hello world  ')).toBe('helloworld');
    });

    it('should remove spaces in middle', () => {
      expect(StringUtils.trim('hello   world')).toBe('helloworld');
    });
  });

  describe('equals', () => {
    it('should return true for equal strings', () => {
      expect(StringUtils.equals('test', 'test')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(StringUtils.equals('test', 'different')).toBe(false);
    });

    it('should work with numbers', () => {
      expect(StringUtils.equals(123, 123)).toBe(true);
      expect(StringUtils.equals(123, 456)).toBe(false);
    });
  });

  describe('equalsIgnoreCase', () => {
    it('should return true for same strings', () => {
      expect(StringUtils.equalsIgnoreCase('Hello', 'hello')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(StringUtils.equalsIgnoreCase('Hello', 'World')).toBe(false);
    });
  });

  describe('startsWith', () => {
    it('should return true when string starts with prefix', () => {
      expect(StringUtils.startsWith('hello world', 'hello')).toBe(true);
    });

    it('should return false when string does not start with prefix', () => {
      expect(StringUtils.startsWith('hello world', 'world')).toBe(false);
    });
  });

  describe('endsWith', () => {
    it('should return true when string ends with suffix', () => {
      expect(StringUtils.endsWith('hello world', 'world')).toBe(true);
    });

    it('should return false when string does not end with suffix', () => {
      expect(StringUtils.endsWith('hello world', 'hello')).toBe(false);
    });
  });

  describe('contains', () => {
    it('should return true when string contains substring', () => {
      expect(StringUtils.contains('hello world', 'world')).toBe(true);
    });

    it('should return false when string does not contain substring', () => {
      expect(StringUtils.contains('hello world', 'foo')).toBe(false);
    });
  });

  describe('repeat', () => {
    it('should repeat string', () => {
      expect(StringUtils.repeat('ab', 3)).toBe('ababab');
    });

    it('should return empty for zero count', () => {
      expect(StringUtils.repeat('ab', 0)).toBe('');
    });
  });

  describe('padStart', () => {
    it('should pad at start', () => {
      expect(StringUtils.padStart('abc', 5, '0')).toBe('00abc');
    });

    it('should return original if length is sufficient', () => {
      expect(StringUtils.padStart('abc', 2, '0')).toBe('abc');
    });
  });

  describe('padEnd', () => {
    it('should pad at end', () => {
      expect(StringUtils.padEnd('abc', 5, '0')).toBe('abc00');
    });

    it('should return original if length is sufficient', () => {
      expect(StringUtils.padEnd('abc', 2, '0')).toBe('abc');
    });
  });

  describe('escapeHtml', () => {
    it('should escape special characters', () => {
      expect(StringUtils.escapeHtml('<script>')).toBe('&lt;script&gt;');
    });
  });

  describe('unescapeHtml', () => {
    it('should unescape special characters', () => {
      expect(StringUtils.unescapeHtml('&lt;script&gt;')).toBe('<script>');
    });
  });

  describe('randomString', () => {
    it('should generate random string of correct length', () => {
      const result = StringUtils.randomString(10);
      expect(result).toHaveLength(10);
    });

    it('should use custom charset', () => {
      const result = StringUtils.randomString(10, 'abc');
      expect(result).toMatch(/^[abc]+$/);
    });
  });

  describe('replaceAll', () => {
    it('should replace all occurrences', () => {
      expect(StringUtils.replaceAll('a b a b', 'a', 'x')).toBe('x b x b');
    });
  });

  describe('case', () => {
    describe('toCamelCase', () => {
      it('should convert to camelCase', () => {
        expect(StringUtils.case.toCamelCase('hello-world')).toBe('helloWorld');
        expect(StringUtils.case.toCamelCase('hello_world')).toBe('helloWorld');
      });
    });

    describe('toSnakeCase', () => {
      it('should convert to snake_case', () => {
        expect(StringUtils.case.toSnakeCase('helloWorld')).toBe('hello_world');
        expect(StringUtils.case.toSnakeCase('hello-world')).toBe('hello_world');
      });
    });

    describe('toKebabCase', () => {
      it('should convert to kebab-case', () => {
        expect(StringUtils.case.toKebabCase('helloWorld')).toBe('hello-world');
        expect(StringUtils.case.toKebabCase('hello_world')).toBe('hello-world');
      });
    });
  });

  describe('path', () => {
    describe('getFileName', () => {
      it('should get filename from path', () => {
        expect(StringUtils.path.getFileName('/path/to/file.txt')).toBe('file.txt');
        expect(StringUtils.path.getFileName('C:\\path\\to\\file.txt')).toBe('file.txt');
      });
    });

    describe('getFileExt', () => {
      it('should get extension', () => {
        expect(StringUtils.path.getFileExt('file.txt')).toBe('txt');
      });

      it('should ignore URL params', () => {
        expect(StringUtils.path.getFileExt('file.txt?param=1')).toBe('txt');
      });
    });

    describe('getContentDispositionFileName', () => {
      it('should extract filename', () => {
        expect(StringUtils.path.getContentDispositionFileName('attachment; filename="test.txt"')).toBe('test.txt');
      });

      it('should return empty for undefined', () => {
        expect(StringUtils.path.getContentDispositionFileName(undefined)).toBe('');
      });
    });

    describe('getDirectory', () => {
      it('should get directory', () => {
        expect(StringUtils.path.getDirectory('/path/to/file.txt')).toBe('/path/to');
        expect(StringUtils.path.getDirectory('file.txt')).toBe('');
      });
    });

    describe('getFileNameWithoutExt', () => {
      it('should get filename without extension', () => {
        expect(StringUtils.path.getFileNameWithoutExt('file.txt')).toBe('file');
        expect(StringUtils.path.getFileNameWithoutExt('/path/to/file.txt')).toBe('file');
      });
    });

    describe('normalize', () => {
      it('should normalize path', () => {
        expect(StringUtils.path.normalize('/path//to//file')).toBe('path/to/file');
      });
    });

    describe('isAbsolutePath', () => {
      it('should detect Unix absolute path', () => {
        expect(StringUtils.path.isAbsolutePath('/path/file')).toBe(true);
      });

      it('should detect Windows absolute path', () => {
        expect(StringUtils.path.isAbsolutePath('C:/path/file')).toBe(true);
      });

      it('should return false for relative path', () => {
        expect(StringUtils.path.isAbsolutePath('path/file')).toBe(false);
      });
    });

    describe('join', () => {
      it('should join paths', () => {
        expect(StringUtils.path.join('path', 'to', 'file')).toBe('path/to/file');
      });
    });

    describe('changeExt', () => {
      it('should change extension', () => {
        expect(StringUtils.path.changeExt('file.txt', 'md')).toBe('file.md');
      });

      it('should handle paths', () => {
        expect(StringUtils.path.changeExt('/path/to/file.txt', 'md')).toBe('/path/to/file.md');
      });
    });

    describe('toUnixPath', () => {
      it('should convert to Unix path', () => {
        expect(StringUtils.path.toUnixPath('C:\\path\\to\\file')).toBe('C:/path/to/file');
      });
    });

    describe('toWindowsPath', () => {
      it('should convert to Windows path', () => {
        expect(StringUtils.path.toWindowsPath('/path/to/file')).toBe('\\path\\to\\file');
      });
    });

    describe('addTrailingSlash', () => {
      it('should add trailing slash', () => {
        expect(StringUtils.path.addTrailingSlash('path')).toBe('path/');
      });

      it('should not add if already has', () => {
        expect(StringUtils.path.addTrailingSlash('path/')).toBe('path/');
      });
    });

    describe('removeTrailingSlash', () => {
      it('should remove trailing slash', () => {
        expect(StringUtils.path.removeTrailingSlash('path/')).toBe('path');
      });
    });

    describe('isSamePath', () => {
      it('should return true for same paths', () => {
        expect(StringUtils.path.isSamePath('/path/to/file', '/path/to/file')).toBe(true);
      });
    });

    describe('getPathDepth', () => {
      it('should return depth', () => {
        expect(StringUtils.path.getPathDepth('/a/b/c')).toBe(3);
        expect(StringUtils.path.getPathDepth('a/b/c')).toBe(3);
      });
    });

    describe('getUrlParams', () => {
      it('should parse URL params', () => {
        const params = StringUtils.path.getUrlParams('http://example.com?a=1&b=2');
        expect(params).toEqual({ a: '1', b: '2' });
      });
    });

    describe('cleanUrlParams', () => {
      it('should remove URL params', () => {
        expect(StringUtils.path.cleanUrlParams('http://example.com?a=1')).toBe('http://example.com');
      });
    });
  });
});