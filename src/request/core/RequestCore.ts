import RequestApiConfig from './RequestApiConfig';
import { DataModel, type NewDataModel } from '@imengyu/js-request-transform';
import { RequestApiError, RequestApiResult } from './RequestApiResult';
import { defaultResponseDataHandler, defaultResponseErrorHandler } from './RequestHandler';
import type { HeaderType, QueryParams, TypeSaveable } from '../utils/AllType';
import type { KeyValue } from '@imengyu/js-request-transform/dist/DataUtils';
import type { RequestImplementer } from './RequestImplementer';
import StringUtils from '../../StringUtils';
import { PolyfillFormData } from '../implementer/Uniapp';
import LogUtils from '@/LogUtils';

/**
 * API 请求核心
 *
 * 功能介绍：
 *    本类是对 fetch 的封装，提供了基本的请求功能。
 *
 * Author: imengyu
 * Date: 2022/03/28
 *
 * Copyright (c) 2021 imengyu.top. Licensed under the MIT License.
 * See License.txt in the project root for license information.
 */

const TAG = 'API Debugger';

/**
 * 请求配置体
 */
export interface RequestCoreConfig<T extends DataModel> {
  /**
   * 基础URL
   */
  baseUrl: string;
  /**
   * 错误代码字符串数据
   */
  errCodes: { [index: number]: string };
  /**
   * 默认携带header
   */
  defaultHeader: HeaderType,
  /**
   * 超时时间 ms
   */
  timeout: number,
  /**
   * 请求拦截。此函数用于在请求提交时携带某些数据，您可以在这里可以添加token或其他头部信息。
   */
  requestInterceptor?: (url: string, req: RequestOptions) => { newUrl: string, newReq: RequestOptions }|Promise<{ newUrl: string, newReq: RequestOptions }>;
  /**
   * 响应拦截。通常用于处理响应数据，例如添加一些公共数据，
   * 这里是同步调用；异步的流程控制可以在 responseDataHandler 中处理。
   */
  responseInterceptor?: (response: RequestResponse) => RequestResponse;
  /**
   * 错误报告拦截
   * @param instance 请求实例
   * @param err 请求错误信息
   * @param apiInfo 请求信息
   * @returns 如果返回true，则不进行错误报告 reportError
   */
  responseErrorReportInterceptor?: (instance: RequestCoreInstance<T>, err: RequestApiError, response: RequestResponse, apiInfo: RequestApiInfoStruct) => boolean;
  /**
   * 错误报告函数。可以在这里报告错误，例如写入日志，上报到服务器。
   */
  reportError?: (instance: RequestCoreInstance<T>, err: RequestApiError|Error, response: RequestResponse, apiInfo: RequestApiInfoStruct) => void;

  /**
   * 自定义数据处理函数。
   * 此函数用于将后端返回数据进行处理，以供框架使用。
   * 
   * 因为后端返回的数据格式可能不是标准的格式，您可以在这里处理，将其转为标准格式。
   * * 您也可以在这里处理一些错误。
   * 
   * 您可以返回两种对象:
   * * `RequestApiResult` 表示请求成功.
   * * `throw RequestApiError` 表示请求失败，可以配置自定义错误信息。
   * @param response 请求返回的原始数据，未处理
   * @param req 请求参数
   * @param resultModelClass 结果模型类
   * @param instance 请求实例
   * @param apiInfo 请求信息
   * @returns 返回的对象将用于请求下一步处理。如果抛出了错误，那么还可以在 responseErrorReportInterceptor 中再处理一次错误
   */
  responseDataHandler?: (response: RequestResponse, req: RequestOptions, resultModelClass: NewDataModel|undefined, instance: RequestCoreInstance<T>, apiInfo: RequestApiInfoStruct) => Promise<RequestApiResult<unknown>>;
  /**
   * 自定义错误处理函数。
   * 此函数用于请求失败时，如何处理错误信息。
   * 未提供此函数时，会使用默认的错误处理函数。
   */
  responseErrorHandler?: (err: unknown, instance: RequestCoreInstance<T>, apiInfo: RequestApiInfoStruct) => RequestApiError;
  /**
   * 类自定义创建函数
   */
  modelClassCreator: ModelClassCreatorDefine<T>|null;
}
/**
 * 请求信息结构体
 */
export interface RequestApiInfoStruct {
  /**
   * 请求名称
   */
  apiName: string|undefined,
  /**
   * 请求方法
   */
  apiMethod: string|undefined,
  /**
   * 请求URL
   */
  apiUrl: string|undefined,
  /**
   * 请求原始参数
   */
  apiRawReq: RequestOptions|undefined,
}

/**
 * 请求返回体数据获取接口
 */
export interface RequestResponseGetData {
  json?: () => Promise<any>,
}
/**
 * 请求返回体
 */
export class RequestResponse {

  public constructor(options: {
    url: string,
    ok: boolean,
    headers: HeaderType,
    status: number,
    statusText: string,
    getData: RequestResponseGetData,
  }) {
    this.url = options.url;
    this.status = options.status;
    this.ok = options.ok;
    this.getData = options.getData;
    this.headers = options.headers;
    this.statusText = options.statusText;
  }
  getData: RequestResponseGetData;
  url: string;
  statusText: string;
  status: number;
  headers: HeaderType;
  ok: boolean;

  json() {
    if (!this.getData.json)
      throw new Error('ThisRequestResponse is not support json.');
    return this.getData.json();
  }
}

type ModelClassCreatorDefine<T> = (new () => T);

/**
 * 请求缓存配置
 */
export interface RequestCacheConfig {
  /**
   * 缓存保存时间，毫秒。超过时间后再请求时会发请求
   */
  cacheTime: number,
  /**
   * 是否启用缓存
   */
  cacheEnable: boolean,
}
/**
 * 请求缓存存储结构体
 */
export interface RequestCacheStorage {
  time: number,
  data: TypeSaveable
}

/**
 * 请求参数结构体
 */
export class RequestOptions {
  /**
   * 请求的参数
   */
  data?: string | object | ArrayBuffer | FormData;
  /**
  * 设置请求的 header，header 中不能设置 Referer。
  */
  headers?: any;
  /**
  * 默认为 GET
  * 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
  */
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
  /**
  * 超时时间
  */
  timeout?: number;
  /**
  * 如果设为json，会尝试对返回的数据做一次 JSON.parse
  */
  dataType?: string;
  /**
  * 设置响应的数据类型。合法值：text、arraybuffer
  */
  responseType?: string;
  /**
  * 验证 ssl 证书
  */
  sslVerify?: boolean;
  /**
  * 跨域请求时是否携带凭证
  */
  withCredentials?: boolean;
  /**
  * DNS解析时优先使用 ipv4
  */
  firstIpv4?: boolean;
}
/**
 * API 请求核心实例类，本类是对 fetch 的封装，提供了基本的请求功能。
 */
export class RequestCoreInstance<T extends DataModel> {

  /**
   * 请求核心实例类构造函数
   * @param implementer 请求实现类
   */
  constructor(implementer: RequestImplementer) {
    this.implementer = implementer;
    this.config.baseUrl = RequestApiConfig.getConfig().BaseUrl;
  }

  /**
   * 当前请求实例的请求配置项
   */
  config : RequestCoreConfig<T> = {
    baseUrl: '',
    errCodes: {},
    timeout: 10000,
    defaultHeader: RequestApiConfig.getConfig().DefaultHeader as HeaderType,
    modelClassCreator: null,
    responseDataHandler: defaultResponseDataHandler,
    responseErrorHandler: defaultResponseErrorHandler,
  };

  /**
   * 请求实现类
   */
  implementer: RequestImplementer;

  /**
   * 检查是否需要报告错误
   */
  checkShouldReportError(err: RequestApiError, response: RequestResponse, apiInfo: RequestApiInfoStruct) {
    if (typeof this.config.responseErrorReportInterceptor === 'function')
      return this.config.responseErrorReportInterceptor(this, err, response, apiInfo) !== true;
    return true;
  }
  /**
   * 报告错误
   * @param err 错误
   */
  reportError(err: RequestApiError|Error, response: RequestResponse, apiInfo: RequestApiInfoStruct) {
    if (this.checkShouldReportError(err as RequestApiError, response, apiInfo)) {
      if (typeof this.config.reportError === 'function')
        this.config.reportError(this, err, response, apiInfo);
    }
  }
  /**
   * 在配置中查找错误代码的说明文字
   * @param code 错误代码
   * @returns 说明文字，如果找不到，返回 undefined
   */
  findErrCode(code: number) : string|undefined {
    return this.config.errCodes[code];
  }

  /**
   * 合并URL
   */
  makeUrl(url: string, querys?: QueryParams) {
    let finalUrl = '';
    if (url.indexOf('http') === 0)
      finalUrl = url; //绝对地址
    else
      finalUrl = this.config.baseUrl + url;
    //处理query
    if (querys) {
      let i = finalUrl.indexOf('?') > 0 ? 1 : 0;
      for (const key in querys) {
        if (typeof querys[key] === 'undefined' || querys[key] === null)
          continue;
        finalUrl += i === 0 ? '?' : '&';
        if (typeof querys[key] === 'object')
          finalUrl += `${key}=` + encodeURIComponent(JSON.stringify(querys[key]));
        else
          finalUrl += `${key}=` + '' + querys[key];
        i++;
      }
    }
    return finalUrl;
  }
  //合并默认Header参数
  private mergerDefaultHeader(header: Record<string, unknown>) {
    const myHeaders = {} as Record<string, unknown>;
    for (const key in this.config.defaultHeader)
      myHeaders[key] = this.config.defaultHeader[key];
    if (header) {
      for (const key in header) 
        myHeaders[key] = header[key];
    }
    return myHeaders;
  }
  /**
   * 合并两个Header参数
   * @param header 合并目标
   * @param newHeader 新的Header
   * @returns 合并后的Header
   */
  mergerHeaders(header: Record<string, unknown>, newHeader: Record<string, unknown>) {
    if (!newHeader)
      return header;
    if (!header)
      return newHeader;
    for (const key in newHeader)
      header[key] = newHeader[key];
    return header;
  }

  //检查缓存参数
  private checkCacheTime(cache?: RequestCacheConfig) {
    return cache && cache.cacheEnable && cache.cacheTime || 0;
  }
  //请求缓存处理
  private async solveCache(url: string, req: RequestOptions, cache: RequestCacheConfig|undefined) : Promise<{
    cacheTime: number, 
    cacheKey: string, 
    cacheRes: TypeSaveable
  }> {
    const cacheTime = this.checkCacheTime(cache);
    let requestHash = '';
    if (cacheTime > 0) {
      if (req.method === 'GET')
        requestHash = "RequestCache" + StringUtils.stringHashCode(url + req.method);
      else
        requestHash = "RequestCache" + StringUtils.stringHashCode(url + req.method + JSON.stringify(req.data));
      //获取数据
      const cacheData = await this.implementer.getCache(requestHash)
      //没有过期
      if (cacheData && cacheData.time < new Date().getTime()) {
        return {
          cacheTime,
          cacheKey: requestHash,
          cacheRes: cacheData.time,
        }
      }
    }
    return {
      cacheTime,
      cacheKey: requestHash,
      cacheRes: null,
    }
  }

  /**
   * 通用的请求包装方法
   * @param url 请求URL
   * @param req 请求参数
   * @param apiName 名称，用于日志和调试
   * @returns 返回 Promise
   */
  async request<M = undefined>(url: string, querys: QueryParams|undefined, req: RequestOptions, apiName: string, modelClassCreator: ModelClassCreatorDefine<M>|undefined, cache?: RequestCacheConfig) : Promise<RequestApiResult<M>> {   
    //合并URL
    url = this.makeUrl(url, querys);
    //附加请求头
    req.headers = this.mergerDefaultHeader(req.headers);
    //拦截器
    if (this.config.requestInterceptor) {
      const { newUrl, newReq } = await this.config.requestInterceptor(url, req);
      url = newUrl;
      req = newReq;
    }
    if (req.data instanceof globalThis.FormData || req.data instanceof PolyfillFormData) {
      req.headers['Content-Type'] = 'multipart/form-data';
    } else if (typeof req.data === 'object' || req.data === undefined) {
      req.headers['Content-Type'] = 'application/json';
    }

    if (RequestApiConfig.getConfig().EnableApiRequestLog)
      LogUtils.printLog(TAG, 'message', `Q > ${apiName} [${req.method || 'GET'}] ` + url, req.data);

    //缓存处理
    const { cacheTime, cacheKey, cacheRes } = await this.solveCache(url, req, cache);

    //有缓存数据，则直接返回
    if (cacheRes) {
      if (RequestApiConfig.getConfig().EnableApiRequestLog)
        LogUtils.printLog(TAG, 'success', `C > ${apiName} (${cacheKey}/${cacheTime})`, ( RequestApiConfig.getConfig().EnableApiDataLog ? cacheRes.toString() : ''));
      return cacheRes as unknown as RequestApiResult<M>;
    }

    //发送请求并且处理响应数据
    const result = await this.requestAndResponse<M>(url, req, apiName, modelClassCreator);
    //保存缓存
    if (cacheTime > 0) {
      this.implementer.setCache(cacheKey, {
        time: new Date().getTime() + cacheTime,
        data: result as unknown as TypeSaveable,
      });
    }
    return result as RequestApiResult<M>;
  }

  //发送请求并且处理
  private async requestAndResponse<M = T>(url: string, req: RequestOptions, apiName: string, resultModelClass: ModelClassCreatorDefine<M>|undefined, saveCache?: (result: unknown) => void) {
   
    const apiInfo: RequestApiInfoStruct = {
      apiName,
      apiUrl: url,
      apiRawReq: req,
      apiMethod: req.method || 'GET',
    };
    
    if (!this.implementer)
      throw new RequestApiError(
        'scriptError', 
        'This RequestCoreInstance is not configured with request implementer! ', 
        '脚本异常', -1, 
        null, null, undefined, 
        apiInfo
      );
    
    try {
      //发起请求
      let res = await this.implementer.doRequest(url, req, this.config.timeout)
      //响应拦截
      if (this.config.responseInterceptor)
        res = this.config.responseInterceptor(res);

      if (!this.config.responseDataHandler)
        throw new RequestApiError(
          'scriptError', 
          'This RequestCoreInstance is not configured with responseDataHandler and cannot convert data! ', 
          '脚本异常', 
          -1, 
          undefined, undefined, undefined, 
          apiInfo
        );
      
      //处理数据
      const result = await this.config.responseDataHandler(res, req, resultModelClass as any, this, apiInfo)
      //尝试保存缓存
      saveCache && saveCache(result);
      //处理数据
      try {
        if (RequestApiConfig.getConfig().EnableApiRequestLog)
          LogUtils.printLog(TAG, 'success', `R > ${apiName} (${res.status}/${result.code})`, ( RequestApiConfig.getConfig().EnableApiDataLog ? result.toString() : ''));
        //返回
        return result;
      } catch (e) {
        //捕获处理代码的异常
        LogUtils.printLog(TAG, 'error', 'E > Catch exception in promise : ' + e + ((e as Error).stack ? ('\n' + (e as Error).stack) : ''));
        throw new RequestApiError(
          'scriptError', 
          '代码异常，请检查：' + e, 
          '脚本异常', 
          -1, 
          null, e as unknown as KeyValue, res.headers, 
          apiInfo
        );
      };
    } catch (err) {
      throw this.config.responseErrorHandler ? this.config.responseErrorHandler(err, this, apiInfo) : err;
    }
  }

  /**
   * GET 请求
   * @param url 请求URL
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  get<M = undefined>(url: string, apiName: string, querys?: QueryParams, modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request<M>(url, querys, { method: 'GET', headers }, apiName, modelClassCreator, cache);
  }
  /**
   * POST 请求
   * @param url 请求URL
   * @param data 请求Body参数
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  post<M = undefined>(url: string, apiName: string, data?: KeyValue|FormData|undefined, querys?: QueryParams, modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request<M>(url, querys, { method: 'POST', data, headers }, apiName, modelClassCreator, cache);
  }
  /**
   * PUT 请求
   * @param url 请求URL
   * @param data 请求Body参数
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  put<M = undefined>(url: string, apiName: string, data?: KeyValue|undefined, querys?: QueryParams, modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request<M>(url, querys, { method: 'PUT', data, headers }, apiName, modelClassCreator, cache);
  }
  /**
   * DELETE 请求
   * @param url 请求URL
   * @param data 请求Body参数
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  delete<M = undefined>(url: string, apiName: string, data?: KeyValue|undefined, querys?: QueryParams, modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request<M>(url, querys, { method: 'DELETE', data, headers }, apiName, modelClassCreator, cache);
  }
}
