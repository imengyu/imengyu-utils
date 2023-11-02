import ObjectUtils from "./ObjectUtils";
import StringUtils from "./StringUtils";

let prefix = 'Settings_';

/**
 * 设置工具类. 基于LocalStorage
 */
const SettingsUtils = {
  /**
   * 设定设置条目在 localStorage 中存储键值前缀
   * @param _prefix 前缀
   */
  setPrefix(_prefix: string) {
    prefix = _prefix;
  },
  /**
   * 读取设置，如果没有找到设置，则返回默认值
   * @param key 设置的键值
   * @param defaultValue 设置的默认值
   * @param copyUndefinedFromDefault 当遇到空对象时是否从默认设置拷贝
   */
  getSettings<T extends Record<string,any>|bigint|number|boolean|Array<unknown>|string>(key : string, defaultValue : T, copyUndefinedFromDefault = true) : T {
    const set = localStorage.getItem(`${prefix}${key}`);
    if(!set || StringUtils.isNullOrEmpty(set))
      return defaultValue;
    let ret = JSON.parse(set) as T;
    if (copyUndefinedFromDefault && typeof ret === 'object')
      ret = ObjectUtils.copyValuesIfUndefined(ret as any, defaultValue);
    return ret;
  },
  /**
   * 设置设置
   * @param key 设置的键值
   * @param value 设置的新值
   */
  setSettings(key : string, value : Record<string,any>|number|boolean|bigint|Array<unknown>|string) : void {
    localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
  },
}

export default SettingsUtils;