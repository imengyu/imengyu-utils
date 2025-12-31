import DateUtils from "./DateUtils";
import ObjectUtils from "./ObjectUtils";

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
   * 格式化任意错误信息
   * @param error 错误对象
   * @returns 格式化后的错误信息字符串
   */
  formatAnyError(error: any) {
    if (error instanceof Error)
      return LogUtils.formatError(error);
    if (typeof error === 'object')
      return 'ErrorObject: ' + ObjectUtils.stringifyNoCircular(error);
    return `${error}`;
  },
  /**
   * 格式化错误信息
   * @param error 错误对象
   * @returns 格式化后的错误信息字符串
   */
  formatError(error: Error) {
    return `${error.stack || error.message}`;
  },
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
  },
  /**
   * 打印日志并返回对象
   * @param obj 要返回的对象
   * @returns 返回对象
   */
  logAndReturn<T>(obj: T, message = '返回对象') {
    console.log(message, obj);
    return obj;
  }
};

export default LogUtils;