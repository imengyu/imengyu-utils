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
  // 1. 处理非法日期，返回空字符串
  let targetDate: Date;
  if (!date) {
    return defaultValue || '';
  }

  // 2. 统一转换为 Date 对象
  if (date instanceof Date) {
    targetDate = date;
  } else if (typeof date === 'number') {
    // 处理时间戳（支持秒/毫秒级，自动判断：13位=毫秒，10位=秒）
    targetDate = new Date(date.toString().length === 10 ? date * 1000 : date);
  } else {
    targetDate = new Date(date);
  }

  // 3. 验证 Date 对象有效性
  if (isNaN(targetDate.getTime())) {
    console.warn(`[formatDate] 非法日期：${date}`);
    return '';
  }

  // 4. 提取日期组件（补零处理）
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1; // 月份从 0 开始，需 +1
  const day = targetDate.getDate();
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  const seconds = targetDate.getSeconds();

  // 补零工具函数
  const padZero = (num: number): string => FormatUtils.formatNumberWithZero(num, 2);

  // 5. 替换格式化模板
  const hours12 = hours % 12 || 12; // 12小时制
  
  const replaceMap: Record<string, string | number> = {
    YYYY: year,
    yyyy: year,
    MM: padZero(month),
    M: month, // 一位月份
    DD: padZero(day),
    D: day, // 一位日期
    dd: padZero(day), // 两位日期
    HH: padZero(hours), // 24小时制两位小时数
    H: hours, // 24小时制一位小时数
    hh: padZero(hours12), // 12小时制两位小时数
    mm: padZero(minutes), // 两位分钟数
    m: minutes, // 一位分钟数
    ii: padZero(minutes), // 两位分钟数，同mm
    ss: padZero(seconds), // 两位秒数
    s: seconds, // 一位秒数
  };

  // 6. 遍历替换模板中的占位符
  return format.replace(/YYYY|yyyy|MM|M|DD|D|dd|HH|H|hh|mm|m|ii|ss|s/g, (match) => {
    return replaceMap[match].toString();
  });
}
/**
 * 判断一个参数是不是有效的 Date 日期类型。
 * @param date 要判断的参数
 * @returns 
 */
function isVaildDate(date: Date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 获取两个时间是不是同一天
 * @param day1 时间1
 * @param day2 时间2
 */
function isSameDay(day1: Date, day2: Date): boolean {
  return day1.getFullYear() === day2.getFullYear()
    && day1.getMonth() === day2.getMonth()
    && day1.getDate() === day2.getDate();
}

/**
 * 判断两个时间是不是在同一月
 * @param day1 时间1
 * @param day2 时间2
 */
function isSameYearAndMonth(day1: Date, day2: Date): boolean {
  return day1.getFullYear() === day2.getFullYear()
    && day1.getMonth() === day2.getMonth();
}

/**
 * 获取某年的某月共多少天
 * @param year 年
 * @param month 月，同 Date 中的 getMonth() 方法
 * @returns 该月的天数
 */
function getMonthDays(year: number, month: number) {
  switch (month + 1) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
    default:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return (year % 4 == 0 && year % 100 !== 0 || year % 400 == 0) ? 29 : 28;
  }
}

/**
 * 获取某一天(年月日)是星期几
 * @param {number} year 
 * @param {number} month 
 * @param {number} date 
 * @returns {number}
 */
function getDayWeekday(year: number, month: number, date: number) {
  const dateNow = new Date(year, month - 1, date)
  // 0-6, 0 is sunday
  return dateNow.getDay()
}

/**
 * 获取某一天所在周的日期
 * @param date 
 * @returns
 */
function getWeekDatesForDate(date: Date) {
  const timeStamp = date.getTime()
  const currentDay = date.getDay()
  let dates : {
    /**
     * 只是指当前查询的时间，在那一周的哪一天. 并不是指查询的这一天是否是今天
     */
    theDay: boolean;
    /**
     * 日期
     */
    date: Date;
    /**
     * 是否是今天
     */
    today: boolean;
}[] = []
  for (let i = 0; i < 7; i++) {
    const _i = i - (currentDay + 6) % 7
    const _isToday = _i === 0
    const _date = new Date(timeStamp + 24 * 60 * 60 * 1000 * _i)
    dates.push({
      theDay: _isToday,
      date: _date,
      today: isToday(_date)
    })
  }
  return dates
}

/**
 * 获取当前周的日期
 * @returns 
 */
function getWeekDates() {
  const new_Date = new Date()
  return getWeekDatesForDate(new_Date)
}

/**
 * 获取某一天所在周的日期
 * @param {number} year 
 * @param {number} month 
 * @param {number} date 
 * @returns 
 */
function getWeekDatesForYMD(year: number, month: number, date: number) {
  const dateNow = new Date(year, month - 1, date)
  return getWeekDatesForDate(dateNow)
}

/**
 * 获取 开始日期 之后 第n周 的 日期
 * @param {string} start 
 * @param {number} diff 
 * @returns 
 */
function getDatesAfterWeeks(start: string, diff: number) {
  const _arr = start.replace(/-/g, '/').split('/')
  const y = _arr[0]
  const m = _arr[1]
  const d = _arr[2]
  const _start = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
  const timeStamp = _start.getTime()
  const date = new Date(timeStamp + diff * 7 * 24 * 60 * 60 * 1000)
  return getWeekDatesForDate(date)
}

/**
 * 获取当前是开始日期之后的第几周，如果大于total，则表示已经结束过时，如果小于0，则表示start还没有到来。
 * 
 * 我们这里需要注意的是，比如 开始日期是星期四（没有给出星期一的日期），下周的星期一应该是第2周，而不是还在第一周。(我们这里不仅仅只是差值周数计算，还需要受实际周的限制)
 * 不能只是计算差值，如果给出的开始日期是星期一的，差值计算正确，如果不是，则需要考虑开始日期的星期
 * @param {string} start 
 * @param {number} total 
 * @returns 
 */
function getCurrentWeekNumber(start: string, total: number) {
  const _arr = start.replace(/-/g, '/').split('/')
  const y = _arr[0]
  const m = _arr[1]
  const d = _arr[2]
  const _start = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
  let _timestamp = _start.getTime()
  let day = _start.getDay() // 星期几
  day = (day + 6) % 7  // 将星期几转化为距离星期一多少天
  // 我们将开始时间修正到那一周的星期一
  // 这里我们将星期天作为最后一天，星期一作为第一天
  _timestamp = _timestamp - day * (24 * 60 * 60 * 1000)
  // current
  const dt = new Date()
  const _y = dt.getFullYear()
  const _m = dt.getMonth()
  const _d = dt.getDate()
  const today = new Date(_y, _m, _d)
  const todayStamp = today.getTime()
  const diff = todayStamp - _timestamp
  if (diff < 0) {
    // start还没有开始，未来返回-1
    return -1
  }
  const weekStamp = 7 * 24 * 60 * 60 * 1000
  let weekDiff = Math.floor(diff / weekStamp)
  const more = diff % weekStamp
  // if (more >= 24 * 60 * 60 * 1000) {
  // weekDiff += 1
  // }
  // wo always need to plus 1 for weekDiff
  const weekNumber = weekDiff + 1
  if (weekNumber > total) {
    // 已经过期
    return -2
  }
  return weekNumber
}

/**
 * 查询某日期是否是今天
 * @param date 
 * @returns 
 */
function isToday(date: Date) {
  const dt = new Date();
  const y = dt.getFullYear(); // 年
  const _y = date.getFullYear();
  const m = dt.getMonth(); // 月份从0开始的
  const _m = date.getMonth();
  const d = dt.getDate(); //日
  const _d = date.getDate();
  return (_y + '-' + _m + '-' + _d) === (y + '-' + m + '-' + d);
}

/**
 * 获取 某年某月某日 是在 那一月 的第几周
 * @param year 
 * @param month 
 * @param date 
 * @returns {number}
 */
function getMonthWeek(year: number, month: number, date: number) {
  /*  
      month = 6 - w = 当前周的还有几天过完(不算今天)  
      year + month 的和在除以7 就是当天是当前月份的第几周  
  */
  let dateNow = new Date(year, month - 1, date);
  let w = dateNow.getDay(); //星期数
  let d = dateNow.getDate();
  return Math.ceil((d + 6 - w) / 7);
}

/**
 * 获取 某年某月某日 是在 那一年 的第几周
 * @param year 
 * @param month 
 * @param date 
 * @returns 
 */
function getYearWeek(year: number, month: number, date: number) {
  /*  
      dateNow是当前日期 
      dateFirst是当年第一天  
      dataNumber是当前日期是今年第多少天  
      用dataNumber + 当前年的第一天的周差距的和在除以7就是本年第几周
  */
  let dateNow = new Date(year, month - 1, date);
  let dateFirst = new Date(year, 0, 1);
  let dataNumber = Math.round((dateNow.valueOf() - dateFirst.valueOf()) / 86400000);
  return Math.ceil((dataNumber + ((dateFirst.getDay() + 1) - 1)) / 7);
}

/**
 * 获取今天的 年月日
 * @returns 
 */
function getCurrentYearMonthDay() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return {
    year: year,
    month: month,
    day: day
  }
}

/**
 * 检查是不是在指定时间范围内
 * 
 * 只能比较同一天之内的时间，不跨天比较
 * 24小时制，最大时间23:59
 * @param start 
 * @param end 
 * @returns 
 */
function inTimePeriod(start: string, end: string) {
  const now = new Date()
  const nowH = now.getHours() * 1
  const nowM = now.getMinutes() * 1
  const _now = nowH * 60 + nowM
  const startArr = start.split(":")
  const startH = parseInt(startArr[0]) * 1
  const startM = parseInt(startArr[1]) * 1
  const _start = startH * 60 + startM
  const endArr = end.split(":")
  const endH = parseInt(endArr[0]) * 1
  const endM = parseInt(endArr[1]) * 1
  const _end = endH * 60 + endM
  if (_now > _end) {
    // 已经过时
    return -1
  }
  if (_now >= _start && _now <= _end) {
    // 正在进行
    return 0
  }
  // 尚未开始
  return 1
}

/**
 * 【未国际化】 获取星期几的中文表达字符串
 * @param week （0-6）
 */
function getWeekdayStr(week: number) {

  switch (week) {
    case 1:
      return '星期一'
    case 2:
      return '星期二'
    case 3:
      return '星期三'
    case 4:
      return '星期四'
    case 5:
      return '星期五'
    case 6:
      return '星期六'
    case 0:
      return '星期日'
  }
  return '?' + week
}

/**
 * 计算两个日期之间的天数差距
 * @param s1
 * @param s2
 */
function getDayDiff(s1: Date, s2: Date) {
  let days = s2.getTime() - s1.getTime();
  let time = Math.floor(days / (1000 * 60 * 60 * 24));
  return time;
}

/**
 * 【未国际化】 计算天数与今天的差距，将返回： x天前、前天 、昨天、今天、明天、后天、x天后
 * @param y 年
 * @param m 月，与 Date.getMonth 一样需要减一
 * @param d 日
 */
function getDayGap(y: number, m: number, d: number) {
  let now = new Date();
  let diffDay = getDayDiff(new Date(), new Date(y, m, d)) + 1;
  if (diffDay == 0) return "今天"
  else if (diffDay == 1) return "明天"
  else if (diffDay == 2) return "后天"
  else if (diffDay == -1) return "昨天"
  else if (diffDay == -2) return "前天"
  else if (diffDay > 0) {
    if (diffDay > 365) return `${Math.floor(diffDay / 365)}年${diffDay % 365}天后`;
    else return `${diffDay}天后`;
  }
  else if (diffDay < 0) {
    if (diffDay < -365) return `${Math.floor(-diffDay / 365)}年${-diffDay % 365}天前`;
    else return `${-diffDay}天前`;
  }
}
/**
 * 获取今天的 00:00:00 时间
 * @returns 
 */
function getTodayStart() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return new Date(year, month - 1, day, 0, 0, 0)
}
/**
 * 获取今天的 23:59:59 时间
 * @returns 
 */
function getTodayEnd() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return new Date(year, month - 1, day, 23, 59, 59)
}
/**
 * 获取指定日期的 00:00:00 时间
 * @param date 
 * @returns 
 */
function getDateStartOfDay(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return new Date(year, month - 1, day, 0, 0, 0)
}
/**
 * 获取指定日期的 23:59:59 时间
 * @param date 
 * @returns 
 */
function getDateEndOfDay(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return new Date(year, month - 1, day, 23, 59, 59)
}
/**
 * 获取指定日期的月份起始
 * @param date 
 * @returns 
 */
function getDateStartOfMonth(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = 1
  return new Date(year, month - 1, day, 0, 0, 0)
}
/**
 * 获取指定日期的月份结束
 * @param date 
 * @returns 
 */
function getDateEndOfMonth(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = getMonthDays(year, month)
  return new Date(year, month - 1, day, 23, 59, 59)
}
/**
 * 获取指定日期的年份起始
 * @param date 
 * @returns 
 */
function getDateStartOfYear(date: Date) {
  const year = date.getFullYear()
  const month = 1
  const day = 1
  return new Date(year, month - 1, day, 0, 0, 0)
}
/**
 * 获取指定日期的年份结束
 * @param date 
 * @returns 
 */
function getDateEndOfYear(date: Date) {
  const year = date.getFullYear()
  const month = 12
  const day = getMonthDays(year, month)
  return new Date(year, month - 1, day, 23, 59, 59)
}
/**
 * 限制日期在源日期加上指定时长的范围内
 * @param sourceDate 源日期（基准日期）
 * @param limitDuration 限制时长（毫秒）
 * @param inputDate 需要检查的输入日期
 * @returns 如果输入日期超过源日期+限制时长，则返回限制的日期，否则返回输入日期
 */
function limitDateRange(sourceDate: Date | string | number, limitDuration: number, inputDate: Date | string | number) {
  const parsedSourceDate = DateUtils.parseDate(sourceDate);
  const parsedInputDate = DateUtils.parseDate(inputDate);
  const maxDate = new Date(parsedSourceDate.getTime() + limitDuration);
  return parsedInputDate <= maxDate ? parsedInputDate : maxDate;
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
  isSameDay,
  isSameYearAndMonth,
  getTodayStart,
  getTodayEnd,
  getDateStartOfDay,
  getDateEndOfDay,
  getDateStartOfMonth,
  getDateEndOfMonth,
  getDateStartOfYear,
  getDateEndOfYear,
  /**
   * 日期加上指定天数
   * @param date 日期
   * @param days 添加的天数
   */
  dateAddDays(date: Date, days = 1) {
    return new Date(date.getTime() + days * 86400000);
  },
  /**
   * 日期加上指定小时
   * @param date 日期
   * @param hours 添加的小时数
   */
  dateAddHours(date: Date, hours = 1) {
    return new Date(date.getTime() + hours * 1000 * 60 * 60);
  },
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
  getMonthDays,
  getDayWeekday,
  getWeekDatesForDate,
  getWeekDates,
  getWeekDatesForYMD,
  getDatesAfterWeeks,
  getCurrentWeekNumber,
  isToday,
  getMonthWeek,
  getYearWeek,
  getCurrentYearMonthDay,
  inTimePeriod,
  getWeekdayStr,
  getDayDiff,
  getDayGap,
  limitDateRange,
}

export default DateUtils;