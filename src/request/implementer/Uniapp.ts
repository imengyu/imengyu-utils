import { RequestResponse, type RequestCacheStorage, type RequestOptions } from "../core/RequestCore";
import type { RequestImplementer } from "../core/RequestImplementer";

export class PolyfillFormData implements Record<string, any> {
  public constructor() {}

  [index: string]: any;

  // 添加字段
  append(name: string, value: any) {
    if (!this[name]) {
      this[name] = [];
    }
    this[name].push(value);
  }

  // 获取字段值
  get(name: string) {
    if (this[name]) {
      return this[name][0];
    }
    return null;
  }

  // 获取所有字段值
  getAll(name: string) {
    return this[name] || [];
  }

  // 删除字段
  delete(name: string) {
    delete this[name];
  }

  // 检查是否存在字段
  has(name: string) {
    return this[name] !== undefined;
  }

  // 设置字段值（覆盖原有值）
  set(name: string, value: any) {
    this[name] = value;
  }

  // 获取所有字段的键名
  getKeys() {
    return Object.keys(this);
  }
}

if (typeof FormData === 'undefined')
  global.FormData = PolyfillFormData as any;

const uniappImplementer : RequestImplementer = {
  getCache: function (key: string) {
    return new Promise<RequestCacheStorage|null>((resolve, reject) => {
      uni.getStorage({
        key: key,
        success: (res) => {
          resolve(res.data ? JSON.parse(res.data) as RequestCacheStorage : null);
        },
        fail: (res) => {
          resolve(null);
        }
      });
    });
  },
  setCache: async function (key: string, value: RequestCacheStorage|null) {
    return new Promise<void>((resolve, reject) => {
      uni.setStorage({
        key: key,
        data: JSON.stringify(value),
        success: (res) => {
          resolve();
        },
        fail: (res) => {
          resolve();
        }
      });
    });
  },
  doRequest: function (url: string, init?: RequestOptions, timeout?: number): Promise<RequestResponse> {
    return new Promise<RequestResponse>((resolve, reject) => {
      uni.request({
        url: url,
        timeout: timeout,
        ...init,
        success(res) {
          const response = new RequestResponse({
            url,
            status: res.statusCode, 
            statusText: res.statusCode >= 200 ? 'success' : 'error',
            headers: res.header,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            getData: {
              json: () => {
                return Promise.resolve(res.data);
              }
            },
          });
          resolve(response);
        },
        fail(res) {
          reject(res);
        },
      })
    });
  }
};

export default uniappImplementer;