/**
 * 对象操作工具函数
 */

/**
 * 深克隆对象，数组
 * @param obj 要克隆的对象
 * @param cloneConfig 克隆配置
 * @returns 克隆后的新对象
 */
function clone<T extends object>(obj: T, cloneConfig?: {
  /**
   * 是否要深度克隆数组里的每个对象，默认 true
   */
  deepArray?: boolean,
  /**
   * 是否克隆函数，默认 true
   */
  cloneFunction?: boolean,
}): T {
  const deepArray = cloneConfig?.deepArray ?? true;
  const cloneFunction = cloneConfig?.cloneFunction ?? true;
  let temp: object|Array<object>|null = null;

  if (obj instanceof Array) 
  {
    if (deepArray ?? true)
      temp = (obj as object[]).map((item) => clone(item, cloneConfig));
    else
      temp = obj.concat() as Array<object>;
  }
  else if (typeof obj === 'object') 
  {
    temp = {} as Record<string, any>;
    const _obj = obj as Record<string, any>;
    const _temp = temp as Record<string, any>;
    for (const item in _obj) {
      if (Object.prototype.hasOwnProperty.call(_obj, item)) {
        const val = _obj[item];
        if (val === null) {
          _temp[item] = null;
        } else {
          _temp[item] = clone(val, cloneConfig);
        }
      }
    }
  } else if (typeof obj === 'function') {
    return cloneFunction ? obj : undefined as unknown as T;
  } else {
    temp = obj as unknown as object;
  }
  return temp as unknown as T;
}

/**
 * 简单克隆一个对象，不递归克隆数组或对象的属性
 * @param obj 要克隆的对象
 * @returns 克隆后的新对象
 */
function simpleClone<T>(obj: T): T {
  let temp: object | null = null;
  if (obj instanceof Array) {
    temp = obj.concat();
  } else if (typeof obj === 'object' && obj !== null) {
    temp = {};
    for (const item in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, item)) {
        const val = (obj as unknown as Record<string, any>)[item];
        if (val === null) {
          (temp as Record<string, any>)[item] = null;
        } else {
          (temp as Record<string, any>)[item] = simpleClone(val);
        }
      }
    }
  } else {
    temp = obj as any;
  }
  return temp as unknown as T;
}

/**
 * 递归删除对象所有的 undefined 字段
 * @param srcObject 源对象
 * @param recursive 递归？，默认 true
 */
function deleteAllUndefined(srcObject: Record<string, unknown>, recursive = true): void {
  for (const key in srcObject) {
    if (Object.prototype.hasOwnProperty.call(srcObject, key)) {
      if (srcObject[key] === undefined) {
        delete srcObject[key];
      } else if (recursive && typeof srcObject[key] === 'object' && srcObject[key] !== null) {
        // 修复递归调用中的参数传递错误
        deleteAllUndefined(srcObject[key] as Record<string, unknown>, recursive);
      }
    }
  }
}

/**
 * 浅克隆一个对象的所有属性至另一个对象上，此函数会更改原有对象（targetObject）
 * @param srcObject 源对象
 * @param targetObject 目标对象
 * @param cloneConfig 克隆配置
 */
function cloneValuesToObject(
  srcObject: unknown, 
  targetObject: unknown, 
  cloneConfig?: { 
    /**
     * 忽略指定的键值，在此数组中的键值不会被克隆。
     * 可以为函数回调，函数参数中传入键值，返回true则键值不会被克隆。
     */
    ignoreKeys?: string[] | ((key: string) => boolean) | undefined, 
    /**
     * 筛选指定的键值，如果为空，则不筛选。
     * 可以为函数回调，函数参数中传入键值，返回true则键值会被克隆。
     */
    filterKeys?: string[] | ((key: string) => boolean) | undefined
  }
): void {
  const filterKeys = cloneConfig?.filterKeys;
  const ignoreKeys = cloneConfig?.ignoreKeys;

  if (typeof srcObject !== 'object' || srcObject === null) {
    throw new Error("srcObject 不是一个有效的对象");
  }
  if (typeof targetObject !== 'object' || targetObject === null) {
    throw new Error("targetObject 不是一个有效的对象");
  }
  
  for (const key in srcObject) {
    if (Object.prototype.hasOwnProperty.call(srcObject, key)) {
      // 应用键筛选
      if (filterKeys) {
        const shouldFilter = typeof filterKeys === 'function' 
          ? !filterKeys(key) 
          : !filterKeys.includes(key);
        if (shouldFilter) {
          continue;
        }
      }
      
      // 应用键忽略
      if (ignoreKeys) {
        const shouldIgnore = typeof ignoreKeys === 'function' 
          ? ignoreKeys(key) 
          : ignoreKeys.includes(key);
        if (shouldIgnore) {
          continue;
        }
      }
      
      (targetObject as Record<string, unknown>)[key] = (srcObject as Record<string, unknown>)[key]; 
    }
  }
}

/**
 * 对两个对象进行深比较
 * @param obj1 要比较的对象1
 * @param obj2 要比较的对象2
 * @returns 是否相等
 */
function equalsObject(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }
  
  // 检查类型一致性
  if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
    return false;
  }
  
  // 处理基本类型
  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }
  
  // 处理函数
  if (typeof obj1 === 'function') {
    return obj1.toString() === obj2.toString();
  }
  
  // 处理数组
  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2)) return false;
    if (obj1.length !== obj2.length) return false;
    return obj1.every((value, index) => equalsObject(value, obj2[index]));
  }
  
  // 处理普通对象
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  return keys1.every(key => {
    if (!keys2.includes(key)) return false;
    return equalsObject(obj1[key], obj2[key]);
  });
}

/**
 * 对两个对象进行浅比较(比较1级)
 * @param obj1 要比较的对象1
 * @param obj2 要比较的对象2
 * @returns 是否相等
 */
function equalsObjectOneLevel(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (obj1[key] !== obj2[key]) return false;
    }
  }
  
  return true;
}

/**
 * 合并两个对象（浅合并）
 * 
 * **此函数已经被ES6的 `...` (解构赋值) 运算符代替了，保留是为了兼容旧应用。**
 * 
 * @param obj1 目标对象
 * @param obj2 源对象
 * @returns 合并后的对象
 */
function mergeObject(obj1: Record<string, unknown>, obj2: Record<string, unknown>): Record<string, unknown> {
  for (const k in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, k)) {
      obj1[k] = obj2[k];
    }
  }
  return obj1;
}

/**
 * 合并多个对象（浅合并）
 * 
 * **此函数已经被ES6的 `...` (解构赋值) 运算符代替了，保留是为了兼容旧应用。**
 * 
 * @param objs 要合并的对象列表
 * @returns 合并后的对象
 */
function mergeObjects(...objs: Record<string, unknown>[]): Record<string, unknown> {
  if (objs.length < 2) {
    throw new Error("必须提供至少两个参数");
  }
  
  const o = objs[0];
  for (let i = 1; i < objs.length; i++) {
    mergeObject(o, objs[i]);
  }
  return o;
}

/**
 * 检查是否定义
 * @param obj 要检查的值
 * @returns 是否已定义
 */
function isDefined(obj: unknown): boolean {
  return typeof obj !== 'undefined';
}

/**
 * 判断是否定义并且不为 `null`
 * @param v 要判断的数值
 * @returns 是否已定义且不为null
 */
function isDefinedAndNotNull(v: unknown): boolean {
  return v != null;
}

/**
 * 判断一个对象的子属性是否全部为空
 * @param object 要判断的对象
 * @returns 是否所有属性都为空
 */
function isObjectAllKeyNull(object: Record<string, unknown>): boolean {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (object[key]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 从源对象中拷贝目标对象没有的字段数据
 * @param dist 目标对象
 * @param src 源对象
 * @param recursive 是否递归子对象，默认false
 * @returns 目标对象
 */
function copyValuesIfUndefined<T extends Record<string, unknown>>(dist: T, src: T, recursive = false): T {
  for (const key in src) {
    if (Object.prototype.hasOwnProperty.call(src, key)) {
      if (typeof dist[key] === 'undefined') {
        dist[key] = src[key];
      } else if (recursive && 
                typeof dist[key] === 'object' && 
                dist[key] !== null && 
                typeof src[key] === 'object' && 
                src[key] !== null &&
                !Array.isArray(dist[key]) &&
                !Array.isArray(src[key])) {
        copyValuesIfUndefined(dist[key] as any, src[key] as any, recursive);
      }
    }
  }
  return dist;
}

/**
 * 安全地获取对象属性值，如果路径不存在则返回默认值
 * @param obj 目标对象
 * @param path 属性路径，可以是点分隔的字符串或数组
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
function get<T = any>(obj: any, path: string | string[], defaultValue?: T): T | undefined {
  if (!obj || !path) {
    return defaultValue;
  }
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let result: any = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * 安全地设置对象属性值
 * @param obj 目标对象
 * @param path 属性路径，可以是点分隔的字符串或数组
 * @param value 要设置的值
 * @returns 是否设置成功
 */
function set<T>(obj: any, path: string | string[], value: T): boolean {
  if (!obj || !path || typeof obj !== 'object') {
    return false;
  }
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let current: any = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined) {
      current[key] = {};
    } else if (typeof current[key] !== 'object') {
      return false;
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return true;
}

/**
 * 深度合并两个对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
function deepMerge<T extends object>(target: T, source: object): T {
  const output = { ...target };
  
  if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
    return output;
  }
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = (source as any)[key];
      const targetValue = (output as any)[key];
      
      if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        (output as any)[key] = [...targetValue, ...sourceValue];
      } else if (sourceValue !== null && typeof sourceValue === 'object' && targetValue !== null && typeof targetValue === 'object') {
        (output as any)[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        (output as any)[key] = sourceValue;
      }
    }
  }
  
  return output as T;
}

/**
 * 将对象转换为数组，每个元素包含key和value
 * @param obj 要转换的对象
 * @returns 转换后的数组
 */
function toArray<T>(obj: Record<string, T>): { key: string; value: T }[] {
  return Object.keys(obj).map(key => ({ key, value: obj[key] }));
}

/**
 * 将数组转换为对象
 * @param arr 要转换的数组
 * @param keyField 用作键的字段名
 * @param valueField 用作值的字段名，如果不提供则使用整个对象
 * @returns 转换后的对象
 */
function fromArray<T extends Record<string, any>, K extends keyof T>(arr: T[], keyField: K, valueField?: keyof T): Record<string, any> {
  return arr.reduce((obj, item) => {
    const key = item[keyField];
    obj[key] = valueField ? item[valueField] : item;
    return obj;
  }, {} as Record<string, any>);
}

/**
 * 遍历对象的所有键值对
 * @param obj 要遍历的对象
 * @param callback 回调函数，接收(key, value)参数
 */
function forEach<T>(obj: Record<string, T>, callback: (key: string, value: T) => void): void {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      callback(key, obj[key]);
    }
  }
}

/**
 * 过滤对象的属性
 * @param obj 要过滤的对象
 * @param predicate 过滤函数，返回true的属性将被保留
 * @returns 过滤后的新对象
 */
function filter<T extends Record<string, any>>(obj: T, predicate: (key: string, value: any) => boolean): Partial<T> {
  const result: Partial<T> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(key, obj[key])) {
      result[key] = obj[key];
    }
  }
  
  return result;
}

/**
 * 映射对象的属性
 * @param obj 要映射的对象
 * @param mapper 映射函数，返回新的属性值
 * @returns 映射后的新对象
 */
function map<T extends Record<string, any>, U>(obj: T, mapper: (key: string, value: any) => U): Record<string, U> {
  const result: Record<string, U> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = mapper(key, obj[key]);
    }
  }
  
  return result;
}

/**
 * 获取对象的所有值
 * @param obj 目标对象
 * @returns 值数组
 */
function values<T>(obj: Record<string, T>): T[] {
  return Object.values(obj);
}

/**
 * 获取对象的所有键
 * @param obj 目标对象
 * @returns 键数组
 */
function keys(obj: object): string[] {
  return Object.keys(obj);
}

/**
 * 检查对象是否包含指定的键
 * @param obj 目标对象
 * @param key 要检查的键
 * @returns 是否包含该键
 */
function hasKey(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 检查对象是否包含指定的路径
 * @param obj 目标对象
 * @param path 属性路径
 * @returns 是否包含该路径
 */
function hasPath(obj: any, path: string | string[]): boolean {
  if (!obj || !path) {
    return false;
  }
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object' || !hasKey(current, key)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

/**
 * 删除对象的指定路径
 * @param obj 目标对象
 * @param path 属性路径, 支持点号分隔或数组形式
 * @returns 是否删除成功
 */
function deletePath(obj: any, path: string | string[]): boolean {
  if (!obj || !path || typeof obj !== 'object') {
    return false;
  }
  
  const keys = Array.isArray(path) ? path : path.split('.');
  
  if (keys.length === 1) {
    return delete obj[keys[0]];
  }
  
  let current: any = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!hasKey(current, key)) {
      return false;
    }
    current = current[key];
  }
  
  return delete current[keys[keys.length - 1]];
}

/**
 * 冻结对象，使其不可变
 * @param obj 要冻结的对象
 * @returns 冻结后的对象
 */
function freeze<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}

/**
 * 密封对象，使其不能添加新属性，但已有属性可以修改
 * @param obj 要密封的对象
 * @returns 密封后的对象
 */
function seal<T extends object>(obj: T): T {
  return Object.seal(obj);
}

/**
 * 检查对象是否为空（null、undefined或空字符串）
 * @param obj 要检查的对象
 * @returns 是否为空
 */
function isNullOrEmpty(obj: any): boolean {
  return obj === null || obj === undefined || obj === '';
}

/**
 * 对象工具类
 */
const ObjectUtils = {
  clone,
  simpleClone,
  copyValuesIfUndefined,
  cloneValuesToObject,
  deleteAllUndefined,
  isDefined,
  isDefinedAndNotNull,
  isObjectAllKeyNull,
  isNullOrEmpty,
  equalsObject,
  equalsObjectOneLevel,
  mergeObject,
  mergeObjects,
  get,
  set,
  deepMerge,
  toArray,
  fromArray,
  forEach,
  filter,
  map,
  values,
  keys,
  hasKey,
  hasPath,
  deletePath,
  freeze,
  seal,
};

export default ObjectUtils;
