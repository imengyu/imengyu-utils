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
 * 格式化相关工具函数
 */
const FormatUtils = {
  formatNumberWithZero,
  formatNumberWithComma,
  formatSize,
};

export default FormatUtils;