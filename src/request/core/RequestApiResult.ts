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

import { DataModel, type NewDataModel } from "@imengyu/js-request-transform";
import type { KeyValue } from "@imengyu/js-request-transform/dist/DataUtils";

/**
 * API 的返回结构体
 */
export class RequestApiResult<T extends DataModel> {
  public code = 0;
  public message = '';
  public data: T|KeyValue|KeyValue[]|null = null;
  /**
   * 无类型数据
   */
  public data2: any = null;
  public raw: any = null;

  public constructor(c: NewDataModel|null, code? : number, message? : string, data?: Record<string, unknown>|null, rawData?: Record<string, unknown>|null) {
    if (typeof code !== 'undefined')
      this.code = code;
    if (typeof message !== 'undefined')
      this.message = message;

    //转换数据
    if (typeof data !== 'undefined' && c)
      this.data = new c().fromServerSide(data as KeyValue) as T;//转换data
    else if (typeof rawData !== 'undefined' && c)
      this.data = new c().fromServerSide(rawData as KeyValue) as T;//如果data为空则转换rawData
    else
      this.data = data as KeyValue as T; //原始数据
    if (typeof rawData !== 'undefined')
      this.raw = rawData;
    else
      this.raw = this.data;
    this.data2 = this.data;
  }

  /**
   * 使用另一个数据实例克隆当前结果
   * @param model 另一个数据
   * @returns
   */
  public cloneWithOtherModel<U extends DataModel>(model: U) : RequestApiResult<U> {
    return new RequestApiResult(
      null,
      this.code,
      this.message,
      model.keyValue(),
      this.raw
    );
  }
  public arrayData() : KeyValue[] {
    if (this.data instanceof Array)
      return this.data;
    throw new Error('不是数组类型');
  }
  /**
   * 转为纯JSON格式
   * @returns
   */
  public keyValueData() : KeyValue {
    if (this.data instanceof Array)
      throw new Error('RequestApiResult.keyValueData: 不能转换数组类型');
    return (this.data instanceof DataModel ? this.data?.keyValue() : this.data) || {};
  }
  /**
   * 转为字符串表达形式
   * @returns
   */
  public toString() : string {
    return `${this.code} ${this.message} data: ${JSON.stringify(this.data)} raw: ` + JSON.stringify(this.raw);
  }
}

/**
 * 指示这个错误发生的类型
 */
export type RequestApiErrorType = 'networkError'|'statusError'|'serverError'|'businessError'|'scriptError'|'unknow';

/**
 * API 的错误信息
 */
export class RequestApiError {

  /**
   * 本次请求错误的 API 名字
   */
  public apiName = '';
  /**
   * 本次请求错误的 API URL
   */
  public apiUrl = '';
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
   * 本次请求的原始参数
   */
  public rawRequest: RequestInit|null = null;

  public constructor(
    errorType: RequestApiErrorType,
    errorMessage = '',
    errorCodeMessage = '',
    code = 0,
    data: KeyValue|null = null,
    rawData: unknown|null = null,
    rawRequest: RequestInit|null = null,
    apiName = '',
    apiUrl = ''
  ) {
    this.errorType = errorType;
    this.errorMessage = errorMessage;
    this.errorCodeMessage = errorCodeMessage;
    this.code = code;
    this.data = data;
    this.apiName = apiName;
    this.apiUrl = apiUrl;
    this.rawData = rawData as KeyValue;
    this.rawRequest = rawRequest as KeyValue;
  }

  /**
   * 转为详情格式
   * @returns
   */
  public toStringDetail() {
    return `请求${this.apiName}错误 ${this.errorMessage} (${this.errorType}) ${this.code}(${this.errorCodeMessage})\n` +
      `url: ${this.apiUrl}\n` +
      `data: ${JSON.stringify(this.data)}\n` +
      `rawData: ${JSON.stringify(this.rawData)}\n` +
      `rawRequest: ${JSON.stringify(this.rawRequest)}\n`;
  }
  /**
   * 转为字符串表达形式
   * @returns
   */
  public toString(): string {
    return this.errorMessage;
  }
}
