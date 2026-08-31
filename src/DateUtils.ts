import FormatUtils from "./FormatUtils";

/**
 * 格式化日期为字符串。
 *
 * 示例：
 * ```
 * formatDate(new Date(), 'YYYY-MM-dd HH:ii:ss'); // '2023-08-15 14:30:00'
 * formatDate(new Date(), 'YYYY-MM-dd'); // '2023-08-15'
 * formatDate(new Date(), 'HH:ii:ss'); // '14:30:00'
 * ```
 *
 * 模板支持以下格式字符串：
 * |名称|说明|
 * |--|--|
 * |yyyy|完整年份，例如2014|
 * |YYYY|同 yyyy|
 * |MM|两位月份，例如01，12|
 * |M|一位月份，例如1，11|
 * |dd|两位日期，例如15|
 * |DD|两位日期，同dd|
 * |D|一位日期，例如5，15|
 * |HH|24小时制的两位小时数，例如04，23|
 * |H|24小时制的一位小时数，例如4，13|
 * |hh|12小时制的两位小时数，例如05，01|
 * |mm|两位分钟数，例如05，45|
 * |m|一位分钟数，例如5，45|
 * |ii|两位分钟数，同mm|
 * |ss|两位秒数，例如09，30|
 * |s|一位秒数，例如9，30|
 *
 * @param date 日期对象或时间戳（秒/毫秒级，13位=毫秒，10位=秒）
 * @param format 日期格式化模板，不填写默认是 `'YYYY-MM-dd HH:ii:ss'`
 * @param defaultValue 传入空或者时的默认值，不填写默认是 `'[Invald Date]'`
 * @returns 格式化后的日期字符串
 */
function formatDate(
  date: Date|number|undefined,
  format = 'YYYY-MM-dd HH:ii:ss',
  defaultValue = '[Invald Date]'
) {
  let targetDate: Date;
  if (!date) {
    return defaultValue || '';
  }

  if (date instanceof Date) {
    targetDate = date;
  } else if (typeof date === 'number') {
    targetDate = new Date(date.toString().length === 10 ? date * 1000 : date);
  } else {
    targetDate = new Date(date);
  }

  if (isNaN(targetDate.getTime())) {
    console.warn(`[formatDate] 非法日期：${date}`);
    return '';
  }

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  const seconds = targetDate.getSeconds();

  const padZero = (num: number): string => FormatUtils.formatNumberWithZero(num, 2);

  const hours12 = hours % 12 || 12;

  const replaceMap: Record<string, string | number> = {
    YYYY: year,
    yyyy: year,
    MM: padZero(month),
    M: month,
    DD: padZero(day),
    D: day,
    dd: padZero(day),
    HH: padZero(hours),
    H: hours,
    hh: padZero(hours12),
    mm: padZero(minutes),
    m: minutes,
    ii: padZero(minutes),
    ss: padZero(seconds),
    s: seconds,
  };

  return format.replace(/YYYY|yyyy|MM|M|DD|D|dd|HH|H|hh|mm|m|ii|ss|s/g, (match) => {
    return replaceMap[match].toString();
  });
}

/**
 * 判断一个参数是不是有效的 Date 日期类型。
 * @param date 要判断的参数
 */
function isVaildDate(date: Date) {
  return date instanceof Date && !isNaN(date.getTime());
}

const DateUtils = {
  FormatStrings: {
    FullChanese: "YYYY年MM月dd日",
    MonthChanese: "YYYY年MM月dd日",
    YearChanese: "YYYY年",
    CommonDate: "YYYY-MM-dd HH:mm:ss",
    CommonTime: "HH:mm:ss",
    ShortDate: "YYYY-MM-dd",
    ShortTime: "HH:mm",
    ShortDateTime: "YYYY-MM-dd HH:mm",
    DateNoDash: "YYYYMMdd",
    TimeNoDash: "HHmmss",
    DateTimeNoDash: "YYYYMMddHHmmss",
  },
  formatDate,
  isVaildDate,
  /**
   * 转换字符串日期为 Date
   * @param dateString 日期字符串
   */
  parseDate(dateString: string | Date | number) {
    if (typeof dateString === 'object' && dateString instanceof Date)
      return dateString;
    if (typeof dateString === 'number')
      return new Date(dateString);
    return new Date(dateString.replace(/-/g, '/'));
  },
}

export default DateUtils;
