import { describe, it, expect } from 'vitest';
import ObjectUtils from '../ObjectUtils';

describe('ObjectUtils', () => {
  describe('clone', () => {
    it('should deep clone object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = ObjectUtils.clone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should deep clone array', () => {
      const arr = [{ a: 1 }, { b: 2 }];
      const cloned = ObjectUtils.clone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned[0]).not.toBe(arr[0]);
    });

    it('should shallow clone array when deepArray is false', () => {
      const inner = { a: 1 };
      const arr = [inner];
      const cloned = ObjectUtils.clone(arr, { deepArray: false });
      expect(cloned[0]).toBe(inner);
    });

    it('should clone functions by default', () => {
      const fn = () => 42;
      const cloned = ObjectUtils.clone(fn as any);
      expect(cloned).toBe(fn);
    });

    it('should handle null values in object', () => {
      const obj = { a: null, b: 1 };
      const cloned = ObjectUtils.clone(obj as any);
      expect(cloned).toEqual({ a: null, b: 1 });
    });
  });

  describe('simpleClone', () => {
    it('should clone object', () => {
      const obj = { a: 1, b: 2 };
      const cloned = ObjectUtils.simpleClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('should clone array', () => {
      const arr = [1, 2, 3];
      const cloned = ObjectUtils.simpleClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });

    it('should return primitive as-is', () => {
      expect(ObjectUtils.simpleClone(42 as any)).toBe(42);
    });
  });

  describe('deleteAllUndefined', () => {
    it('should delete undefined fields', () => {
      const obj: Record<string, unknown> = { a: 1, b: undefined, c: 'hello' };
      ObjectUtils.deleteAllUndefined(obj);
      expect(obj).toEqual({ a: 1, c: 'hello' });
    });

    it('should recursively delete undefined fields', () => {
      const obj: Record<string, unknown> = { a: 1, b: { c: undefined, d: 2 } };
      ObjectUtils.deleteAllUndefined(obj);
      expect(obj).toEqual({ a: 1, b: { d: 2 } });
    });

    it('should not recurse when recursive is false', () => {
      const obj: Record<string, unknown> = { a: undefined, b: { c: undefined } };
      ObjectUtils.deleteAllUndefined(obj, false);
      expect(obj).toEqual({ b: { c: undefined } });
    });
  });

  describe('cloneValuesToObject', () => {
    it('should copy values to target', () => {
      const src = { a: 1, b: 2 };
      const target: Record<string, unknown> = {};
      ObjectUtils.cloneValuesToObject(src, target);
      expect(target).toEqual({ a: 1, b: 2 });
    });

    it('should respect ignoreKeys array', () => {
      const src = { a: 1, b: 2, c: 3 };
      const target: Record<string, unknown> = {};
      ObjectUtils.cloneValuesToObject(src, target, { ignoreKeys: ['b'] });
      expect(target).toEqual({ a: 1, c: 3 });
    });

    it('should respect ignoreKeys function', () => {
      const src = { a: 1, b: 2, c: 3 };
      const target: Record<string, unknown> = {};
      ObjectUtils.cloneValuesToObject(src, target, { ignoreKeys: (key) => key === 'a' });
      expect(target).toEqual({ b: 2, c: 3 });
    });

    it('should respect filterKeys array', () => {
      const src = { a: 1, b: 2, c: 3 };
      const target: Record<string, unknown> = {};
      ObjectUtils.cloneValuesToObject(src, target, { filterKeys: ['a', 'c'] });
      expect(target).toEqual({ a: 1, c: 3 });
    });

    it('should throw for invalid srcObject', () => {
      expect(() => ObjectUtils.cloneValuesToObject(null, {})).toThrow();
    });

    it('should throw for invalid targetObject', () => {
      expect(() => ObjectUtils.cloneValuesToObject({}, null)).toThrow();
    });
  });

  describe('equalsObject', () => {
    it('should return true for equal objects', () => {
      expect(ObjectUtils.equalsObject({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('should return false for different objects', () => {
      expect(ObjectUtils.equalsObject({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should handle nested objects', () => {
      expect(ObjectUtils.equalsObject({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(ObjectUtils.equalsObject({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it('should handle arrays', () => {
      expect(ObjectUtils.equalsObject([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(ObjectUtils.equalsObject([1, 2], [1, 2, 3])).toBe(false);
    });

    it('should return true for same reference', () => {
      const obj = { a: 1 };
      expect(ObjectUtils.equalsObject(obj, obj)).toBe(true);
    });

    it('should return false for null comparison', () => {
      expect(ObjectUtils.equalsObject({ a: 1 }, null)).toBe(false);
    });
  });

  describe('equalsObjectOneLevel', () => {
    it('should return true for shallow equal objects', () => {
      expect(ObjectUtils.equalsObjectOneLevel({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('should return false for different values', () => {
      expect(ObjectUtils.equalsObjectOneLevel({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should return false for different key counts', () => {
      expect(ObjectUtils.equalsObjectOneLevel({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('should not deep compare', () => {
      const inner = { x: 1 };
      expect(ObjectUtils.equalsObjectOneLevel({ a: inner }, { a: inner })).toBe(true);
      expect(ObjectUtils.equalsObjectOneLevel({ a: { x: 1 } }, { a: { x: 1 } })).toBe(false);
    });
  });

  describe('mergeObject', () => {
    it('should merge source into target', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = ObjectUtils.mergeObject(target, source);
      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).toBe(target);
    });

    it('should overwrite existing keys', () => {
      const target = { a: 1 };
      const source = { a: 2 };
      ObjectUtils.mergeObject(target, source);
      expect(target).toEqual({ a: 2 });
    });
  });

  describe('mergeObjects', () => {
    it('should merge multiple objects', () => {
      const result = ObjectUtils.mergeObjects({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should throw for less than 2 arguments', () => {
      expect(() => ObjectUtils.mergeObjects({ a: 1 })).toThrow();
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(ObjectUtils.isDefined(0)).toBe(true);
      expect(ObjectUtils.isDefined(null)).toBe(true);
      expect(ObjectUtils.isDefined('')).toBe(true);
    });

    it('should return false for undefined', () => {
      expect(ObjectUtils.isDefined(undefined)).toBe(false);
    });
  });

  describe('isDefinedAndNotNull', () => {
    it('should return true for defined non-null values', () => {
      expect(ObjectUtils.isDefinedAndNotNull(0)).toBe(true);
      expect(ObjectUtils.isDefinedAndNotNull('')).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(ObjectUtils.isDefinedAndNotNull(null)).toBe(false);
      expect(ObjectUtils.isDefinedAndNotNull(undefined)).toBe(false);
    });
  });

  describe('isObjectAllKeyNull', () => {
    it('should return true when all values are falsy', () => {
      expect(ObjectUtils.isObjectAllKeyNull({ a: null, b: undefined, c: 0, d: '' })).toBe(true);
    });

    it('should return false when any value is truthy', () => {
      expect(ObjectUtils.isObjectAllKeyNull({ a: null, b: 1 })).toBe(false);
    });
  });

  describe('isNullOrEmpty', () => {
    it('should return true for null, undefined, empty string', () => {
      expect(ObjectUtils.isNullOrEmpty(null)).toBe(true);
      expect(ObjectUtils.isNullOrEmpty(undefined)).toBe(true);
      expect(ObjectUtils.isNullOrEmpty('')).toBe(true);
    });

    it('should return false for other values', () => {
      expect(ObjectUtils.isNullOrEmpty(0)).toBe(false);
      expect(ObjectUtils.isNullOrEmpty('hello')).toBe(false);
    });
  });

  describe('copyValuesIfUndefined', () => {
    it('should copy missing keys from source', () => {
      const dist = { a: 1 } as Record<string, unknown>;
      const src = { a: 99, b: 2 } as Record<string, unknown>;
      ObjectUtils.copyValuesIfUndefined(dist, src);
      expect(dist).toEqual({ a: 1, b: 2 });
    });

    it('should recursively copy nested objects', () => {
      const dist = { nested: { a: 1 } } as any;
      const src = { nested: { a: 99, b: 2 } } as any;
      ObjectUtils.copyValuesIfUndefined(dist, src, true);
      expect(dist.nested).toEqual({ a: 1, b: 2 });
    });
  });

  describe('get', () => {
    it('should get nested value by dot path', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.get(obj, 'a.b.c')).toBe(42);
    });

    it('should get value by array path', () => {
      const obj = { a: { b: 1 } };
      expect(ObjectUtils.get(obj, ['a', 'b'])).toBe(1);
    });

    it('should return default value for missing path', () => {
      const obj = { a: 1 };
      expect(ObjectUtils.get(obj, 'b.c', 'default')).toBe('default');
    });

    it('should return default for null obj', () => {
      expect(ObjectUtils.get(null, 'a', 'def')).toBe('def');
    });
  });

  describe('set', () => {
    it('should set nested value', () => {
      const obj: any = { a: {} };
      ObjectUtils.set(obj, 'a.b', 42);
      expect(obj.a.b).toBe(42);
    });

    it('should create intermediate objects', () => {
      const obj: any = {};
      ObjectUtils.set(obj, 'a.b.c', 1);
      expect(obj.a.b.c).toBe(1);
    });

    it('should return false for invalid obj', () => {
      expect(ObjectUtils.set(null, 'a', 1)).toBe(false);
    });
  });

  describe('deepMerge', () => {
    it('should deep merge objects', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };
      const result = ObjectUtils.deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it('should concatenate arrays', () => {
      const target = { arr: [1, 2] };
      const source = { arr: [3, 4] };
      const result = ObjectUtils.deepMerge(target, source);
      expect(result.arr).toEqual([1, 2, 3, 4]);
    });

    it('should not mutate target', () => {
      const target = { a: 1 };
      const result = ObjectUtils.deepMerge(target, { b: 2 });
      expect(target).toEqual({ a: 1 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('toArray', () => {
    it('should convert object to key-value array', () => {
      const result = ObjectUtils.toArray({ a: 1, b: 2 });
      expect(result).toEqual([
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
      ]);
    });
  });

  describe('fromArray', () => {
    it('should convert array to object', () => {
      const arr = [{ id: 'a', name: 'Alice' }, { id: 'b', name: 'Bob' }];
      const result = ObjectUtils.fromArray(arr, 'id', 'name');
      expect(result).toEqual({ a: 'Alice', b: 'Bob' });
    });

    it('should use whole object when valueField not provided', () => {
      const arr = [{ id: 'a', name: 'Alice' }];
      const result = ObjectUtils.fromArray(arr, 'id');
      expect(result.a).toEqual({ id: 'a', name: 'Alice' });
    });
  });

  describe('forEach', () => {
    it('should iterate over object keys', () => {
      const obj = { a: 1, b: 2 };
      const entries: [string, number][] = [];
      ObjectUtils.forEach(obj, (key, value) => entries.push([key, value]));
      expect(entries).toEqual([['a', 1], ['b', 2]]);
    });
  });

  describe('filter', () => {
    it('should filter object properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = ObjectUtils.filter(obj, (_, value) => value > 1);
      expect(result).toEqual({ b: 2, c: 3 });
    });
  });

  describe('map', () => {
    it('should map object values', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.map(obj, (_, value) => value * 2);
      expect(result).toEqual({ a: 2, b: 4 });
    });
  });

  describe('values', () => {
    it('should return object values', () => {
      expect(ObjectUtils.values({ a: 1, b: 2 })).toEqual([1, 2]);
    });
  });

  describe('keys', () => {
    it('should return object keys', () => {
      expect(ObjectUtils.keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
    });
  });

  describe('hasKey', () => {
    it('should return true for existing key', () => {
      expect(ObjectUtils.hasKey({ a: 1 }, 'a')).toBe(true);
    });

    it('should return false for missing key', () => {
      expect(ObjectUtils.hasKey({ a: 1 }, 'b')).toBe(false);
    });

    it('should not detect prototype keys', () => {
      expect(ObjectUtils.hasKey({}, 'toString')).toBe(false);
    });
  });

  describe('hasPath', () => {
    it('should return true for existing path', () => {
      expect(ObjectUtils.hasPath({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(true);
    });

    it('should return false for missing path', () => {
      expect(ObjectUtils.hasPath({ a: { b: 1 } }, 'a.c')).toBe(false);
    });

    it('should accept array path', () => {
      expect(ObjectUtils.hasPath({ a: { b: 1 } }, ['a', 'b'])).toBe(true);
    });
  });

  describe('deletePath', () => {
    it('should delete nested path', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(ObjectUtils.deletePath(obj, 'a.b.c')).toBe(true);
      expect(obj.a.b).toEqual({});
    });

    it('should delete top-level key', () => {
      const obj: any = { a: 1, b: 2 };
      ObjectUtils.deletePath(obj, 'a');
      expect(obj).toEqual({ b: 2 });
    });

    it('should return false for invalid obj', () => {
      expect(ObjectUtils.deletePath(null, 'a')).toBe(false);
    });
  });

  describe('freeze', () => {
    it('should freeze object', () => {
      const obj = { a: 1 };
      const frozen = ObjectUtils.freeze(obj);
      expect(Object.isFrozen(frozen)).toBe(true);
    });
  });

  describe('seal', () => {
    it('should seal object', () => {
      const obj = { a: 1 };
      const sealed = ObjectUtils.seal(obj);
      expect(Object.isSealed(sealed)).toBe(true);
    });
  });

  describe('stringifyNoCircular', () => {
    it('should stringify normal object', () => {
      expect(ObjectUtils.stringifyNoCircular({ a: 1 })).toBe('{"a":1}');
    });

    it('should handle circular reference', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const result = ObjectUtils.stringifyNoCircular(obj);
      expect(result).toBe('{"a":1,"self":"[Circular]"}');
    });
  });
});
