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
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(str); 
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
 * @param v1 
 * @param v2 
 * @returns 
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

export default {
  checkIsNotEmpty,
  checkIsNotEmptyAndSpace,
  checkIsCardNumber,
  checkIsChineseName,
	checkIsChinesePhoneNumber,
  checkIsUrl,
  checkIsImageFile,
  compareVersion,
}