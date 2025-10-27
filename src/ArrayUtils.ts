import StringUtils from "./StringUtils";

/**
 * 移除数组中指定的条目
 * @param array 数组
 * @param item 要移除的条目
 * @returns 返回此条目在数组中是否存在
 */
function remove<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
    return true;
  }
  return false;
}
/**
 * 移除数组中指定索引的条目
 * @param array 数组
 * @param index 索引
 * @returns 返回此索引是否超出数组的范围
 */
function removeAt<T>(array: T[], index: number) {
  if (index >= 0 && index < array.length) {
    array.splice(index, 1);
    return true;
  }
  return false;
}
/**
 * 向数组中指定索引位置插入条目
 * @param array 数组
 * @param i 位置
 * @param item 要插入的条目
 */
function insert<T>(array: T[], i: number, item: T) {
  if (i > array.length) {
    array.push(item);
  }
  else {
    array.splice(i, 0, item);
  }
}
/**
 * 清空数组
 * @param array 数组
 * @returns 返回被清空的元素数组
 */
function clear<T>(array: T[]) {
  return array.splice(0, array.length);
}
/**
 * 检查数组是否为空
 * @param array 要检查的数组
 * @returns 数组是否为空
 */
function isEmpty(array: unknown[]) {
  return array.length === 0;
}
/**
 * 向指定数组中最多添加一个相同的条目
 * @param array 数组
 * @param item 条目
 * @returns 返回数组的新长度
 */
function addOnce<T>(array: T[], item: T) {
  if (array.indexOf(item) >= 0) return array.length;
  else return array.push(item);
}

/**
 * 将数组中某个条目重新插入数组指定索引位置，此函数适用于拖拽的场景中，
 * 此函数会自动计算移除条目之后的索引，并将其插入到指定位置中。
 * @param array 数组
 * @param item 条目
 * @param index 新的索引
 */
function reInsertToArray(array: any[], item: any, index: number) {
  const oldIndex = array.indexOf(item);
  if (oldIndex < index) {
    removeAt(array, oldIndex);
    insert(array, index - 1, item);
  } else if (oldIndex > index) {
    removeAt(array, oldIndex);
    insert(array, index, item);
  }
}


/**
 * 交换数组两个元素
 * @param arr 数组
 * @param index1 索引1
 * @param index2 索引2
 * @returns 交换后的数组
 */
function swapItems<T>(arr: T[], index1: number, index2: number) {
  if (index1 >= 0 && index2 >= 0 && index1 < arr.length && index2 < arr.length) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  }
  return arr;
}
/**
 * 指定数组索引位置元素向上移
 * @param arr 数组
 * @param index 索引
 * @returns 移动后的数组
 */
function upData<T>(arr: T[], index: number) {
  if (arr.length > 1 && index !== 0) {
    return swapItems(arr, index, index - 1);
  }
  return arr;
}
/**
 * 指定数组索引位置元素向下移
 * @param arr 数组
 * @param index 索引
 * @returns 移动后的数组
 */
function downData<T>(arr: T[], index: number) {
  if (arr.length > 1 && index !== arr.length - 1) {
    return swapItems(arr, index, index + 1);
  }
  return arr;
}
/**
 * 检查数组中是否全部是空字符串或null
 * @param arr 要检查的数组
 * @returns 是否全部为空
 */
function isAllNullOrEmpty(arr: Array<unknown>): boolean {
  if (!arr) {
    return true;
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] !== null && arr[i] !== "") {
      return false;
    }
  }
  return true;
}
/**
 * 检查数组中是否有空值或空字符串
 * @param arr 要检查的数组
 * @returns 是否包含空值
 */
function isContainsNullOrEmpty(arr: Array<unknown>): boolean {
  if (!arr) {
    return false;
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    if (StringUtils.isNullOrEmpty(arr[i] as string)) {
      return true;
    }
  }
  return false;
}

/**
 * 检查数组是否相等，长度一致，内部元素一致
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 两个数组是否相等
 */
function isEqual(arr1: Array<unknown>, arr2: Array<unknown>): boolean {
  if (!arr1 && !arr2) {
    return true;
  }
  if (!arr1 || !arr2) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = arr1.length - 1; i >= 0; i--) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * 数组去重
 * @param arr 要去重的数组
 * @returns 去重后的新数组
 */
function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 数组去重（基于指定的键）
 * @param arr 要去重的数组
 * @param key 用于判断重复的键
 * @returns 去重后的新数组
 */
function uniqueBy<T extends Record<string, any>>(arr: T[], key: string): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
}

/**
 * 数组扁平化
 * @param arr 要扁平化的数组
 * @param depth 扁平化的深度，默认为1
 * @returns 扁平化后的新数组
 */
function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce((acc: T[], val) => 
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), 
    []
  ) as T[];
}

/**
 * 安全的数组过滤，处理undefined或null的情况
 * @param arr 要过滤的数组
 * @param callback 过滤函数
 * @returns 过滤后的新数组
 */
function filter<T>(arr: T[] | null | undefined, callback: (item: T, index: number, array: T[]) => boolean): T[] {
  if (!arr) {
    return [];
  }
  return arr.filter(callback);
}

/**
 * 安全的数组映射，处理undefined或null的情况
 * @param arr 要映射的数组
 * @param callback 映射函数
 * @returns 映射后的新数组
 */
function map<T, U>(arr: T[] | null | undefined, callback: (item: T, index: number, array: T[]) => U): U[] {
  if (!arr) {
    return [];
  }
  return arr.map(callback);
}

/**
 * 查找数组中的第一个匹配元素
 * @param arr 要查找的数组
 * @param callback 查找函数
 * @returns 找到的元素或undefined
 */
function find<T>(arr: T[] | null | undefined, callback: (item: T, index: number, array: T[]) => boolean): T | undefined {
  if (!arr) {
    return undefined;
  }
  return arr.find(callback);
}

/**
 * 查找数组中第一个匹配元素的索引
 * @param arr 要查找的数组
 * @param callback 查找函数
 * @returns 找到的索引或-1
 */
function findIndex<T>(arr: T[] | null | undefined, callback: (item: T, index: number, array: T[]) => boolean): number {
  if (!arr) {
    return -1;
  }
  return arr.findIndex(callback);
}

/**
 * 数组分组
 * @param arr 要分组的数组
 * @param key 分组的键或函数
 * @returns 分组后的对象
 */
function groupBy<T>(arr: T[], key: string | ((item: T) => string)): Record<string, T[]> {
  return arr.reduce((acc: Record<string, T[]>, item) => {
    const groupKey = typeof key === 'function' ? key(item) : (item as any)[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
}

/**
 * 数组洗牌（随机排序）
 * @param arr 要洗牌的数组
 * @returns 洗牌后的新数组
 */
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 获取数组中的最大值
 * @param arr 数字数组
 * @returns 最大值
 */
function max(arr: number[]): number {
  return Math.max(...arr);
}

/**
 * 获取数组中的最小值
 * @param arr 数字数组
 * @returns 最小值
 */
function min(arr: number[]): number {
  return Math.min(...arr);
}

/**
 * 数组求和
 * @param arr 数字数组
 * @returns 总和
 */
function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

/**
 * 数组平均值
 * @param arr 数字数组
 * @returns 平均值
 */
function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * 将数组分割成指定大小的多个子数组
 * @param arr 要分割的数组
 * @param size 每个子数组的大小
 * @returns 分割后的二维数组
 */
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * 合并多个数组
 * @param arrs 要合并的数组列表
 * @returns 合并后的新数组
 */
function merge<T>(...arrs: T[][]): T[] {
  return arrs.reduce((acc, val) => acc.concat(val), []);
}

/**
 * 数组交集
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @returns 两个数组的交集
 */
function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set = new Set(arr2);
  return arr1.filter(item => set.has(item));
}

/**
 * 数组并集
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @returns 两个数组的并集
 */
function union<T>(arr1: T[], arr2: T[]): T[] {
  return [...new Set([...arr1, ...arr2])];
}

/**
 * 数组差集（arr1 - arr2）
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @returns 两个数组的差集
 */
function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set = new Set(arr2);
  return arr1.filter(item => !set.has(item));
}

/**
 * 安全地获取数组元素
 * @param arr 数组
 * @param index 索引
 * @param defaultValue 默认值
 * @returns 获取到的元素或默认值
 */
function get<T>(arr: T[] | null | undefined, index: number, defaultValue?: T): T | undefined {
  if (!arr || index < 0 || index >= arr.length) {
    return defaultValue;
  }
  return arr[index];
}

/**
 * 数组工具类
 */
const ArrayUtils = {
  addOnce,
  isEmpty,
  clear,
  insert,
  removeAt,
  remove,
  reInsertToArray,
  swapItems,
  upData,
  downData,
  isAllNullOrEmpty,
  isContainsNullOrEmpty,
  isEqual,
  unique,
  uniqueBy,
  flatten,
  filter,
  map,
  find,
  findIndex,
  groupBy,
  shuffle,
  max,
  min,
  sum,
  average,
  chunk,
  merge,
  intersection,
  union,
  difference,
  get,
};

export default ArrayUtils;
