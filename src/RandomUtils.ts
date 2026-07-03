/**
 * 随机数和随机数据生成工具类
 */

import StringConv from "./StringConv";

// 自增ID池
let idPool = 0;

/**
 * 生成指定范围之内（`[minNum,maxNum]`）的随机数
 * @param minNum 最小值
 * @param maxNum 最大值
 * @param demicalCount 指定生成的小数位数
 * @returns 生成的随机数
 */
function genRandom(minNum: number, maxNum: number, demicalCount = 0): number {
  // 参数验证
  if (minNum > maxNum) {
    [minNum, maxNum] = [maxNum, minNum]; // 交换值确保 minNum <= maxNum
  }
  
  if (demicalCount > 0) {
    const multiplier = Math.pow(10, demicalCount);
    minNum *= multiplier;
    maxNum *= multiplier;
    const result = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    return result / multiplier;
  }
  
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}

/**
 * 生成不重复随机字符串。使用当前日期作为前缀防止重复。
 * @param randomLength 字符长度
 * @returns 生成的不重复随机字符串
 */
function genNonDuplicateID(randomLength: number): string {
  // 确保参数有效
  if (randomLength <= 0) randomLength = 8;
  
  let idStr = Date.now().toString(36);
  idStr += Math.random().toString(36).substring(3, 3 + randomLength);
  return idStr;
}

/**
 * 生成不重复随机字符串(十六进制)
 * @param randomLength 字符长度
 * @returns 生成的十六进制随机字符串
 */
function genNonDuplicateIDHEX(randomLength: number): string {
  // 确保参数有效
  if (randomLength <= 0) randomLength = 8;
  
  const idStr = genNonDuplicateID(randomLength);
  return StringConv.strToHexCharCode(idStr, false).substring(0, randomLength);
}

/**
 * 生成自增的数字。要设置自增开始值，请使用 `setAutoincrementNumberValue`
 * @returns 下一个自增数字
 */
function genAutoincrementNumber(): number {
  if (idPool < Number.MAX_SAFE_INTEGER - 1) {
    return ++idPool;
  }
  // 重置为0以避免溢出
  idPool = 0;
  return idPool;
}

/**
 * 设置自增开始值
 * @param value 起始值
 */
function setAutoincrementNumberValue(value: number): void {
  if (Number.isSafeInteger(value) && value >= 0) {
    idPool = value;
  }
}

/**
 * 生成随机字符串
 * @param len 随机字符串长度
 * @returns 生成的随机字符串
 */
function randomString(len?: number): string {
  len = len || 32;
  // 使用容易区分的字符集（排除容易混淆的字符如I,l,0,O等）
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let result = '';
  
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  
  return result;
}

/**
 * 生成随机数字字符串
 * @param len 随机字符串长度
 * @returns 生成的随机数字字符串
 */
function randomNumberString(len?: number): string {
  len = len || 32;
  const chars = '0123456789';
  const maxPos = chars.length;
  let result = '';
  
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  
  return result;
}

/**
 * 从数组中随机选择一个元素
 * @param array 源数组
 * @returns 随机选择的元素或undefined（数组为空时）
 */
function randomChoice<T>(array: T[]): T | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }
  
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * 从数组中随机选择多个不重复的元素
 * @param array 源数组
 * @param count 选择的元素数量
 * @returns 包含随机选择元素的新数组
 */
function randomSample<T>(array: T[], count: number): T[] {
  if (!array || array.length === 0 || count <= 0) {
    return [];
  }
  
  // 如果请求的数量大于数组长度，返回数组的随机排序
  if (count >= array.length) {
    return shuffle(array);
  }
  
  // 使用Fisher-Yates洗牌算法的变种来高效地获取不重复的随机元素
  const result: T[] = [];
  const pool = [...array]; // 创建副本以避免修改原数组
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    // 从池中移除已选择的元素
    pool.splice(index, 1);
  }
  
  return result;
}

/**
 * 打乱数组元素顺序（Fisher-Yates 洗牌算法）
 * @param array 要打乱的数组
 * @returns 打乱后的新数组
 */
function shuffle<T>(array: T[]): T[] {
  if (!array) return [];
  
  // 创建副本以避免修改原数组
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // 交换元素
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

/**
 * 生成随机布尔值
 * @param probability 生成true的概率(0-1)，默认为0.5
 * @returns 随机布尔值
 */
function randomBoolean(probability = 0.5): boolean {
  // 确保概率在有效范围内
  probability = Math.max(0, Math.min(1, probability));
  return Math.random() < probability;
}

/**
 * 生成指定范围内的随机浮点数
 * @param min 最小值（包含）
 * @param max 最大值（不包含）
 * @returns 随机浮点数
 */
function randomFloat(min: number, max: number): number {
  // 交换值确保 min < max
  if (min > max) {
    [min, max] = [max, min];
  }
  
  return Math.random() * (max - min) + min;
}

/**
 * 生成随机日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 随机日期
 */
function randomDate(startDate: Date, endDate: Date): Date {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  
  // 交换值确保 startTime <= endTime
  const minTime = Math.min(startTime, endTime);
  const maxTime = Math.max(startTime, endTime);
  
  const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
  return new Date(randomTime);
}

/**
 * 生成随机邮箱地址
 * @param domain 自定义域名，默认为随机生成
 * @returns 随机邮箱地址
 */
function randomEmail(domain?: string): string {
  const username = randomString(8);
  
  if (!domain) {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    domain = randomChoice(domains) || 'example.com';
  }
  
  return `${username}@${domain}`;
}

/**
 * 生成随机手机号（中国大陆手机号格式）
 * @returns 随机手机号
 */
function randomPhoneNumber(): string {
  // 中国大陆手机号前缀
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                    '150', '151', '152', '153', '155', '156', '157', '158', '159',
                    '170', '171', '172', '173', '175', '176', '177', '178',
                    '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
  
  const prefix = randomChoice(prefixes) || '138';
  return `${prefix}${randomNumberString(8)}`;
}

/**
 * 生成随机颜色代码
 * @param format 颜色格式，'hex'(默认)、'rgb'或'rgba'
 * @returns 随机颜色代码
 */
function randomColor(format: 'hex' | 'rgb' | 'rgba' = 'hex'): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  if (format === 'rgb') {
    return `rgb(${r}, ${g}, ${b})`;
  } else if (format === 'rgba') {
    const a = Math.random().toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } else {
    // 转换为十六进制格式
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}

/**
 * 生成随机UUID v4
 * @returns 随机UUID
 */
function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 随机Utils工具类
 */
const RandomUtils = {
  /**
   * 生成指定范围之内的随机数
   */
  genRandom,
  
  /**
   * 生成不重复随机字符串
   */
  genNonDuplicateID,
  
  /**
   * 生成不重复随机十六进制字符串
   */
  genNonDuplicateIDHEX,
  
  /**
   * 生成自增数字
   */
  genAutoincrementNumber,
  
  /**
   * 设置自增开始值
   */
  setAutoincrementNumberValue,
  
  /**
   * 生成随机字符串
   */
  randomString,
  
  /**
   * 生成随机数字字符串
   */
  randomNumberString,
  
  /**
   * 从数组中随机选择一个元素
   */
  randomChoice,
  
  /**
   * 从数组中随机选择多个不重复的元素
   */
  randomSample,
  
  /**
   * 打乱数组元素顺序
   */
  shuffle,
  
  /**
   * 生成随机布尔值
   */
  randomBoolean,
  
  /**
   * 生成指定范围内的随机浮点数
   */
  randomFloat,
  
  /**
   * 生成随机日期
   */
  randomDate,
  
  /**
   * 生成随机邮箱地址
   */
  randomEmail,
  
  /**
   * 生成随机手机号
   */
  randomPhoneNumber,
  
  /**
   * 生成随机颜色代码
   */
  randomColor,
  
  /**
   * 生成随机UUID v4
   */
  randomUUID
};

export default RandomUtils;