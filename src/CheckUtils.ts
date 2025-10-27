/**
 * Author: imengyu 2021-10-16
 * 
 * 检查工具类，此类提供了一些方法用于检查用户输入字符串是否满足要求。
 */

/**
 * 检查用户输入字符串是否是合法身份证号
 * @param {string} str 输入字符串
 * @returns {boolean} 返回结果
 */
function checkIsCardNumber(str: string) {
  return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(str);
}

/**
 * 检查用户输入字符串是否是合法中文名字
 * @param {string} str 
 * @returns {boolean} 返回结果
 */
function checkIsChineseName(str: string) {
  return /[\u4e00-\u9fa5]{2,5}/.test(str);
}

/**
 * 检查用户输入字符串是否是中国手机号
 * @param {string} str 
 * @returns {boolean} 返回结果
 */
function checkIsChinesePhoneNumber(str: string) {
  return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(str); 
}

/**
 * 检查用户输入字符串是否是网址
 * @param {string} str
 */
function checkIsUrl(str: string) {
  return /^(http|https):\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str); 
}

function checkIsImageFile(str: string) {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(str); 
}

/**
 * 检查用户输入字符串是否为空
 * @param {string} str 
 * @returns {boolean} 返回结果
 */
function checkIsNotEmpty(str: string) {
  return typeof str === 'string' && str != '';
}

/**
 * 检查用户输入字符串是否为空（同样检查空格）
 * @param {string} str 
 * @returns {boolean} 返回结果
 */
function checkIsNotEmptyAndSpace(str: string) {
  return typeof str === 'string' && str != '' && str.trim() != '';
}

/**
 * 比较版本号
 * @param v1 版本号1
 * @param v2 版本号2
 * @returns 1表示v1>v2，-1表示v1<v2，0表示相等
 */
function compareVersion(v1: any, v2: any) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * 检查是否是有效的电子邮箱地址
 * @param {string} email 邮箱地址
 * @returns {boolean} 返回结果
 */
function checkIsEmail(email: string) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

/**
 * 检查是否是有效的中国邮政编码
 * @param {string} zipCode 邮政编码
 * @returns {boolean} 返回结果
 */
function checkIsChinesePostalCode(zipCode: string) {
  return /^[1-9]\d{5}$/.test(zipCode);
}

/**
 * 检查是否是有效的银行卡号（Luhn算法验证）
 * @param {string} cardNumber 银行卡号
 * @returns {boolean} 返回结果
 */
function checkIsBankCard(cardNumber: string) {
  if (!/^\d{16,19}$/.test(cardNumber)) {
    return false;
  }
  
  let sum = 0;
  let parity = cardNumber.length % 2;
  
  for (let i = 0; i < cardNumber.length; i++) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (i % 2 === parity) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
  }
  
  return sum % 10 === 0;
}

/**
 * 检查是否是有效的IPv4地址
 * @param {string} ip IPv4地址
 * @returns {boolean} 返回结果
 */
function checkIsIPv4(ip: string) {
  return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/.test(ip);
}

/**
 * 检查是否是有效的IPv6地址
 * @param {string} ip IPv6地址
 * @returns {boolean} 返回结果
 */
function checkIsIPv6(ip: string) {
  return /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(ip);
}

/**
 * 检查是否是有效的日期格式 (YYYY-MM-DD)
 * @param {string} dateStr 日期字符串
 * @returns {boolean} 返回结果
 */
function checkIsDate(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  
  const parts = dateStr.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);
  
  const date = new Date(year, month, day);
  
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

/**
 * 检查是否是有效的中国车牌号
 * @param {string} plate 车牌号
 * @returns {boolean} 返回结果
 */
function checkIsChineseCarPlate(plate: string) {
  // 普通车牌、新能源车牌和领事馆车牌等
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][0-9]{4}[D]$/.test(plate);
}

/**
 * 检查密码强度（至少包含大小写字母、数字和特殊字符中的三种）
 * @param {string} password 密码
 * @param {number} minLength 最小长度
 * @returns {boolean} 返回结果
 */
function checkPasswordStrength(password: string, minLength: number = 8) {
  if (password.length < minLength) {
    return false;
  }
  
  let score = 0;
  // 包含小写字母
  if (/[a-z]/.test(password)) score++;
  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;
  // 包含数字
  if (/\d/.test(password)) score++;
  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  return score >= 3;
}

/**
 * 检查是否是有效的统一社会信用代码
 * @param {string} code 统一社会信用代码
 * @returns {boolean} 返回结果
 */
function checkIsUnifiedSocialCreditCode(code: string) {
  if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(code)) {
    return false;
  }
  
  // 统一社会信用代码校验规则比较复杂，这里仅做简单格式校验
  return true;
}

/**
 * 检查是否是有效的MAC地址
 * @param {string} mac MAC地址
 * @returns {boolean} 返回结果
 */
function checkIsMacAddress(mac: string) {
  return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
}

/**
 * 检查是否是有效的QQ号
 * @param {string} qq QQ号
 * @returns {boolean} 返回结果
 */
function checkIsQQ(qq: string) {
  return /^[1-9]\d{4,10}$/.test(qq);
}

/**
 * 检查是否是有效的微信号（6-20位字母、数字、下划线或减号）
 * @param {string} wechat 微信号
 * @returns {boolean} 返回结果
 */
function checkIsWechat(wechat: string) {
  return /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/.test(wechat);
}

/**
 * 检查是否是纯数字
 * @param {string} str 输入字符串
 * @returns {boolean} 返回结果
 */
function checkIsAllNumber(str: string) {
  return /^\d+$/.test(str);
}

/**
 * 检查是否是纯字母
 * @param {string} str 输入字符串
 * @returns {boolean} 返回结果
 */
function checkIsAllLetter(str: string) {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * 检查是否包含特殊字符
 * @param {string} str 输入字符串
 * @returns {boolean} 返回结果
 */
function checkContainsSpecialChar(str: string) {
  return /[^a-zA-Z0-9\u4e00-\u9fa5]/.test(str);
}

/**
 * 检查数字是否在指定范围内
 * @param {number|string} num 数字
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {boolean} 返回结果
 */
function checkNumberInRange(num: number|string, min: number, max: number) {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  return !isNaN(number) && number >= min && number <= max;
}

export default {
  checkIsNotEmpty,
  checkIsNotEmptyAndSpace,
  checkIsCardNumber,
  checkIsChineseName,
  checkIsChinesePhoneNumber,
  checkIsUrl,
  checkIsImageFile,
  compareVersion,
  checkIsEmail,
  checkIsChinesePostalCode,
  checkIsBankCard,
  checkIsIPv4,
  checkIsIPv6,
  checkIsDate,
  checkIsChineseCarPlate,
  checkPasswordStrength,
  checkIsUnifiedSocialCreditCode,
  checkIsMacAddress,
  checkIsQQ,
  checkIsWechat,
  checkIsAllNumber,
  checkIsAllLetter,
  checkContainsSpecialChar,
  checkNumberInRange,
}