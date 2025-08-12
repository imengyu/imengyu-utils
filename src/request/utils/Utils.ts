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

import { PolyfillFormData } from "../implementer/Uniapp";

export function appendGetUrlParams(url: string, key: string, value: any) {
  if (!url.includes(`?${key}`) && !url.includes(`&${key}`)) {
    if (url.includes('?'))
      url = url + '&' + key + '=' + value;
    else
      url = url + '?' + key + '=' + value;
  }
  return url;
}
export function appendPostParams(source: any, key: string, value: any) {
  if (source instanceof FormData && !source.has(key))
    source.append(key, value);
  if (source instanceof PolyfillFormData && !source.has(key))
    source.append(key, value);
  else if (typeof source === 'object' && source[key] === undefined)
    source = { ...source, [key]: value };
  return source;
}