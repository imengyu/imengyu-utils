/**
 * 请求工具所使用的工具函数
 *
 * 功能介绍：
 *  提供了一些处理工具函数，方便使用。
 *
 * Author: imengyu
 * Date: 2022/03/25
 *
 * Copyright (c) 2021 imengyu.top. Licensed under the MIT License.
 * See License.txt in the project root for license information.
 */

import { RequestApiError } from "../core/RequestApiResult";
import { PolyfillFormData } from "../implementer/Uniapp";

/**
 * 追加GET参数
 * @param url GET请求的URL
 * @param key 参数名
 * @param value 参数值
 * @returns 追加后的GET请求URL
 */
export function appendGetUrlParams(url: string, key: string, value: any) {
  if (!url.includes(`?${key}`) && !url.includes(`&${key}`)) {
    if (url.includes('?'))
      url = url + '&' + key + '=' + value;
    else
      url = url + '?' + key + '=' + value;
  }
  return url;
}
/**
 * 追加POST参数
 * @param source POST参数的对象
 * @param key 参数名
 * @param value 参数值
 * @returns 追加后的POST参数对象
 */
export function appendPostParams(source: any, key: string, value: any) {
  if (source instanceof globalThis.FormData && !source.has(key))
    source.append(key, value);
  if (source instanceof PolyfillFormData && !source.has(key))
    source.append(key, value);
  else if (typeof source === 'object' && source[key] === undefined)
    source = { ...source, [key]: value };
  return source;
}
/**
 * 格式化错误信息
 * @param e 错误对象
 * @returns 格式化后的错误信息
 */
export function formatError(e: any) {
  if (e?.errMsg) 
    return e.errMsg;
  if (e instanceof RequestApiError) 
    return e.errorMessage + (e.errorCodeMessage ? ` (${e.errorCodeMessage})` : '');
  if (e instanceof Error) 
    return e.message;
  else 
    return '' + (e ?? '未知错误');
}