
/**
 * 路径常用工具函数
 */
const path = {
  /**
   * 从一个文件路径中快速获取文件名
   * @param path 文件路径
   * @returns 文件名
   */
  getFileName(path : string) : string {
    let pos = path.lastIndexOf('/');
    if(pos < 0) 
      pos = path.lastIndexOf('\\');
    return path.substring(pos + 1);  
  },
  
  /**
   * 从文件路径字符串中获取当前文件的扩展名, 此函数会自动忽略URL中的参数（?之后的不会计算）
   * @param path 文件路径
   * @returns 文件扩展名
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
      for (let j = startPos; j < n.length; j++) {
        if (n[j] === ';') {
          endPos = j;
          break;
        }
      }
      return n.substring(startPos, endPos).replace(/"/g, '');
    } 
    return '';
  },
  
  /**
   * 获取文件路径中的目录部分
   * @param path 文件路径
   * @returns 目录路径
   */
  getDirectory(path: string): string {
    let pos = path.lastIndexOf('/');
    if (pos < 0) 
      pos = path.lastIndexOf('\\');
    return pos >= 0 ? path.substring(0, pos) : '';
  },
  
  /**
   * 获取不带扩展名的文件名
   * @param path 文件路径或文件名
   * @returns 不带扩展名的文件名
   */
  getFileNameWithoutExt(path: string): string {
    const fileName = this.getFileName(path);
    const dotPos = fileName.lastIndexOf('.');
    return dotPos >= 0 ? fileName.substring(0, dotPos) : fileName;
  },
  
  /**
   * 规范化路径，统一使用指定的路径分隔符
   * @param path 文件路径
   * @param separator 路径分隔符，默认为当前系统分隔符
   * @returns 规范化后的路径
   */
  normalize(path: string, separator: string = '/'): string {
    // 替换所有分隔符为统一的分隔符
    const normalized = path.replace(/[\/]/g, separator);
    
    // 处理连续的分隔符
    const segments = normalized.split(separator).filter(segment => segment !== '');
    return segments.join(separator);
  },
  
  /**
   * 判断路径是否为绝对路径
   * @param path 文件路径
   * @returns 是否为绝对路径
   */
  isAbsolutePath(path: string): boolean {
    // Windows 绝对路径判断
    if (/^[a-zA-Z]:[\/]/.test(path)) return true;
    // Unix 绝对路径判断
    if (path.startsWith('/')) return true;
    return false;
  },
  
  /**
   * 拼接多个路径片段
   * @param paths 路径片段数组
   * @returns 拼接后的路径
   */
  join(...paths: string[]): string {
    if (paths.length === 0) return '';
    
    let joined = paths[0];
    for (let i = 1; i < paths.length; i++) {
      const segment = paths[i];
      if (segment) {
        // 确保前一个路径以分隔符结尾
        if (!joined.endsWith('/') && !joined.endsWith('\\')) {
          joined += '/';
        }
        // 移除当前路径开头的分隔符
        joined += segment.replace(/^[\/]+/, '');
      }
    }
    
    return this.normalize(joined);
  },
  
  /**
   * 更改文件扩展名
   * @param path 文件路径
   * @param newExt 新的扩展名（不含点号）
   * @returns 更改后的文件路径
   */
  changeExt(path: string, newExt: string): string {
    const baseName = this.getFileNameWithoutExt(path);
    const dirName = this.getDirectory(path);
    const ext = newExt ? `.${newExt.replace(/^\./, '')}` : '';
    
    return dirName ? `${dirName}/${baseName}${ext}` : `${baseName}${ext}`;
  },
  
  /**
   * 将 Windows 路径转换为 Unix 路径
   * @param path Windows 路径
   * @returns Unix 路径
   */
  toUnixPath(path: string): string {
    return path.replace(/\\/g, '/');
  },
  
  /**
   * 将 Unix 路径转换为 Windows 路径
   * @param path Unix 路径
   * @returns Windows 路径
   */
  toWindowsPath(path: string): string {
    return path.replace(/\//g, '\\');
  },
  
  /**
   * 添加尾部路径分隔符
   * @param path 文件路径
   * @param separator 路径分隔符，默认为 '/' 
   * @returns 添加分隔符后的路径
   */
  addTrailingSlash(path: string, separator: string = '/'): string {
    if (!path.endsWith(separator) && !path.endsWith('\\')) {
      return path + separator;
    }
    return path;
  },
  
  /**
   * 移除尾部路径分隔符
   * @param path 文件路径
   * @returns 移除分隔符后的路径
   */
  removeTrailingSlash(path: string): string {
    return path.replace(/[\/]+$/, '');
  },
  
  /**
   * 判断两个路径是否指向同一个位置（忽略分隔符差异和大小写）
   * @param path1 第一个路径
   * @param path2 第二个路径
   * @returns 是否指向同一个位置
   */
  isSamePath(path1: string, path2: string): boolean {
    // 规范化两个路径，然后比较（Windows 下忽略大小写）
    const normalized1 = this.normalize(path1).toLowerCase();
    const normalized2 = this.normalize(path2).toLowerCase();
    return normalized1 === normalized2;
  },
  
  /**
   * 获取路径的深度（目录层级数）
   * @param path 文件路径
   * @returns 路径深度
   */
  getPathDepth(path: string): number {
    // 忽略空路径
    if (!path) return 0;
    
    // 规范化路径并分割
    const normalized = this.normalize(path);
    const segments = normalized.split('/').filter(segment => segment !== '');
    
    // 对于绝对路径，根目录不计入深度
    if (this.isAbsolutePath(path)) {
      return segments.length;
    }
    
    return segments.length;
  },
  
  /**
   * 从路径中提取URL参数
   * @param path 带参数的URL路径
   * @returns 参数对象
   */
  getUrlParams(path: string): Record<string, string> {
    const result: Record<string, string> = {};
    const queryPos = path.lastIndexOf('?');
    
    if (queryPos !== -1) {
      const queryStr = path.substring(queryPos + 1);
      const params = queryStr.split('&');
      
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
          result[key] = value ? decodeURIComponent(value) : '';
        }
      });
    }
    
    return result;
  },
  
  /**
   * 清理URL中的参数
   * @param path 带参数的URL路径
   * @returns 清理后的URL路径
   */
  cleanUrlParams(path: string): string {
    const queryPos = path.lastIndexOf('?');
    return queryPos !== -1 ? path.substring(0, queryPos) : path;
  },
};

/**
 * 字符串常用工具类
 */
const StringUtils = {
  isNullOrEmpty,
  isBase64,
  isNumber,
  isStringAllEnglish,
  isStringAllChinese,
  isEmail,
  isUrl,
  getCharCount,
  stringHashCode,
  cutString,
  trim,
  equals,
  equalsIgnoreCase,
  startsWith,
  endsWith,
  contains,
  repeat,
  padStart,
  padEnd,
  escapeHtml,
  unescapeHtml,
  randomString,
  replaceAll,
  path,
  case: {
    toCamelCase,
    toSnakeCase,
    toKebabCase,
  },
}

export default StringUtils;

/**
 * 检查字符串是否是全英文
 * @param str 字符串
 * @returns 
 */
function isStringAllEnglish(str: string) {
  return /^[\x00-\x7F]+$/.test(str)
}
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
 * 检查字符串是否是全中文
 * @param str 字符串
 * @returns 
 */
function isStringAllChinese(str: string) {
  return /^[\u4e00-\u9fa5]+$/.test(str)
}


/**
 * 将字符串去除空格
 * @param input 输入字符串，如'我是测 试的字符串'
 * @returns 去除空格后的字符串
 */
function trim(input: string): string {
    return input.replace(/\s+/g, '');
}

/**
 * 计算字符串的哈希值
 * @param {string} str
 */
function stringHashCode(str: string) {
  return '' + (str.split("").reduce(function(a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return (a & a);
  }, 0));
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
/**
 * 截取字符串，超出最大长度的部分会被省略号代替
 * @param str 字符串
 * @param maxLength 最大长度
 * @returns 
 */
function cutString(str: string, maxLength: number) {
  if (str.length <= maxLength)
    return str;
  return str.substring(0, maxLength) + '...';
}


/**
 * 判断两个字符串是否完全相等
 * @param input1 输入字符串，如'我是测试的字符串' 或 输入数字如 220022
 * @param input2 输入字符串，如'我是测试的字符串' 或 输入数字如 220022
 */
function equals(input1: string | number, input2: string | number): boolean {
    return input1 === input2;
}
/**
 * 忽略大小写判断两个字符串是否相等
 * @param input1 输入字符串，如'equalsIgnoreCasE',
 * @param input2 输入字符串，如'equalsIgnoreCase'
 * @return
 */
function equalsIgnoreCase(input1: string, input2: string): boolean {
    return input2.toLocaleLowerCase() === input1.toLocaleLowerCase();
}

/**
 * 检查字符串是否以指定字符开始
 * @param str 原始字符串
 * @param prefix 要检查的前缀
 * @returns 是否以指定字符开始
 */
function startsWith(str: string, prefix: string): boolean {
    return str.indexOf(prefix) === 0;
}

/**
 * 检查字符串是否以指定字符结束
 * @param str 原始字符串
 * @param suffix 要检查的后缀
 * @returns 是否以指定字符结束
 */
function endsWith(str: string, suffix: string): boolean {
    return str.lastIndexOf(suffix) === str.length - suffix.length;
}

/**
 * 检查字符串是否包含指定字符
 * @param str 原始字符串
 * @param searchStr 要搜索的字符串
 * @returns 是否包含指定字符
 */
function contains(str: string, searchStr: string): boolean {
    return str.indexOf(searchStr) !== -1;
}

/**
 * 重复字符串指定次数
 * @param str 要重复的字符串
 * @param count 重复次数
 * @returns 重复后的字符串
 */
function repeat(str: string, count: number): string {
    let result = '';
    for (let i = 0; i < count; i++) {
        result += str;
    }
    return result;
}

/**
 * 在字符串开头填充指定字符
 * @param str 原始字符串
 * @param targetLength 目标长度
 * @param padString 填充字符
 * @returns 填充后的字符串
 */
function padStart(str: string, targetLength: number, padString: string = ' '): string {
    const padLen = targetLength - str.length;
    if (padLen <= 0) return str;
    return repeat(padString, padLen) + str;
}

/**
 * 在字符串结尾填充指定字符
 * @param str 原始字符串
 * @param targetLength 目标长度
 * @param padString 填充字符
 * @returns 填充后的字符串
 */
function padEnd(str: string, targetLength: number, padString: string = ' '): string {
    const padLen = targetLength - str.length;
    if (padLen <= 0) return str;
    return str + repeat(padString, padLen);
}

/**
 * 转换字符串为驼峰命名
 * @param str 原始字符串
 * @returns 驼峰命名的字符串
 */
function toCamelCase(str: string): string {
    return str.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * 转换字符串为蛇形命名（下划线分隔）
 * @param str 原始字符串
 * @returns 蛇形命名的字符串
 */
function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (g) => `_${g.toLowerCase()}`)
              .replace(/^_/, '')
              .replace(/-/g, '_');
}

/**
 * 转换字符串为短横线命名
 * @param str 原始字符串
 * @returns 短横线命名的字符串
 */
function toKebabCase(str: string): string {
    return str.replace(/[A-Z]/g, (g) => `-${g.toLowerCase()}`)
              .replace(/^-/, '')
              .replace(/_/g, '-');
}

/**
 * 转义HTML特殊字符
 * @param str 原始字符串
 * @returns 转义后的字符串
 */
function escapeHtml(str: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 反转义HTML特殊字符
 * @param str 转义后的字符串
 * @returns 原始字符串
 */
function unescapeHtml(str: string): string {
    const map: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (m) => map[m]);
}

/**
 * 检查是否为有效的电子邮件地址
 * @param email 要检查的电子邮件地址
 * @returns 是否为有效的电子邮件地址
 */
function isEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * 检查是否为有效的URL
 * @param url 要检查的URL
 * @returns 是否为有效的URL
 */
function isUrl(url: string): boolean {
    const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return re.test(url);
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param chars 可选的字符集
 * @returns 随机生成的字符串
 */
function randomString(length: number, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * 替换字符串中的所有匹配项
 * @param str 原始字符串
 * @param search 要搜索的字符串
 * @param replacement 替换的字符串
 * @returns 替换后的字符串
 */
function replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
}