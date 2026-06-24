/**
 * API 返回结构体定义
 *
 * 功能介绍：
 *    这里定义了API返回数据的基本结构体，分为正常结果和错误结果。
 *
 * Author: imengyu
 * Date: 2020/09/28
 *
 * Copyright (c) 2021 imengyu.top. Licensed under the MIT License.
 * See License.txt in the project root for license information.
 */

import { type NewDataModel } from "@imengyu/js-request-transform";
import type { KeyValue } from "@imengyu/js-request-transform/dist/DataUtils";
import { RequestApiInfoStruct, RequestOptions } from "./RequestCore";
import { HeaderType } from "../utils/AllType";
import { requireNotNull } from "@/Assertion";

/**
 * API 的返回结构体
 */
export class RequestApiResult<T = undefined> implements RequestApiInfoStruct {

  public apiName = '';
  public apiUrl = '';
  public apiMethod = '';
  public apiRawReq: RequestOptions|undefined;

  /**
   * 返回状态码
   */
  public code = 0;
  /**
   * 返回状态消息
   */
  public message = '';
  /**
   * 正常返回的数据
   */
  public data: T|undefined;
  /**
   * 本次请求的返回头
   */
  public headers: HeaderType|undefined;
  /**
   * 无类型数据
   */
  public data2: any = null;
  /**
   * 原始数据
   */
  public raw: any = null;
  /**
   * 指示data是否为数据模型类型
   */
  public readonly isDataModel: boolean;

  public constructor(
    c: NewDataModel|null, 
    code? : number, 
    message? : string, 
    data?: Record<string, unknown>|null, 
    rawData?: Record<string, unknown>|null,
    headers?: HeaderType|undefined,
    apiInfo?: RequestApiInfoStruct,
  ) {
    this.code = code || -1;
    this.message = message || '';
    this.data2 = data;
    this.headers = headers;
    this.isDataModel = c !== null;

    //转换数据
    if (typeof data !== 'undefined' && c)
      this.data = new c().fromServerSide(data as KeyValue) as T;//转换data
    else if (typeof rawData !== 'undefined' && c)
      this.data = new c().fromServerSide(rawData as KeyValue) as T;//如果data为空则转换rawData
    else
      this.data = data as KeyValue as T; //原始数据

    //如果rawData为空则使用data
    if (typeof rawData !== 'undefined')
      this.raw = rawData;
    else
      this.raw = this.data;

    //设置API信息
    if (apiInfo) {
      this.apiName = apiInfo.apiName || '';
      this.apiUrl = apiInfo.apiUrl || '';
      this.apiMethod = apiInfo.apiMethod || '';
      this.apiRawReq = apiInfo.apiRawReq;
    }
  }

  /**
   * 使用另一个数据实例克隆当前结果
   * @param model 另一个数据
   * @returns
   */
  public cloneWithOtherData<U extends Record<string, unknown> | null | undefined>(model: U) : RequestApiResult<U> {
    return new RequestApiResult(
      null,
      this.code,
      this.message,
      model,
      this.raw,
      this.headers,
      {
        apiName: this.apiName,
        apiUrl: this.apiUrl,
        apiMethod: this.apiMethod,
        apiRawReq: this.apiRawReq,
      },
    );
  }
  /**
   * 读取值并且确保不为空
   * @param assertMessage 断言消息
   * @returns
   */
  public requireData(assertMessage?: string) : T {
    return requireNotNull(this.data, assertMessage || ('data is null! at: ' + this.apiName + '(' + this.apiUrl + ')'));
  }
  /**
   * 转为字符串表达形式
   * @returns
   */
  public toString() : string {
    return `${this.code} ${this.message} data: ${JSON.stringify(this.data)} raw: ` + JSON.stringify(this.raw);
  }

  public setFormOtherData(data: KeyValue|RequestApiResult) {
    if (data instanceof RequestApiResult) {
      this.data = data.data;
      this.data2 = data.data2;
      this.code = data.code;
      this.message = data.message;
      this.headers = data.headers;
      this.raw = data.raw;
      this.apiName = data.apiName;
      this.apiUrl = data.apiUrl;
      this.apiMethod = data.apiMethod;
      this.apiRawReq = data.apiRawReq;
    } else {
      for (const key in data) {
        (this as unknown as Record<string, unknown>)[key] = data[key];
      }
    }
  }
}

/**
 * 指示这个错误发生的类型
 * 错误类型：
 * * networkError：网络连接错误
 * * statusError：状态错误（返回了400-499错误状态码）
 * * serverError：服务器错误（返回了500-599错误状态码）
 * * businessError：业务错误（状态码200，但是业务逻辑自定义判断条件失败）
 * * scriptError：脚本错误（通常是代码异常被catch）
 * * unknow：未知错误
 */
export type RequestApiErrorType = 'networkError'|'statusError'|'serverError'|'businessError'|'scriptError'|'unknow';

/**
 * API 的错误信息
 */
export class RequestApiError implements RequestApiInfoStruct {

  public apiName = '';
  public apiUrl = '';
  public apiMethod = '';
  public apiRawReq: RequestOptions|undefined;

  /**
   * 指示这个错误发生的类型
   * * networkError：网络连接错误
   * * statusError：状态错误（返回了400-499错误状态码）
   * * serverError：服务器错误（返回了500-599错误状态码）
   * * businessError：业务错误（状态码200，但是自定义判断条件失败）
   * * scriptError：脚本错误（通常是代码异常被catch）
   */
  public errorType : RequestApiErrorType = 'unknow';
  /**
   * 错误信息
   */
  public errorMessage: string;
  /**
   * code的错误信息
   */
  public errorCodeMessage: string;
  /**
   * 错误代号
   */
  public code = 0;
  /**
   * 本次请求的返回数据
   */
  public data: KeyValue|null = null;
  /**
   * 本次请求的原始返回数据
   */
  public rawData: KeyValue|null = null;
  /**
   * 本次请求的返回头
   */
  public headers: HeaderType|null = null;

  public constructor(
    errorType: RequestApiErrorType,
    errorMessage = '',
    errorCodeMessage = '',
    code = 0,
    data: KeyValue|null = null,
    rawData: unknown|null = null,
    headers?: HeaderType,
    apiInfo?: RequestApiInfoStruct,
  ) {
    this.errorType = errorType;
    this.errorMessage = errorMessage;
    this.errorCodeMessage = errorCodeMessage;
    this.code = code;
    this.data = data;
    this.apiName = apiInfo?.apiName || '';
    this.apiUrl = apiInfo?.apiUrl || '';
    this.apiMethod = apiInfo?.apiMethod || '';
    this.apiRawReq = apiInfo?.apiRawReq;
    this.rawData = rawData as KeyValue;
    this.headers = headers || null;
  }

  /**
   * 转为详情格式
   * @returns
   */
  public toStringDetail() {
    return `请求${this.apiName}错误 ${this.errorMessage} (${this.errorType}) ${this.code}(${this.errorCodeMessage})\n` +
      `url: ${this.apiUrl}\n` +
      `data: ${JSON.stringify(this.data)}\n` +
      `rawData: ${JSON.stringify(this.rawData)}\n`;
  }
  /**
   * 转为字符串表达形式
   * @returns
   */
  public toString(): string {
    return this.errorMessage;
  }
}
