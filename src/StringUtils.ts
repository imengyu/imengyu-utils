
/**
 * 路径常用工具函数
 */
const path = {
  /**
   * 从一个文件路径中快速获取文件名
   * @param path 
   * @returns 
   */
  getFileName(path : string) : string {
    let pos = path.lastIndexOf('/');
    if(pos < 0) 
      pos = path.lastIndexOf('\\');
    return path.substring(pos + 1);  
  },
  /**
   * 从文件路径字符串中获取当前文件的扩展名, 此函数会自动忽略URL中的参数（?之后的不会计算）
   * @param path 
   * @returns 
   */
  getFileExt(path: string) : string {
    let lastDot = path.lastIndexOf('.') + 1;
    let qm = path.lastIndexOf('?');
    if (lastDot < qm)
      return this.getFileExt(path.substring(0, qm));
    return path.substring(lastDot);
  },
  /**
   * 从 ContentDisposition 头信息中获取下载附件的文件名
   * @param n ContentDisposition 头信息
   * @returns 返回文件名，如果没有读取成功，则返回空字符串。
   */
  getContentDispositionFileName(n: string|undefined) {
    if (!n)
      return '';
    const i = n.indexOf('filename=');
    if (i > 0) {
      const startPos = i + 9;
      let endPos = n.length;
      for (let i = 0; i < n.length; i++) {
        if (n[i] === ';') {
          endPos = i;
          break;
        }
      }
      return n.substring(startPos, endPos).replace(/"/g, '');
    } 
    return '';
  },
};

/**
 * 字符串常用工具类
 */
const StringUtils = {
  isNullOrEmpty,
  isBase64,
  isNumber,
  isChinaPoneNumber,
  isEmail,
  getCharCount,
  path,
}

export default StringUtils;

/**
 * 字符串判空
 * @param str 字符串
 */
function isNullOrEmpty(str : string | undefined | null) : boolean {
  return !str || typeof str === 'undefined' || str === ''
}
/**
* 判断字符串是否是 Base64 编码
* @param {String} str 
*/
function isBase64(str : string) : boolean {
  return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(str);
}
/**
 * 检测字符串是否是一串数字
 * @param {String} val 
 */
function isNumber(val : string) : boolean {
  const regPos = /^\d+(\.\d+)?$/; //非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
/**
 * 检查字符串是否是中国的11位手机号
 * @param str 字符串
 */
function isChinaPoneNumber(str : string) : boolean {
  const myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
      return false;
  } else {
      return true;
  }
}
/**
 * 检查字符串是否是邮箱
 * @param str 字符串
 */
function isEmail(str : string) : boolean {
  const re=/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (re.test(str) !== true) {
    return false;
  }else{
    return true;
  }
}

/**
 * 得到字符串含有某个字符的个数  
 * @param str 字符串
 * @param char 某个字符
 * @returns 个数  
 */
function getCharCount(str: string, char: string) : number {
  const regex = new RegExp(char, 'g'); // 使用g表示整个字符串都要匹配
  const result = str.match(regex);          //match方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
  const count = !result ? 0 : result.length;
  return count;
}