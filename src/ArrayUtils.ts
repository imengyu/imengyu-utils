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
 * @returns 
 */
function clear<T>(array: T[]) {
  return array.splice(0, array.length);
}
/**
 * 检查数组是否为空
 * @param array 
 * @returns 
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
 * @param {Array} arr 数组
 * @param {Number} index1 索引1
 * @param {Number} index2 索引2
 */
function swapItems(arr : Array<any>, index1 : number, index2: number) {
  arr[index1] = arr.splice(index2,1,arr[index1])[0];
  /*
  let x = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = x;
  */
  return arr;
}
/**
 * 指定数组索引位置元素向上移
 * @param {Array} arr 数组
 * @param {Number} index 索引
 */
function upData (arr : Array<any>, index : number) {
  if (arr.length > 1 && index !== 0)
    return swapItems(arr, index, index - 1);
  return arr;
}
/**
 * 指定数组索引位置元素向下移
 * @param {Array} arr 数组
 * @param {Number} index 索引
 */
function downData (arr : Array<any>, index : number) {
  if (arr.length > 1 && index !== (arr.length - 1))
    return swapItems(arr, index, index + 1)
  return arr;
}
/**
 * 检查数组中是否全部是空字符串或null
 * @param arr 要检查的数组
 * @returns 
 */
function isAllNullOrEmpty(arr : Array<unknown>) : boolean {
  if(!arr)
    return true;
  for (let i = arr.length - 1; i >= 0; i--) {
    if(arr[i] !== null && arr[i] !== "") {
      return false;
    }
  }
  return true;
}
/**
 * 检查数组中是否有空值或空字符串
 * @param arr 要检查的数组
 * @returns 
 */
function isContainsNullOrEmpty(arr : Array<unknown>) : boolean {
  if(!arr)
    return false;
  for (let i = arr.length - 1; i >= 0; i--) {
    if(StringUtils.isNullOrEmpty(arr[i] as string)) {
      return true;
    }
  }
  return false;
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
};

export default ArrayUtils;
