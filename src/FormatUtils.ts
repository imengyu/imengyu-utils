/**
 * 数字格式化补0，如果数字长度不足n位，则自动补0，常见是时间、号码等有固定长度的数字显示场景。
 * @param num 数字
 * @param n 设定长度
 */
function formatNumberWithZero(num: number, n : number) : string {
  let strNum = num.toString();
  let len = strNum.length;
  while (len < n) {
    strNum = "0" + strNum;
    len++;
  }
  return strNum;
}

/**
 * 按千位逗号分割格式化数字，常见是货币、金额显示场景。
 * @param num 需要格式化的数值。
 * @param addComma 判断格式化后是否需要小数位 `.` (默认是有小数位)。
 */
function formatNumberWithComma(num: string|number, addComma = true) : string {
  if (typeof num === 'number')
    num = num.toString();
  if (/[^0-9]/.test(num))
    return "0";
  if (num === null || num === "")
    return "0";
  num = num.toString().replace(/^(\d*)$/, "$1.");
  num = (num + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  num = num.replace(".", ",");
  const re = /(\d)(\d{3},)/;
  while (re.test(num))
    num = num.replace(re, "$1,$2");
  num = num.replace(/,(\d\d)$/, ".$1");
  if (!addComma) { // 不带小数位(默认是有小数位)
    const a = num.split(".");
    if (a[1] === "00") {
      num = a[0];
    }
  }
  return num;
}

/**
 * 格式化数据大小，将位（B） 数据大小转为最佳表示单位，例如 2048 转为 2K。
 * @param size 数据大小，单位是位（B）。
 * @param pointLength 小数位数，默认：2。
 * @param units 单位显示数组，以1024倍为一个单位，默认是 `[ 'B', 'K', 'M', 'G' ]`, 如果你有更大的单位，可以扩展此参数。
 * @returns 
 */
function formatSize(size: number, pointLength?: number, units?: string[]) {
  let unit : string|undefined = '';
  units = units || [ 'B', 'K', 'M', 'G' ];
  while ((unit = units.shift()) && size > 1024 ) {
      size = size / 1024;
  }
  return (unit === 'B' ? size : size.toFixed( pointLength === undefined ? 2 : pointLength)) + (unit || '');
}

/**
 * 格式化货币显示
 * @param amount 金额数值
 * @param currency 货币符号，默认：¥
 * @param decimals 小数位数，默认：2
 * @returns 格式化后的货币字符串
 */
function formatCurrency(amount: number|string, currency: string = '¥', decimals: number = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${currency}0.00`;
  
  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${currency}${parts.join('.')}`;
}

/**
 * 格式化百分比
 * @param value 数值（小数形式，如0.25表示25%）
 * @param decimals 小数位数，默认：2
 * @returns 格式化后的百分比字符串
 */
function formatPercent(value: number|string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00%';
  
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * 格式化手机号码
 * @param phone 手机号码
 * @param format 格式化模板，默认：'XXX-XXXX-XXXX'
 * @returns 格式化后的手机号码
 */
function formatPhone(phone: string, format: string = 'XXX-XXXX-XXXX'): string {
  // 移除非数字字符
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length !== 11) {
    return phone; // 如果不是11位手机号，返回原始值
  }
  
  // 根据模板格式化
  let result = '';
  let digitIndex = 0;
  
  for (let i = 0; i < format.length; i++) {
    if (format[i] === 'X' && digitIndex < digits.length) {
      result += digits[digitIndex++];
    } else {
      result += format[i];
    }
  }
  
  return result;
}

/**
 * 格式化银行卡号
 * @param cardNumber 银行卡号
 * @param separator 分隔符，默认：' '
 * @param groupSize 每组位数，默认：4
 * @returns 格式化后的银行卡号
 */
function formatBankCard(cardNumber: string, separator: string = ' ', groupSize: number = 4): string {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (!digits) return cardNumber;
  
  const regex = new RegExp(`(\d{${groupSize}})`, 'g');
  const groups = digits.match(regex) || [];
  
  return groups.join(separator);
}

/**
 * 格式化身份证号
 * @param idNumber 身份证号
 * @returns 格式化后的身份证号（中间部分用*代替）
 */
function formatIdCard(idNumber: string): string {
  const digits = idNumber.replace(/\D/g, '');
  
  if (digits.length !== 18) return idNumber;
  
  // 显示前6位和后4位，中间用*代替
  return digits.substring(0, 6) + '********' + digits.substring(14);
}

/**
 * 格式化字符串，替换占位符
 * @param template 模板字符串，包含{0}, {1}等占位符
 * @param args 替换的参数
 * @returns 格式化后的字符串
 */
function formatString(template: string, ...args: any[]): string {
  return template.replace(/\{(\d+)\}/g, (match, index) => {
    const num = parseInt(index);
    return num >= 0 && num < args.length ? String(args[num]) : match;
  });
}

/**
 * 截断字符串并添加省略号
 * @param str 原始字符串
 * @param maxLength 最大长度
 * @param ellipsis 省略符号，默认：...
 * @returns 截断后的字符串
 */
function truncateString(str: string, maxLength: number, ellipsis: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * 格式化文件大小（使用1000作为基数，适用于网络传输等场景）
 * @param bytes 字节数
 * @param decimals 小数位数，默认：2
 * @returns 格式化后的文件大小
 */
function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1000;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * 格式化距离（米转千米）
 * @param meters 米数
 * @param decimals 小数位数，默认：2
 * @returns 格式化后的距离
 */
function formatDistance(meters: number, decimals: number = 2): string {
  if (meters < 1000) {
    return `${meters}m`;
  } else {
    return `${(meters / 1000).toFixed(decimals)}km`;
  }
}

/**
 * 格式化数字显示（根据数值大小自动选择合适的单位）
 * @param num 数字
 * @param decimals 小数位数，默认：2
 * @returns 格式化后的数字字符串
 */
function formatNumber(num: number, decimals: number = 2): string {
  if (Math.abs(num) < 1000) {
    return num.toFixed(decimals);
  } else if (Math.abs(num) < 1000000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  } else if (Math.abs(num) < 1000000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  } else {
    return `${(num / 1000000000).toFixed(decimals)}B`;
  }
}

/**
 * 格式化评分（将数字转为星级显示）
 * @param score 评分（0-5分）
 * @param maxScore 满分，默认：5
 * @param starChar 星星字符，默认：★
 * @param emptyStarChar 空星字符，默认：☆
 * @returns 星级字符串
 */
function formatRating(score: number, maxScore: number = 5, starChar: string = '★', emptyStarChar: string = '☆'): string {
  const num = Math.max(0, Math.min(maxScore, score));
  const fullStars = Math.floor(num);
  const hasHalfStar = num % 1 >= 0.5;
  
  let result = starChar.repeat(fullStars);
  if (hasHalfStar) {
    // 简单处理，这里直接使用fullStar代替，实际项目中可以使用半星字符
    result += starChar;
  }
  
  const emptyStars = maxScore - result.length;
  result += emptyStarChar.repeat(emptyStars);
  
  return result;
}

/**
 * 格式化IP地址显示
 * @param ip IP地址字符串
 * @returns 格式化后的IP地址（转换为点分十进制表示）
 */
function formatIpAddress(ip: string): string {
  // 简单校验和格式化，假设输入的是正确的IPv4地址
  const parts = ip.split('.').map(part => {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : Math.max(0, Math.min(255, num));
  });
  
  // 补全4个部分
  while (parts.length < 4) {
    parts.push(0);
  }
  
  return parts.slice(0, 4).join('.');
}

/**
 * 格式化价格区间
 * @param min 最低价格
 * @param max 最高价格
 * @param currency 货币符号，默认：¥
 * @returns 格式化后的价格区间
 */
function formatPriceRange(min: number, max: number, currency: string = '¥'): string {
  if (min === max) {
    return formatCurrency(min, currency);
  }
  
  return `${formatCurrency(min, currency)}-${formatCurrency(max, currency)}`;
}

/**
 * 格式化列表数据为字符串
 * @param items 列表项数组
 * @param separator 分隔符，默认：', '
 * @param maxItems 最大显示数量，超过部分用省略号表示，0表示不限制
 * @returns 格式化后的字符串
 */
function formatList(items: any[], separator: string = ', ', maxItems: number = 0): string {
  if (!items || items.length === 0) return '';
  
  let displayItems = items;
  let suffix = '';
  
  if (maxItems > 0 && items.length > maxItems) {
    displayItems = items.slice(0, maxItems);
    suffix = ` 等${items.length}项`;
  }
  
  return displayItems.join(separator) + suffix;
}

/**
 * 格式化相关工具函数
 */
const FormatUtils = {
  formatNumberWithZero,
  formatNumberWithComma,
  formatSize,
  formatCurrency,
  formatPercent,
  formatPhone,
  formatBankCard,
  formatIdCard,
  formatString,
  truncateString,
  formatFileSize,
  formatDistance,
  formatNumber,
  formatRating,
  formatIpAddress,
  formatPriceRange,
  formatList,
};

export default FormatUtils;