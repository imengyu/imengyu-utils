import DateUtils from "./DateUtils";

const logMessageTimeStyle = 'color:#666;background:#efefef;padding:2px 3px;border-radius:2px;margin-right:5px;';
const logMessageTagStyle = (color: string) => `color:#fff;background:${color};padding:2px 3px;border-radius:2px;margin-right:5px;`;
const tagColors = {
  purple: '#80a',
  yellow: '#ff0',
  orange: '#f90',
  
  info: '#09f',
  debug: '#090',
  verbose: '#999',
  primary: '#04a',
  error: '#f55',
  exception: '#d11',
  warning: '#f90',
  message: '#06a',
  success: '#0a0',
};

export const LogUtils = {
  /**
   * 生成指定数量的空格字符串
   * @param str 原始字符串
   * @param minCount 最小空格数量
   * @param wide 是否使用全角空格
   * @returns 处理后的字符串
   */
  makeSpaceText(str: string | undefined | null, minCount: number, wide = false) {
    for (let i = str?.length || 0; i < minCount; i++)
      str += wide ? '  ' : ' ';
    return str;
  },
  /**
   * 打印日志
   * @param tagName 标签名
   * @param type 日志类型
   * @param message 日志消息
   * @param data 可选的日志数据
   */
  printLog(tagName: string, type: keyof typeof tagColors, message: string, data?: unknown) {
    const now = new Date();
    const timeString = LogUtils.makeSpaceText(`${DateUtils.formatDate(now, 'HH:ii:ss')}.${now.getMilliseconds()}`, 12);

    if (data !== undefined) {
      console.log(
        `%c${tagName}` +
        `%c${timeString}%c` +
        ' ' +
        message +
        ' %o',
        logMessageTagStyle(tagColors[type]),
        logMessageTimeStyle,
        '',
        data,
      );
    } else {
      console.log(
        `%c${tagName}` +
        `%c${timeString}%c` +
        ' ' +
        message,
        logMessageTagStyle(tagColors[type]),
        logMessageTimeStyle,
        '',
      );
    }
  }
};

export default LogUtils;