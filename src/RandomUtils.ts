import StringConv from "./StringConv";

let idPool = 0;

export default {
  /**
   * 生成指定范围之内（`[minNum,maxNum]`）的随机数
   * @param minNum 最小值
   * @param maxNum 最大值
   * @param demicalCount 指定生成的小数位数
   */
  genRandom(minNum : number, maxNum : number, demicalCount = 0) : number {
    if (demicalCount > 0) {
      minNum *= demicalCount * 10;
      maxNum *= demicalCount * 10;
    }
    const result =  Math.floor(Math.random()*(maxNum-minNum+1)+minNum);
    return demicalCount > 0 ? result / (demicalCount * 10) : result; 
  },
  /**
   * 生成不重复随机字符串。使用当前日期作为前缀防止重复。
   * @param randomLength 字符长度
   */
  genNonDuplicateID(randomLength : number) : string {
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substr(3,randomLength)
    return idStr
  },
  /**
   * 生成不重复随机字符串(十六进制)
   * @param randomLength 字符长度
   */
  genNonDuplicateIDHEX(randomLength : number) : string {
    const idStr = this.genNonDuplicateID(randomLength);
    return StringConv.strToHexCharCode(idStr, false).substr(idStr.length - randomLength, randomLength);
  },
  /**
   * 生成自增的数字。要设置自增开始值，请使用 `setAutoincrementNumberValue` .
   */
  genAutoincrementNumber() : number {
    if(idPool < Number.MAX_VALUE)
      return ++idPool;
    return 0;
  },
  /**
   * 设置自增开始值
   */
  setAutoincrementNumberValue(value: number) {
    idPool = value;
  },
  /**
   * 生成随机字符串
   * @param len 随机字符串长度
   * @returns 随机字符串
   */
  randomString(len?: number) : string {
    len = len || 32;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  /**
   * 生成随机数字字符串
   * @param len 随机字符串长度
   * @returns 随机字符串
   */
  randomNumberString(len?: number) : string {
    len = len || 32;
    const $chars = '0123456789';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
}