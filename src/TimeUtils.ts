import DateUtils from './DateUtils';
import FormatUtils from './FormatUtils';
import StringUtils from './StringUtils'

/**
 * 时间工具类
 */
const TimeUtils = {
  getNowTimeString,
  getTimeStringSec,
  getBetterDate,
  getTimeAgo,
  getTimeSurplus,
  splitMillSeconds,
  secondToTimes,
  millsecondToTimes,
  timeExpire,
}

export default TimeUtils;
/**
 * 将毫秒分隔为时分秒
 * @param ms 毫秒
 */
function splitMillSeconds(ms: number) {
  let nowSub = ms;
  const days = Math.floor(nowSub / 86400000); nowSub -= days * 86400000;
  const hours = Math.floor(nowSub / 3600000); nowSub -= hours * 3600000;
  const minutes = Math.floor(nowSub / 60000); nowSub -= minutes * 60000;
  const seconds = Math.floor(nowSub / 1000); nowSub -= seconds * 1000;

  return {
    total: ms,
    days,
    hours,
    minutes,
    seconds,
    milliseconds: nowSub,
  };
}
/**
 * 秒转 x天x时x分x秒 这种格式
 * @param sec 秒数
 * @param autoCollapse 如果数为0是否省略之前的单位
 */
function secondToTimes(sec: number, autoCollapse = true, langStrings = {
  year: '年',
  month: '月',
  day: '日',
  hour: '时',
  minute: '分',
  second: '秒',
}): string {
  return millsecondToTimes(sec * 1000, autoCollapse, langStrings);
}
/**
 * 豪秒转 x天x时x分x秒 这种格式
 * @param msec 豪秒数
 * @param autoCollapse 如果数为0是否省略之前的单位
 */
function millsecondToTimes(msec: number, autoCollapse = true, langStrings = {
  year: '年',
  month: '月',
  day: '日',
  hour: '时',
  minute: '分',
  second: '秒',
}): string {
  let nowSub = msec;
  const days = Math.floor(nowSub / 86400000); nowSub -= days * 86400000;
  const hours = Math.floor(nowSub / 3600000); nowSub -= hours * 3600000;
  const minutes = Math.floor(nowSub / 60000); nowSub -= minutes * 60000;
  const seconds = Math.floor(nowSub / 1000); nowSub -= seconds * 1000;
  if (autoCollapse) {
    let str = '';
    if (days > 0) str += `${days}${langStrings.day}`;
    if (hours > 0) str += `${hours}${langStrings.hour}`;
    if (minutes > 0) str += `${minutes}${langStrings.minute}`;
    str += `${seconds}${langStrings.second}`;
    return str;
  }
  return `${days}${langStrings.day}${hours}${langStrings.hour}` + 
    `${minutes}${langStrings.minute}${seconds}${langStrings.second}`;
}
/**
 * 检查时间是否过期
 * @param time 时间
 * @param now 判断依据，默认是当前时间
 */
function timeExpire(time: Date|number, now = new Date()) {
  if (typeof time === 'number')
    return time < now.getTime();
  return time.getTime() < now.getTime();
}

/**
 * 获取当前时间的字符串
 * @param is24HTime 是否是24小时制
 * @param includeSecond 是否添加秒时间0.
 */
function getNowTimeString(is24HTime: boolean, includeSecond = false): string {
  const now = new Date();
  let str = '';
  if (!is24HTime) {
    const hours = now.getHours() === 12 ? 12 : now.getHours() % 12;
    str =
      FormatUtils.formatNumberWithZero(hours, 2) + ':' +
      FormatUtils.formatNumberWithZero(now.getMinutes(), 2);
  } else {
    str =
      FormatUtils.formatNumberWithZero(now.getHours(), 2) + ':' +
      FormatUtils.formatNumberWithZero(now.getMinutes(), 2);
  }
  str += (includeSecond ? (':' + FormatUtils.formatNumberWithZero(now.getSeconds(), 2)) : '');
  if (!is24HTime)
    str += (now.getHours() >= 12 ? 'pm' : 'am');
  return str;
}
/**
 * 获取对用户友好的日期字符串
 * @param date 时间
 * @returns 
 */
function getBetterDate(date: Date, langStrings = {
  year: '年',
  month: '月',
  day: '日',
  today: '今天',
}): string {
  let str = '';
  const now = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (year !== now.getFullYear()) str += year + langStrings.year;
  if (year !== now.getFullYear() || month !== now.getMonth() + 1) str += year + langStrings.month;
  if (date.getDate() === now.getDate()) str += langStrings.today;
  else str += date.getDate() + langStrings.day;
  str += ' ' + DateUtils.formatDate(date, 'HH:mm');
  return str
}
/**
 * 将以秒为单位的时间转换为对用户友好的时间字符串。
 * 通常可以用于 audio、video 的 duration、time 字符串格式化。
 * @param second 时间，秒为单位
 * @param mill 是否显示毫秒，默认 false
 * @returns 
 */
function getTimeStringSec(second: number, mill = false) {
  let s = second;
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  const h = Math.floor(s / 60)
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = Math.floor(s % 60);
  //将变量转换为字符串
  let hs = h.toString();
  let ss = s.toString();
  //如果只有一位数，前面增加一个0
  hs = (hs.length === 1) ? '0' + hs : hs;
  ss = (ss.length === 1) ? '0' + ss : ss;
  return hs + ':' + ss + (mill ? ('.' + FormatUtils.formatNumberWithZero(Math.floor(second * 1000) % 1000, 3)) : '');
}
/**
 * 转换时间为 刚刚、几分钟前、几小时前、几天前...
 * @param dateTimeStamp 时间
 */
function getTimeAgo(time: Date, langStrings = {
  secretTime: '神秘时间',
  yearsAgo: '年前',
  monthAgo: '月前',
  weeksAgo: '周前',
  daysAgo: '天前',
  hoursAgo: '小时前',
  minutesAgo: '分钟前',
  justNow: '刚刚',
}) {

  if (!time)
    return langStrings.secretTime;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const halfamonth = day * 15;
  const month = day * 30;
  const year = day * 365;
  const now = new Date().getTime();
  const diffValue = now - time.getTime();
  let result;
  if (diffValue < 0) {
    return;
  }
  const yearC = diffValue / year;
  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;
  if (yearC >= 1) {
    result = Math.floor(yearC) + langStrings.yearsAgo;
  } else if (monthC >= 1) {
    result = Math.floor(monthC) + langStrings.monthAgo;
  } else if (weekC >= 1) {
    result = Math.floor(weekC) + langStrings.weeksAgo;
  } else if (dayC >= 1) {
    result = Math.floor(dayC) + langStrings.daysAgo
  } else if (hourC >= 1) {
    result = Math.floor(hourC) + langStrings.hoursAgo;
  } else if (minC >= 1) {
    result = Math.floor(minC) + langStrings.minutesAgo;
  } else
    result = langStrings.justNow;
  return result;
}
/**
 * 计算剩余时间为用户可读时间
 * @param limitTime 时间
 */
function getTimeSurplus(limitTime: Date, langStrings = {
  second: '秒',
  minute: '分钟',
  hour: '小时',
  day: '天',
  overTime: '已经超过时间了',
}) {
  let date1 = new Date(limitTime);//开始时间
  let date2 = new Date(); //结束时间
  let date3 = date1.getTime() - date2.getTime()  //时间差的毫秒数

  if (date3 <= 0) return langStrings.overTime;

  //计算出相差天数
  let days = Math.floor(date3 / (24 * 3600 * 1000))
  //计算出小时数
  let leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  let leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  let leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000)

  if (days > 0) return days + langStrings.day;
  else if (hours > 0) return hours + langStrings.hour;
  else if (minutes > 0) return minutes + langStrings.minute;
  else if (seconds > 0) return seconds + langStrings.second;

  return langStrings.overTime;
}
