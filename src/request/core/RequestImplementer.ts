import type { RequestCacheStorage, RequestOptions, RequestResponse } from "./RequestCore";

export interface RequestImplementer {
  getCache(key: string): Promise<RequestCacheStorage|null>;
  setCache(key: string, value: RequestCacheStorage|null): Promise<void>;
  doRequest(url: string, init?: RequestOptions, timeout?: number): Promise<RequestResponse>;
}