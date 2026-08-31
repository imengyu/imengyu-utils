import { describe, it, expect } from 'vitest';
import ArrayUtils from '../ArrayUtils';

describe('ArrayUtils', () => {
  describe('remove', () => {
    it('should remove existing item', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.remove(arr, 2);
      expect(result).toBe(true);
      expect(arr).toEqual([1, 3]);
    });

    it('should return false for non-existing item', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.remove(arr, 4);
      expect(result).toBe(false);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('removeAt', () => {
    it('should remove item at valid index', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.removeAt(arr, 1);
      expect(result).toBe(true);
      expect(arr).toEqual([1, 3]);
    });

    it('should return false for out of bounds index', () => {
      const arr = [1, 2, 3];
      expect(ArrayUtils.removeAt(arr, -1)).toBe(false);
      expect(ArrayUtils.removeAt(arr, 3)).toBe(false);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('insert', () => {
    it('should insert at valid index', () => {
      const arr = [1, 2, 3];
      ArrayUtils.insert(arr, 1, 4);
      expect(arr).toEqual([1, 4, 2, 3]);
    });

    it('should append when index exceeds length', () => {
      const arr = [1, 2, 3];
      ArrayUtils.insert(arr, 10, 4);
      expect(arr).toEqual([1, 2, 3, 4]);
    });
  });

  describe('clear', () => {
    it('should clear the array and return removed elements', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.clear(arr);
      expect(result).toEqual([1, 2, 3]);
      expect(arr).toEqual([]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty array', () => {
      expect(ArrayUtils.isEmpty([])).toBe(true);
    });

    it('should return false for non-empty array', () => {
      expect(ArrayUtils.isEmpty([1, 2])).toBe(false);
    });
  });

  describe('addOnce', () => {
    it('should add new item', () => {
      const arr = [1, 2];
      const result = ArrayUtils.addOnce(arr, 3);
      expect(result).toBe(3);
      expect(arr).toEqual([1, 2, 3]);
    });

    it('should not add existing item', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.addOnce(arr, 2);
      expect(result).toBe(3);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('reInsertToArray', () => {
    it('should move item forward', () => {
      const arr = [1, 2, 3, 4];
      ArrayUtils.reInsertToArray(arr, 4, 1);
      expect(arr).toEqual([1, 4, 2, 3]);
    });

    it('should move item backward', () => {
      const arr = [1, 2, 3, 4];
      ArrayUtils.reInsertToArray(arr, 1, 3);
      expect(arr).toEqual([2, 3, 1, 4]);
    });

    it('should do nothing when index is same', () => {
      const arr = [1, 2, 3];
      ArrayUtils.reInsertToArray(arr, 2, 1);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('swapItems', () => {
    it('should swap two items', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.swapItems(arr, 0, 2);
      expect(result).toEqual([3, 2, 1]);
    });

    it('should return original array for invalid indices', () => {
      const arr = [1, 2, 3];
      expect(ArrayUtils.swapItems(arr, -1, 1)).toEqual([1, 2, 3]);
      expect(ArrayUtils.swapItems(arr, 1, 5)).toEqual([1, 2, 3]);
    });
  });

  describe('upData', () => {
    it('should move item up', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.upData(arr, 1);
      expect(result).toEqual([2, 1, 3]);
    });

    it('should not move first item', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.upData(arr, 0);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('downData', () => {
    it('should move item down', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.downData(arr, 1);
      expect(result).toEqual([1, 3, 2]);
    });

    it('should not move last item', () => {
      const arr = [1, 2, 3];
      const result = ArrayUtils.downData(arr, 2);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('isAllNullOrEmpty', () => {
    it('should return true for all null/empty', () => {
      expect(ArrayUtils.isAllNullOrEmpty([null, '', null])).toBe(true);
      expect(ArrayUtils.isAllNullOrEmpty(null as any)).toBe(true);
    });

    it('should return false if has non-empty value', () => {
      expect(ArrayUtils.isAllNullOrEmpty([null, 'test', ''])).toBe(false);
      expect(ArrayUtils.isAllNullOrEmpty([1, '', null])).toBe(false);
    });
  });

  describe('isContainsNullOrEmpty', () => {
    it('should return true if contains null/empty', () => {
      expect(ArrayUtils.isContainsNullOrEmpty([1, '', 3])).toBe(true);
      expect(ArrayUtils.isContainsNullOrEmpty([1, null, 3])).toBe(true);
    });

    it('should return false if no null/empty', () => {
      expect(ArrayUtils.isContainsNullOrEmpty([1, 'test', 3])).toBe(false);
      expect(ArrayUtils.isContainsNullOrEmpty(null as any)).toBe(false);
    });
  });

  describe('isEqual', () => {
    it('should return true for equal arrays', () => {
      expect(ArrayUtils.isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(ArrayUtils.isEqual([], [])).toBe(true);
      expect(ArrayUtils.isEqual(null, null)).toBe(true);
    });

    it('should return false for non-equal arrays', () => {
      expect(ArrayUtils.isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(ArrayUtils.isEqual([1, 2], [1, 3])).toBe(false);
      expect(ArrayUtils.isEqual([1, 2], null)).toBe(false);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      const result = ArrayUtils.unique([1, 2, 2, 3, 3, 3]);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key', () => {
      const arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      const result = ArrayUtils.uniqueBy(arr, 'id');
      expect(result).toEqual([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      const arr = [1, [2, [3, 4]], 5];
      const result = ArrayUtils.flatten(arr);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('filter', () => {
    it('should filter array', () => {
      const result = ArrayUtils.filter([1, 2, 3, 4], (x) => x > 2);
      expect(result).toEqual([3, 4]);
    });

    it('should return empty array for null/undefined', () => {
      expect(ArrayUtils.filter(null, (x) => (x as number) > 2)).toEqual([]);
      expect(ArrayUtils.filter(undefined, (x) => (x as number) > 2)).toEqual([]);
    });
  });

  describe('map', () => {
    it('should map array', () => {
      const result = ArrayUtils.map([1, 2, 3], (x) => x * 2);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should return empty array for null/undefined', () => {
      expect(ArrayUtils.map(null, (x) => (x as number) * 2)).toEqual([]);
      expect(ArrayUtils.map(undefined, (x) => (x as number) * 2)).toEqual([]);
    });
  });

  describe('find', () => {
    it('should find matching element', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = ArrayUtils.find(arr, (x) => x.id === 2);
      expect(result).toEqual({ id: 2 });
    });

    it('should return undefined for no match or null/undefined', () => {
      expect(ArrayUtils.find([1, 2, 3], (x) => (x as number) > 3)).toBe(undefined);
      expect(ArrayUtils.find(null, (x) => (x as number) > 2)).toBe(undefined);
    });
  });

  describe('findIndex', () => {
    it('should find index of matching element', () => {
      const arr = [10, 20, 30];
      const result = ArrayUtils.findIndex(arr, (x) => x === 20);
      expect(result).toBe(1);
    });

    it('should return -1 for no match or null/undefined', () => {
      expect(ArrayUtils.findIndex([1, 2, 3], (x) => x > 3)).toBe(-1);
      expect(ArrayUtils.findIndex(null, (x) => (x as number) > 2)).toBe(-1);
    });
  });

  describe('groupBy', () => {
    it('should group by key string', () => {
      const arr = [
        { category: 'a', value: 1 },
        { category: 'b', value: 2 },
        { category: 'a', value: 3 },
      ];
      const result = ArrayUtils.groupBy(arr, 'category');
      expect(result).toEqual({
        a: [{ category: 'a', value: 1 }, { category: 'a', value: 3 }],
        b: [{ category: 'b', value: 2 }],
      });
    });

    it('should group by key function', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = ArrayUtils.groupBy(arr, (x) => x % 2 === 0 ? 'even' : 'odd');
      expect(result).toEqual({
        odd: [1, 3, 5],
        even: [2, 4],
      });
    });
  });

  describe('shuffle', () => {
    it('should return array with same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = ArrayUtils.shuffle(arr);
      expect(result).toHaveLength(5);
      expect(result.sort()).toEqual(arr.sort());
    });
  });

  describe('max', () => {
    it('should return max value', () => {
      expect(ArrayUtils.max([1, 3, 2])).toBe(3);
    });
  });

  describe('min', () => {
    it('should return min value', () => {
      expect(ArrayUtils.min([1, 3, 2])).toBe(1);
    });
  });

  describe('sum', () => {
    it('should return sum', () => {
      expect(ArrayUtils.sum([1, 2, 3])).toBe(6);
    });
  });

  describe('average', () => {
    it('should return average', () => {
      expect(ArrayUtils.average([1, 2, 3])).toBe(2);
    });

    it('should return 0 for empty array', () => {
      expect(ArrayUtils.average([])).toBe(0);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      const result = ArrayUtils.chunk([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('merge', () => {
    it('should merge multiple arrays', () => {
      const result = ArrayUtils.merge([1, 2], [3, 4], [5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('intersection', () => {
    it('should return intersection', () => {
      const result = ArrayUtils.intersection([1, 2, 3], [2, 3, 4]);
      expect(result).toEqual([2, 3]);
    });
  });

  describe('union', () => {
    it('should return union', () => {
      const result = ArrayUtils.union([1, 2, 3], [3, 4, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('difference', () => {
    it('should return difference', () => {
      const result = ArrayUtils.difference([1, 2, 3], [2, 3, 4]);
      expect(result).toEqual([1]);
    });
  });

  describe('get', () => {
    it('should return element at index', () => {
      const arr = [1, 2, 3];
      expect(ArrayUtils.get(arr, 1)).toBe(2);
    });

    it('should return default value for invalid index', () => {
      const arr = [1, 2, 3];
      expect(ArrayUtils.get(arr, 5)).toBe(undefined);
      expect(ArrayUtils.get(arr, 5, 10)).toBe(10);
      expect(ArrayUtils.get(null, 0)).toBe(undefined);
      expect(ArrayUtils.get(undefined, 0, 'default')).toBe('default');
    });
  });
});