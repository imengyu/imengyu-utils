import DateUtils from "./DateUtils";

const logMessageTimeStyle = 'color:#666;background:#efefef;padding:2px 3px;border-radius:2px;margin-right:5px;';
const logMessageTagStyle = (color: string) => `color:#fff;background:${color};padding:2px 3px;border-radius:2px;margin-right:5px;`;
const tagColors = {
  purple: '#80a',
  primary: '#04a',
  error: '#f55',
  exception: '#d11',
  warning: '#f90',
  message: '#06a',
  success: '#0a0',
};

export const LogUtils = {
  makeSpaceText(str: string | undefined | null, minCount: number, wide = false) {
    for (let i = str?.length || 0; i < minCount; i++)
      str += wide ? '  ' : ' ';
    return str;
  },
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