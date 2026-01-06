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

    let signal : AbortSignal|undefined;
    let timeoutId : number|undefined;

    // 创建 AbortController 实例
    if (globalThis.AbortController) {
      const controller = new AbortController();
      signal = controller.signal;
      // 设置超时逻辑
      timeoutId = setTimeout(() => {
        controller.abort(); // 超时后取消请求
      }, timeout) as any as number;
    }

    let body : string|FormData|undefined;
    if (init?.data instanceof FormData) {
      body = init.data; 
      if (init?.headers['Content-Type'] == 'multipart/form-data')
        delete init.headers['Content-Type'];
    } else if (typeof init?.data === 'object') {
      body = JSON.stringify(init.data); 
    }
    // 发起 fetch 请求
    const response = fetch(url, { 
      headers: init?.headers,
      method: init?.method,
      body,
      signal 
    });

    // 请求完成后清除超时
    response.finally(() => {
      if (timeoutId)
        clearTimeout(timeoutId);
    });
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