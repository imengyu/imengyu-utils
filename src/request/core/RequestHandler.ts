import ApiConfig from "./RequestApiConfig";
import { DataModel, type NewDataModel } from "@imengyu/js-request-transform";
import { RequestApiError, type RequestApiErrorType, RequestApiResult } from "./RequestApiResult";
import { RequestCoreInstance, RequestOptions, RequestResponse } from "./RequestCore";

/**
 * 请求错误与数据处理函数
 *
 * 这里写的是请求中的 数据处理函数 与 错误默认处理函数。
 *
 * 业务相关的自定义数据处理函数，请单独在RequestModules中写明。
 *
 * Author: imengyu
 * Date: 2022/03/28
 *
 * Copyright (c) 2021 imengyu.top. Licensed under the MIT License.
 * See License.txt in the project root for license information.
 */

//默认的请求数据处理函数
export function defaultResponseDataHandler<T extends DataModel>(response: RequestResponse, req: RequestOptions, resultModelClass: NewDataModel|undefined, instance: RequestCoreInstance<T>, apiName: string|undefined) : Promise<RequestApiResult<T>> {
  return new Promise<RequestApiResult<T>>((resolve, reject) => {
    const method = req.method || 'GET';
    response.json().then((json) => {
      //情况1，有返回数据
      if (response.ok) {
        if (ApiConfig.getConfig().EnableApiRequestLog)
          console.log(`[API Debugger] Request [${method}] ` + response.url + ' success (' + response.status + ') ' + (ApiConfig.getConfig().EnableApiDataLog ? JSON.stringify(json) : ''));

        //情况1-1，请求成功，状态码200-299
        resolve(new RequestApiResult(resultModelClass ?? instance.config.modelClassCreator, response.status, json.message, json.data, json));
      } else {
        if (ApiConfig.getConfig().EnableApiRequestLog)
          console.log(`[API Debugger] Request [${method}] ${response.url} Got error from server : ` + json.message + ' (' + json.code + ') ' + (ApiConfig.getConfig().EnableApiDataLog ? JSON.stringify(json) : ''));

        //情况1-2，请求失败，状态码>299
        const err = new RequestApiError('statusError', json.message, '状态码异常', json.code || response.status, json.data, json, req, apiName, response.url);

        //错误报告
        if (instance.checkShouldReportError(err))
          instance.reportError(err);

        reject(err);
      }
    }).catch((err) => {
      //错误统一处理
      defaultResponseDataHandlerCatch(method, req, response, null, err, apiName, response.url, reject, instance);
    });
  });
}
export function defaultResponseDataGetErrorInfo(response: RequestResponse, err: any) {
  let errString = (response.status > 299) ? ('返回了状态码' + response.status + '。\n') : '';
  let errType : RequestApiErrorType = 'statusError';
  let errCodeStr = '状态码：' + response.status;
  if (err instanceof Error && response.status < 299) {
    errString = '代码错误: ' + err.message;
    errType = 'scriptError';
  } else {
    if (('' + err).indexOf('JSON Parse error') >= 0)
      errString += '处理JSON结构失败，可能后端没有返回正确的JSON格式。\n';

    //情况2，没有返回数据
    //错误状态码的处理
    switch (response.status) {
      case 400:
        errCodeStr = '错误的请求';
        errString += errCodeStr + ' \n[提示：请检查传入参数是否正确]';
        errType = 'statusError';
        break;
      case 401:
        errCodeStr = '未登录。可能登录已经过期，请重新登录';
        errString += errCodeStr;
        errType = 'statusError';
        break;
      case 405:
        errCodeStr = 'HTTP方法不被允许';
        errString += errCodeStr + ' \n[提示：这可能是调用接口是不正确造成的]';
        errType = 'statusError';
        break;
      case 404:
        errCodeStr = '返回404未找到';
        errString += errCodeStr + ' \n[提示：后端检查下到底有没有提供这个API?]';
        errType = 'statusError';
        break;
      case 500:
        errCodeStr = '服务异常，请稍后重试';
        errString += errCodeStr + ' \n[故障提示：这可能是后端服务出现了异常]';
        errType = 'serverError';
        break;
      case 502:
        errCodeStr = '无效网关，请反馈此错误';
        errString += errCodeStr + ' \n[故障提示：请检查服务器与软件状态]';
        errType = 'serverError';
        break;
      case 503:
        errCodeStr = '服务暂时不可用';
        errString += errCodeStr + ' \n[故障提示：请检查服务器状态]';
        errType = 'serverError';
        break;
    }
  }

  return {errString, errType, errCodeStr};
}
//默认的请求数据处理函数
export function defaultResponseDataHandlerCatch<T extends DataModel>(method: string, req: RequestOptions, response: RequestResponse, data: any, err: any, apiName: string|undefined, apiUrl: string, reject: (reason?: any) => void, instance: RequestCoreInstance<T>) {
  if (ApiConfig.getConfig().EnableApiRequestLog) {
    console.log(`[API Debugger] E > ${apiName} ` + err + ' status: ' + response.status);
    if (err instanceof Error)
      console.log(err.stack);
  }

  
  const {errString, errType, errCodeStr} = defaultResponseDataGetErrorInfo(response, err);
  const errObj = new RequestApiError(errType, errString, errCodeStr, response.status, null, data, req, apiName, apiUrl);

  //错误报告
  if (instance.checkShouldReportError(errObj))
    instance.reportError(errObj);
  reject(errObj);
}

//默认的请求错误处理函数
export function defaultResponseErrorHandler(err: Error) : RequestApiError {
  if (err instanceof Error)
    console.error('[API Debugger] Error : ' + err + (err.stack ? ('\n' + err.stack) : ''));
  else
    console.error('[API Debugger] Error : ' + JSON.stringify(err));
  return new RequestApiError('unknow', '' + JSON.stringify(err));
}
