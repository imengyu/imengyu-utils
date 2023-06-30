/**
 * 深克隆对象，数组
 * @param obj 要克隆的对象
 * @param deepArray 是否要深度克隆数组里的每个对象
 */
function clone<T extends object>(obj: T, deepArray = false): T {
  let temp: object|Array<object>|null = null;
  if (obj instanceof Array) 
  {
    if (deepArray)
      temp = (obj as object[]).map((item) => clone(item, deepArray));
    else
      temp = obj.concat() as Array<object>;
  }
  else if (typeof obj === 'object') 
  {
    temp = {} as Record<string, any>;
    const _obj = obj as Record<string, any>;
    const _temp = temp as Record<string, any>;
    for (const item in obj) {
      const val = _obj[item];
      if (val === null) { _temp[item] = null; }
      else if (val) { _temp[item] = clone(val, deepArray); }
    }
  } 
  else 
  {
    temp = obj as unknown as object;
  }
  return temp as unknown as T;
}

/**
 * 对两个对象进行深比较
 * @param obj1 要比较的对象
 * @param obj 要比较的另外一个对象
 */
function equalsObject(obj1: any, obj: any) {
  let p;
  if (obj1 === obj) {
    return true;
  }
  // some checks for native types first
  // function and sring
  if (
    typeof obj1 === "function" ||
    typeof obj1 === "string" ||
    obj1 instanceof String
  ) {
    return obj1.toString() === obj.toString();
  }
  // number
  if (obj1 instanceof Number || typeof obj1 === "number") {
    if (obj instanceof Number || typeof obj === "number") {
      return obj1.valueOf() === obj.valueOf();
    }
    return false;
  }
  // equalsObject(null,null) and equalsObject(undefined,undefined) do not inherit from the
  // Object.prototype so we can return false when they are passed as obj
  if (
    typeof obj1 !== typeof obj ||
    obj === null ||
    typeof obj === "undefined"
  ) {
    return false;
  }
  function sort(o: any) {
    const result: any = {};

    if (typeof o !== "object") {
      return o;
    }

    Object.keys(o)
      .sort()
      .forEach(function(key) {
        result[key] = sort(o[key]);
      });

    return result;
  }
  if (typeof obj1 === "object") {
    if (Array.isArray(obj1)) {
      // check on arrays
      return JSON.stringify(obj1) === JSON.stringify(obj);
    } else {
      // anyway objects
      for (p in obj1) {
        if (typeof obj1[p] !== typeof obj[p]) {
          return false;
        }
        if ((obj1[p] === null) !== (obj[p] === null)) {
          return false;
        }
        switch (typeof obj1[p]) {
          case "undefined":
            if (typeof obj[p] !== "undefined") {
              return false;
            }
            break;
          case "object":
            if (
              obj1[p] !== null &&
              obj[p] !== null &&
              (obj1[p].constructor.toString() !==
                obj[p].constructor.toString() ||
                !equalsObject(obj1[p], obj[p]))
            ) {
              return false;
            }
            break;
          case "function":
            if (obj1[p].toString() !== obj[p].toString()) {
              return false;
            }
            break;
          default:
            if (obj1[p] !== obj[p]) {
              return false;
            }
        }
      }
    }
  }
  // at least check them with JSON
  return JSON.stringify(sort(obj1)) === JSON.stringify(sort(obj));
}
/**
 * 对两个对象进行浅深比较(比较1级)
 * @param obj1 要比较的对象
 * @param obj 要比较的另外一个对象
 */
function equalsObjectOneLevel(obj1: any, obj2: any) {
  if (obj1 !== obj2) return false;
  if (typeof obj1 === "object") {
    for (const key in obj1) {
      if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  } else {
    return obj1 === obj2;
  }
}
/**
 * 合并两个对象
 * 
 * **此函数已经被ES6的 `...` (解构赋值) 运算符代替了，保留是为了兼容旧应用。**
 * 
 * @param obj1 
 * @param obj2 
 */
function mergeObject(obj1 : Record<string, unknown>, obj2 : Record<string, unknown>) : Record<string, unknown> { 
  for(const k in obj2)
    obj1[k] = obj2[k];
  return obj1;
}
/**
 * 合并多个对象。
 * 
 * **此函数已经被ES6的 `...` (解构赋值) 运算符代替了，保留是为了兼容旧应用。**
 * 
 * @param objs
 */
function mergeObjects(...objs : Record<string, unknown>[]) : Record<string, unknown> { 
  if(objs.length < 2) 
    throw new Error("must provide at least two parameters") ;
  const o = objs[0];
  for(let i = objs.length - 1; i > 0; i--)
    mergeObject(o, objs[i]);
  return o;
}

/**
 * 检查是否定义
 * @param obj 
 */
function isDefined(obj: unknown) : boolean {
  return typeof obj !== 'undefined';
}
/**
 * 判断是否定义并且不为 `null`
 * @param v 要判断的数值
 */
function isDefinedAndNotNull(v: unknown) : boolean {
  return v != null && typeof v != 'undefined';
}
/**
 * 判断一个对象的子属性是否全部为空
 * @param v 要判断的对象
 */
function isObjectAllKeyNull(object: Record<string, unknown>) : boolean {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (!object[key])
        return false;
    }
  }
  return true;
}

/**
 * 对象操作工具函数
 */
const ObjectUtils = {
  clone,
  isDefined,
  isDefinedAndNotNull,
  isObjectAllKeyNull,
  equalsObject,
  equalsObjectOneLevel,
  mergeObject,
  mergeObjects,
};

export default ObjectUtils;
