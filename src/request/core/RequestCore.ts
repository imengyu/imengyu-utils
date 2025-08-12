import RequestApiConfig from './RequestApiConfig';
import { DataModel, type NewDataModel } from '@imengyu/js-request-transform';
import { RequestApiError, RequestApiResult } from './RequestApiResult';
import { defaultResponseDataHandler, defaultResponseErrorHandler } from './RequestHandler';
import type { HeaderType, QueryParams, TypeSaveable } from '../utils/AllType';
import type { KeyValue } from '@imengyu/js-request-transform/dist/DataUtils';
import type { RequestImplementer } from './RequestImplementer';
import StringUtils from '../../StringUtils';
import { PolyfillFormData } from '../implementer/Uniapp';

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
   * 请求拦截
   */
  requestInceptor?: (url: string, req: RequestOptions) => { newUrl: string, newReq: RequestOptions };
  /**
   * 响应拦截
   */
  responseInceptor?: (response: RequestResponse) => RequestResponse;
  /**
   * 错误报告拦截。如果返回true，则不进行错误报告
   */
  responseErrReoprtInceptor?: (instance: RequestCoreInstance<T>, err: RequestApiError) => boolean;
  /**
   * 错误报告函数
   */
  reportError?: (instance: RequestCoreInstance<T>, err: RequestApiError|Error) => void;

  /**
   * 自定义数据处理函数
   */
  responseDataHandler?: (response: RequestResponse, req: RequestOptions, resultModelClass: NewDataModel|undefined, instance: RequestCoreInstance<T>, apiName: string|undefined) => Promise<RequestApiResult<T>>;
  /**
   * 自定义错误处理函数
   */
  responseErrorHandler?: (err: Error, instance: RequestCoreInstance<T>, apiName: string|undefined) => RequestApiError;
  /**
   * 类自定义创建函数
   */
  modelClassCreator: ModelClassCreatorDefine<T>|null;
}


export interface RequestResponseGetData {
  json?: () => Promise<any>,
}
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

export interface RequestCacheStorage {
  time: number,
  data: TypeSaveable
}

export class RequestOptions {
  /**
   * 请求的参数
   */
  data?: string | object | ArrayBuffer | FormData;
  /**
  * 设置请求的 header，header 中不能设置 Referer。
  */
  header?: any;
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
  checkShouldReportError(err: RequestApiError) {
    if (typeof this.config.responseErrReoprtInceptor === 'function')
      return this.config.responseErrReoprtInceptor(this, err) !== true;
    return true;
  }
  /**
   * 报告错误
   * @param err 错误
   */
  reportError(err: RequestApiError|Error) {
    if (this.checkShouldReportError(err as RequestApiError)) {
      if (typeof this.config.reportError === 'function')
        this.config.reportError(this, err);
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
  private solveCache(url: string, req: RequestOptions, cache: RequestCacheConfig|undefined, callback: (cacheTime: number, cacheKey: string, res: TypeSaveable) => void) {
    const cacheTime = req.method === 'GET' ? this.checkCacheTime(cache) : 0;
    let requestHash = '';
    if (cacheTime > 0) {
      requestHash = "RequestCache" + StringUtils.stringHashCode(url + req.method);
      //获取数据
      this.implementer.getCache(requestHash).then((cacheData) => {
        if (!cacheData) {
          callback(cacheTime, requestHash, null);
          return;
        }
        //没有过期
        if (cacheData.time < new Date().getTime()) {
          callback(cacheTime, requestHash, cacheData.time);
          return;
        }
        callback(cacheTime, requestHash, null);
      }).catch(() => {
        callback(cacheTime, requestHash, null);
      }); 
    } else
      callback(cacheTime, requestHash, null);
  }

  /**
   * 通用的请求包装方法
   * @param url 请求URL
   * @param req 请求参数
   * @param apiName 名称，用于日志和调试
   * @returns 返回 Promise
   */
  request<M = T>(url: string, req: RequestOptions,  apiName: string, modelClassCreator: ModelClassCreatorDefine<M>|undefined, cache?: RequestCacheConfig) : Promise<RequestApiResult<T>> {
    return new Promise<RequestApiResult<T>>((resolve, reject) => {
      //附加请求头
      req.header = this.mergerDefaultHeader(req.header);
      
      //拦截器
      if (this.config.requestInceptor) {
        const { newUrl, newReq } = this.config.requestInceptor(url, req);
        url = newUrl;
        req = newReq;
      }
      if (req.data instanceof FormData || req.data instanceof PolyfillFormData) {
        req.header['Content-Type'] = 'multipart/form-data';
      } else if (typeof req.data === 'object' || req.data === undefined) {
        req.header['Content-Type'] = 'application/json';
      }

      if (RequestApiConfig.getConfig().EnableApiRequestLog)
        console.log(`[API Debugger] Q > ${apiName} [${req.method || 'GET'}] ` + url, req.data);

      //缓存处理
      this.solveCache(url, req, cache, (cacheTime, cacheKey, cacheRes) => {

        //有缓存数据，则直接返回
        if (cacheRes) {
          if (RequestApiConfig.getConfig().EnableApiRequestLog)
            console.log(`[API Debugger] C > ${apiName} (${cacheKey}/${cacheTime})`, ( RequestApiConfig.getConfig().EnableApiDataLog ? cacheRes.toString() : ''));
          resolve(cacheRes as unknown as RequestApiResult<T>);
          return;
        }

        //发送请求并且处理响应数据
        this.requestAndResponse(url, req, apiName, modelClassCreator, (result) => {
          //保存缓存
          if (cacheTime > 0) {
            this.implementer.setCache(cacheKey, {
              time: new Date().getTime() + cacheTime,
              data: result as unknown as TypeSaveable,
            });
          }
        }).then((d) => {
          resolve(d);
        }).catch((e) => {
          reject(e);
        });
      });
    });
  }

  //发送请求并且处理
  private requestAndResponse<M = T>(url: string, req: RequestOptions, apiName: string, resultModelClass: ModelClassCreatorDefine<M>|undefined, saveCache?: (result: unknown) => void) {
    return new Promise<RequestApiResult<T>>((resolve, reject) => {
      //发起请求
      this.implementer.doRequest(url, req, this.config.timeout).then((res) => {
        //响应拦截
        if (this.config.responseInceptor)
          res = this.config.responseInceptor(res);

        if (this.config.responseDataHandler) {
          //处理数据
          this.config.responseDataHandler(res, req, resultModelClass as any, this, apiName).then((result) => {
            //尝试保存缓存
            saveCache && saveCache(result);
            //处理数据
            try {
              if (RequestApiConfig.getConfig().EnableApiRequestLog)
                console.log(`[API Debugger] R > ${apiName} (${res.status}/${result.code})`);
              //返回
              resolve(result);
            } catch (e) {
              //捕获处理代码的异常
              console.error('[API Debugger] E > Catch exception in promise : ' + e + ((e as Error).stack ? ('\n' + (e as Error).stack) : ''));
              reject(new RequestApiError('scriptError', '代码异常，请检查：' + e, '脚本异常', -1, null, e as unknown as KeyValue, req, apiName));
            }
          }).catch((e) => {
            reject(e);
          });
        }
        else
          reject(new RequestApiError('scriptError', 'This RequestCoreInstance is not configured with responsedatahandler and cannot convert data! ', '脚本异常', -1, null, null, req, apiName));
      }).catch((err) => {
        reject(this.config.responseErrorHandler ? this.config.responseErrorHandler(err, this, apiName) : err);
      });
    });
  }

  /**
   * GET 请求
   * @param url 请求URL
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  get<M = T>(url: string, apiName: string, querys?: QueryParams, modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request(this.makeUrl(url, querys), { method: 'GET', header: headers }, apiName, modelClassCreator, cache);
  }
  /**
   * POST 请求
   * @param url 请求URL
   * @param data 请求Body参数
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  post<M = T>(url: string, data: KeyValue|FormData, apiName: string, querys?: QueryParams, modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request(this.makeUrl(url, querys), { method: 'POST', data, header: headers }, apiName, modelClassCreator, cache);
  }
  /**
   * PUT 请求
   * @param url 请求URL
   * @param data 请求Body参数
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  put<M = T>(url: string, data: KeyValue, apiName: string,querys?: QueryParams,  modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request(this.makeUrl(url, querys), { method: 'PUT', data, header: headers }, apiName, modelClassCreator, cache);
  }
  /**
   * DELETE 请求
   * @param url 请求URL
   * @param data 请求Body参数
   * @param querys 请求URL参数
   * @param cache 缓存参数
   */
  delete<M = T>(url: string, data: KeyValue, apiName: string, querys?: QueryParams, modelClassCreator?: ModelClassCreatorDefine<M>, cache?: RequestCacheConfig, headers?: KeyValue) {
    return this.request(this.makeUrl(url, querys), { method: 'DELETE', data, header: headers }, apiName, modelClassCreator, cache);
  }
}
