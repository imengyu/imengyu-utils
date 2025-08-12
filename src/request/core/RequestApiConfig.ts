/**
 * 请求的默认配置
 *
 * 说明：
 *  此处提供的是请求中的默认配置。
 *
 * Author: imengyu
 * Date: 2022/03/25
 *
 * Copyright (c) 2021 imengyu.top. Licensed under the MIT License.
 * See License.txt in the project root for license information.
 */

import type { KeyValue } from "@imengyu/js-request-transform/dist/DataUtils";

interface ApiConfigInterface {
  /**
   * 默认转换日期的格式
   */
  DataDateFormat: string,
  /**
  * 所有请求默认携带的header
  */
  DefaultHeader: KeyValue,
  /**
  * 是否在在控制台上打印出请求信息
  */
  EnableApiRequestLog: boolean,
  /**
  * 是否在每一个请求都在控制台上打印出休息数据
  */
  EnableApiDataLog: boolean,
  /**
   * 基础请求地址
   */
  BaseUrl: string;
}

const defaultConfig = {
  BaseUrl: '',
  DataDateFormat: 'YYYY-MM-DD HH:mm:ss',
  DefaultHeader: {},
  EnableApiRequestLog: true,
  EnableApiDataLog: false,
} as ApiConfigInterface;

let config = defaultConfig;

/**
 * 请求中的默认配置
 */
const RequestApiConfig = {
  getConfig() : ApiConfigInterface { return config; },
  setConfig(newConfig: ApiConfigInterface): void { config = newConfig; },
};

export default RequestApiConfig;
