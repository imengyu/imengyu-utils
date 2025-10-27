/**
 * 数学工具类
 */
const MathUtils = {
  /**
   * 限制指定数字位指定的范围 `[min, max]`
   * @param val 指定数字
   * @param min 最小值
   * @param max 最大值
   * @returns 限制后的数字
   */
  limitNumber(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  },

  /**
   * 数字保留n位小数
   * @param num 数字
   * @param n 保留小数位数 
   * @returns 处理后的数字
   */
  fixedNumber(num: number, n: number): number {
    return n > 0 ? parseFloat(num.toFixed(n)) : Math.round(num);
  },

  /**
   * 弧度转角度
   * @param radians 弧度值
   * @returns 角度值
   */
  radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  },

  /**
   * 角度转弧度
   * @param degrees 角度值
   * @returns 弧度值
   */
  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  /**
   * 计算两点之间的距离
   * @param x1 第一个点的x坐标
   * @param y1 第一个点的y坐标
   * @param x2 第二个点的x坐标
   * @param y2 第二个点的y坐标
   * @returns 距离
   */
  distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  /**
   * 计算平均值
   * @param numbers 数字数组
   * @returns 平均值
   */
  average(...numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  },

  /**
   * 计算总和
   * @param numbers 数字数组
   * @returns 总和
   */
  sum(...numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0);
  },

  /**
   * 计算中位数
   * @param numbers 数字数组
   * @returns 中位数
   */
  median(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },

  /**
   * 计算阶乘
   * @param n 非负整数
   * @returns 阶乘结果
   */
  factorial(n: number): number {
    if (n < 0) throw new Error('输入必须是非负整数');
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  },

  /**
   * 计算两个数字的最大公约数
   * @param a 第一个数字
   * @param b 第二个数字
   * @returns 最大公约数
   */
  gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  },

  /**
   * 计算两个数字的最小公倍数
   * @param a 第一个数字
   * @param b 第二个数字
   * @returns 最小公倍数
   */
  lcm(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / this.gcd(a, b);
  },

  /**
   * 安全的除法运算，避免除以零
   * @param numerator 被除数
   * @param denominator 除数
   * @param fallback 除数为零时的默认值
   * @returns 除法结果
   */
  safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
    return denominator === 0 ? fallback : numerator / denominator;
  },

  /**
   * 安全的数学运算，避免 NaN 和 Infinity
   * @param operation 数学运算函数
   * @param fallback 默认值
   * @returns 运算结果
   */
  safeMath(operation: () => number, fallback: number = 0): number {
    try {
      const result = operation();
      return isNaN(result) || !isFinite(result) ? fallback : result;
    } catch {
      return fallback;
    }
  },

  /**
   * 计算数组的标准差
   * @param numbers 数字数组
   * @returns 标准差
   */
  standardDeviation(numbers: number[]): number {
    if (numbers.length <= 1) return 0;
    const avg = this.average(...numbers);
    const squareDiffs = numbers.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    const avgSquareDiff = this.average(...squareDiffs);
    return Math.sqrt(avgSquareDiff);
  },

  /**
   * 线性插值
   * @param start 起始值
   * @param end 结束值
   * @param progress 进度值（0-1）
   * @returns 插值结果
   */
  lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * this.limitNumber(progress, 0, 1);
  },

  /**
   * 反向线性插值
   * @param value 当前值
   * @param min 最小值
   * @param max 最大值
   * @returns 插值进度（0-1）
   */
  inverseLerp(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return this.limitNumber((value - min) / (max - min), 0, 1);
  },

  /**
   * 计算百分比值
   * @param value 当前值
   * @param total 总值
   * @returns 百分比（0-100）
   */
  percentage(value: number, total: number): number {
    return total === 0 ? 0 : (value / total) * 100;
  },

  /**
   * 四舍五入到指定精度
   * @param num 数字
   * @param precision 精度（如10、100、0.1等）
   * @returns 四舍五入后的数字
   */
  roundToPrecision(num: number, precision: number): number {
    return Math.round(num / precision) * precision;
  },

  /**
   * 计算平方
   * @param num 数字
   * @returns 平方值
   */
  square(num: number): number {
    return num * num;
  },

  /**
   * 计算立方
   * @param num 数字
   * @returns 立方值
   */
  cube(num: number): number {
    return num * num * num;
  },

  /**
   * 计算绝对值
   * @param num 数字
   * @returns 绝对值
   */
  abs(num: number): number {
    return Math.abs(num);
  },

  /**
   * 获取符号（1表示正数，-1表示负数，0表示零）
   * @param num 数字
   * @returns 符号
   */
  sign(num: number): number {
    if (num > 0) return 1;
    if (num < 0) return -1;
    return 0;
  }
};

export default MathUtils;