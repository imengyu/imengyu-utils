/**
 * 数字操作工具类
 */

/**
 * 数字格式化选项
 */
interface FormatOptions {
  /** 小数位数 */
  decimals?: number;
  /** 是否使用千位分隔符 */
  useSeparator?: boolean;
  /** 千位分隔符 */
  separator?: string;
  /** 小数分隔符 */
  decimalSeparator?: string;
  /** 负数格式，可以是 'parentheses' (括号) 或 'minus' (负号) */
  negativeFormat?: 'parentheses' | 'minus';
}

/**
 * 格式化数字，添加千位分隔符和指定小数位数
 * @param num 要格式化的数字
 * @param options 格式化选项
 * @returns 格式化后的字符串
 */
function formatNumber(num: number, options: FormatOptions = {}): string {
  // 确保参数有效
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  const decimals = options.decimals ?? 2;
  const useSeparator = options.useSeparator ?? true;
  const separator = options.separator ?? ',';
  const decimalSeparator = options.decimalSeparator ?? '.';
  const negativeFormat = options.negativeFormat ?? 'minus';
  
  // 处理负数
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  
  // 固定小数位数
  const roundedNum = absNum.toFixed(decimals);
  
  // 分离整数部分和小数部分
  const parts = roundedNum.split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '';
  
  // 添加千位分隔符
  if (useSeparator) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }
  
  // 组合结果
  let result = integerPart;
  if (decimals > 0 && decimalPart) {
    result += decimalSeparator + decimalPart;
  }
  
  // 应用负数格式
  if (isNegative) {
    if (negativeFormat === 'parentheses') {
      result = `(${result})`;
    } else {
      result = `-${result}`;
    }
  }
  
  return result;
}

/**
 * 格式化数字为百分比
 * @param num 要格式化的数字（0-1之间）
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的百分比字符串
 */
function toPercent(num: number, decimals = 2): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0%';
  }
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * 解析数字字符串为数字
 * @param str 数字字符串
 * @returns 解析后的数字，如果解析失败则返回NaN
 */
function parseNumber(str: string): number {
  if (typeof str !== 'string') {
    return NaN;
  }
  
  // 尝试移除千位分隔符
  const cleanedStr = str.replace(/,/g, '');
  return Number(cleanedStr);
}

/**
 * 将数字限制在指定范围内
 * @param num 要限制的数字
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数字
 */
function clamp(num: number, min: number, max: number): number {
  if (typeof num !== 'number' || isNaN(num)) {
    return Math.min(min, max);
  }
  
  const actualMin = Math.min(min, max);
  const actualMax = Math.max(min, max);
  
  return Math.min(Math.max(num, actualMin), actualMax);
}

/**
 * 检查数字是否为偶数
 * @param num 要检查的数字
 * @returns 是否为偶数
 */
function isEven(num: number): boolean {
  return typeof num === 'number' && !isNaN(num) && num % 2 === 0;
}

/**
 * 检查数字是否为奇数
 * @param num 要检查的数字
 * @returns 是否为奇数
 */
function isOdd(num: number): boolean {
  return typeof num === 'number' && !isNaN(num) && num % 2 !== 0;
}

/**
 * 检查数字是否为整数
 * @param num 要检查的数字
 * @returns 是否为整数
 */
function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

/**
 * 检查数字是否为安全整数（在Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER之间）
 * @param num 要检查的数字
 * @returns 是否为安全整数
 */
function isSafeInteger(num: number): boolean {
  return Number.isSafeInteger(num);
}

/**
 * 检查数字是否为正数
 * @param num 要检查的数字
 * @returns 是否为正数
 */
function isPositive(num: number): boolean {
  return typeof num === 'number' && !isNaN(num) && num > 0;
}

/**
 * 检查数字是否为负数
 * @param num 要检查的数字
 * @returns 是否为负数
 */
function isNegative(num: number): boolean {
  return typeof num === 'number' && !isNaN(num) && num < 0;
}

/**
 * 检查数字是否在指定范围内
 * @param num 要检查的数字
 * @param min 最小值
 * @param max 最大值
 * @param inclusive 是否包含边界值，默认为true
 * @returns 是否在范围内
 */
function isInRange(num: number, min: number, max: number, inclusive = true): boolean {
  if (typeof num !== 'number' || isNaN(num)) {
    return false;
  }
  
  const actualMin = Math.min(min, max);
  const actualMax = Math.max(min, max);
  
  if (inclusive) {
    return num >= actualMin && num <= actualMax;
  } else {
    return num > actualMin && num < actualMax;
  }
}

/**
 * 将数字四舍五入到指定小数位数
 * @param num 要四舍五入的数字
 * @param decimals 小数位数，默认为0
 * @returns 四舍五入后的数字
 */
function round(num: number, decimals = 0): number {
  if (typeof num !== 'number' || isNaN(num)) {
    return 0;
  }
  
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * 将数字向上取整到指定小数位数
 * @param num 要向上取整的数字
 * @param decimals 小数位数，默认为0
 * @returns 向上取整后的数字
 */
function ceil(num: number, decimals = 0): number {
  if (typeof num !== 'number' || isNaN(num)) {
    return 0;
  }
  
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(num * multiplier) / multiplier;
}

/**
 * 将数字向下取整到指定小数位数
 * @param num 要向下取整的数字
 * @param decimals 小数位数，默认为0
 * @returns 向下取整后的数字
 */
function floor(num: number, decimals = 0): number {
  if (typeof num !== 'number' || isNaN(num)) {
    return 0;
  }
  
  const multiplier = Math.pow(10, decimals);
  return Math.floor(num * multiplier) / multiplier;
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 计算两个数字之间的差值
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 差值的绝对值
 */
function difference(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
    return 0;
  }
  return Math.abs(a - b);
}

/**
 * 计算百分比差值（变化率）
 * @param oldValue 旧值
 * @param newValue 新值
 * @param decimals 小数位数，默认为2
 * @returns 百分比差值
 */
function percentageChange(oldValue: number, newValue: number, decimals = 2): number {
  if (typeof oldValue !== 'number' || typeof newValue !== 'number' || 
      isNaN(oldValue) || isNaN(newValue) || oldValue === 0) {
    return 0;
  }
  
  const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  return round(change, decimals);
}

/**
 * 格式化大数字为带单位的形式（如：1K, 1M, 1B）
 * @param num 要格式化的数字
 * @param decimals 小数位数，默认为1
 * @returns 格式化后的字符串
 */
function formatLargeNumber(num: number, decimals = 1): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  // 定义单位和阈值
  const units = [
    { value: 1, symbol: '' },
    { value: 1000, symbol: 'K' },
    { value: 1000000, symbol: 'M' },
    { value: 1000000000, symbol: 'B' },
    { value: 1000000000000, symbol: 'T' }
  ];
  
  // 找到合适的单位
  let unit = units[0];
  for (let i = 1; i < units.length; i++) {
    if (absNum >= units[i].value) {
      unit = units[i];
    } else {
      break;
    }
  }
  
  // 格式化数字
  const formattedNum = (absNum / unit.value).toFixed(decimals);
  
  // 移除尾部的零和小数点
  const cleanNum = parseFloat(formattedNum).toString();
  
  return `${sign}${cleanNum}${unit.symbol}`;
}

/**
 * 将带单位的数字字符串转换为数值（如：1K -> 1000）
 * @param str 带单位的数字字符串
 * @returns 转换后的数值
 */
function parseNumberWithUnit(str: string): number {
  if (typeof str !== 'string') {
    return NaN;
  }
  
  // 匹配数字和单位
  const match = str.trim().match(/^([-+]?\d*\.?\d+)([KMBT]?)$/i);
  if (!match) {
    return NaN;
  }
  
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  
  // 单位映射
  const unitMultipliers: Record<string, number> = {
    K: 1000,
    M: 1000000,
    B: 1000000000,
    T: 1000000000000
  };
  
  const multiplier = unitMultipliers[unit] || 1;
  return num * multiplier;
}

/**
 * 转换角度为弧度
 * @param degrees 角度值
 * @returns 弧度值
 */
function degreesToRadians(degrees: number): number {
  if (typeof degrees !== 'number' || isNaN(degrees)) {
    return 0;
  }
  return degrees * (Math.PI / 180);
}

/**
 * 转换弧度为角度
 * @param radians 弧度值
 * @returns 角度值
 */
function radiansToDegrees(radians: number): number {
  if (typeof radians !== 'number' || isNaN(radians)) {
    return 0;
  }
  return radians * (180 / Math.PI);
}

/**
 * 获取数字的绝对值
 * @param num 输入数字
 * @returns 绝对值
 */
function abs(num: number): number {
  if (typeof num !== 'number' || isNaN(num)) {
    return 0;
  }
  return Math.abs(num);
}

/**
 * 获取数字的符号（1表示正数，-1表示负数，0表示零）
 * @param num 输入数字
 * @returns 数字的符号
 */
function sign(num: number): number {
  if (typeof num !== 'number' || isNaN(num)) {
    return 0;
  }
  return Math.sign(num);
}

/**
 * 计算两个数字的平均值
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 平均值
 */
function average(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
    return 0;
  }
  return (a + b) / 2;
}

/**
 * 线性插值
 * @param start 起始值
 * @param end 结束值
 * @param t 插值因子（0-1）
 * @returns 插值结果
 */
function lerp(start: number, end: number, t: number): number {
  if (typeof start !== 'number' || typeof end !== 'number' || typeof t !== 'number' || 
      isNaN(start) || isNaN(end) || isNaN(t)) {
    return 0;
  }
  
  // 确保t在0-1范围内
  const clampedT = clamp(t, 0, 1);
  return start + (end - start) * clampedT;
}

/**
 * 数字工具类
 */
const NumberUtils = {
  // 格式化相关
  formatNumber,
  toPercent,
  formatLargeNumber,
  
  // 解析相关
  parseNumber,
  parseNumberWithUnit,
  
  // 范围控制
  clamp,
  isInRange,
  
  // 数学运算
  round,
  ceil,
  floor,
  abs,
  sign,
  average,
  lerp,
  difference,
  percentageChange,
  
  // 验证
  isEven,
  isOdd,
  isInteger,
  isSafeInteger,
  isPositive,
  isNegative,
  
  // 随机数
  randomInt,
  
  // 角度转换
  degreesToRadians,
  radiansToDegrees,
};

export default NumberUtils;