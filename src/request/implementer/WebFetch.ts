import { RequestResponse, type RequestCacheStorage, type RequestOptions } from "../core/RequestCore";
import type { RequestImplementer } from "../core/RequestImplementer";

const fetchImplementer : RequestImplementer = {
  getCache: async function (key: string) {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) as RequestCacheStorage : null;
  },
  setCache: async function (key: string, value: RequestCacheStorage|null) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  doRequest: function (url: string, init?: RequestOptions, timeout?: number): Promise<RequestResponse> {
    // 创建 AbortController 实例
    const controller = new AbortController();
    const { signal } = controller;

    // 设置超时逻辑
    const timeoutId = setTimeout(() => {
      controller.abort(); // 超时后取消请求
    }, timeout);

    let body : string|FormData|undefined;
    if (init?.data instanceof FormData)
      body = init.data; 
    else if (typeof init?.data === 'object') {
      body = JSON.stringify(init.data); 
    }

    // 发起 fetch 请求
    const response = fetch(url, { 
      headers: init?.header,
      method: init?.method,
      body,
      signal 
    });

    // 请求完成后清除超时
    response.finally(() => clearTimeout(timeoutId));
    return new Promise<RequestResponse>((resolve, reject) => {
      response.then((res) => {
        resolve(new RequestResponse({
          url,
          ok: res.ok,
          headers: res.headers as any,
          status: res.status,
          statusText: res.statusText,
          getData: {
            json: () => res.json(),
          },
        }));
      }).catch((err) => {
        reject(err);
      });
    });

  }
};


export default fetchImplementer;