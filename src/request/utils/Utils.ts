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
  if (typeof e === 'string' || typeof e === 'number' || typeof e === 'boolean')
    return e;
  if (e?.errMsg) 
    return e.errMsg;
  if (e instanceof RequestApiError) 
    return e.errorMessage + (e.errorCodeMessage ? ` (${e.errorCodeMessage})` : '');
  if (e instanceof Error) 
    return e.message;
  if (typeof e === 'object') 
    return formatObject(e);
  return '' + (e ?? '未知错误');
}

function formatObject(obj: any, indent = 0, seen = new WeakSet<object>()): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) {
    if (seen.has(obj)) return '[Circular]';
    seen.add(obj);
    const items = obj.map(item => formatObject(item, indent + 1, seen));
    if (items.length === 0) return '[]';
    const pad = '  '.repeat(indent + 1);
    const closePad = '  '.repeat(indent);
    return `[\n${items.map(i => `${pad}${i}`).join(',\n')}\n${closePad}]`;
  }
  if (seen.has(obj)) return '[Circular]';
  seen.add(obj);
  const keys = Object.keys(obj);
  if (keys.length === 0) return '{}';
  const pad = '  '.repeat(indent + 1);
  const closePad = '  '.repeat(indent);
  const entries = keys.map(key => `${pad}${key}: ${formatObject(obj[key], indent + 1, seen)}`);
  return `{\n${entries.join(',\n')}\n${closePad}}`;
}