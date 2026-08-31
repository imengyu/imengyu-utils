import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestCoreInstance, RequestResponse, RequestOptions } from '../../request/core/RequestCore';
import { RequestApiError } from '../../request/core/RequestApiResult';
import type { RequestImplementer } from '../../request/core/RequestImplementer';
import { DataModel } from '@imengyu/js-request-transform';

class MockModel extends DataModel {
  load() { /* noop */ }
}

function createMockResponse(data: unknown, status = 200): RequestResponse {
  return new RequestResponse({
    url: 'http://test.com/api',
    ok: status >= 200 && status < 300,
    headers: { 'content-type': 'application/json' },
    status,
    statusText: 'OK',
    getData: { json: async () => data },
  });
}

function createMockImplementer(doRequestFn: (url: string, req?: RequestOptions) => Promise<RequestResponse>): RequestImplementer {
  return {
    getCache: vi.fn(async () => null),
    setCache: vi.fn(async () => {}),
    doRequest: vi.fn(doRequestFn),
  };
}

function createInstance(implementer: RequestImplementer) {
  const instance = new RequestCoreInstance<MockModel>(implementer);
  instance.config.responseDataHandler = async (response) => {
    const data = response.json();
    if (response.status === 401) {
      throw new RequestApiError('businessError', 'token expired', 'Token过期', 401, null, null, undefined, { 
        apiName: 'test',
        apiMethod: 'POST',
      } as any);
    }
    const { RequestApiResult } = await import('../../request/core/RequestApiResult');
    const result = new RequestApiResult(null);
    (result as any).rawData = data;
    (result as any).code = response.status;
    return result as any;
  };
  instance.config.responseErrorHandler = (err) => {
    if (err instanceof RequestApiError) return err;
    return new RequestApiError('unknow', String(err), '未知错误', -1, null, null, undefined, { apiName: 'test' } as any);
  };
  return instance;
}

describe('refreshToken', () => {
  let callCount: number;

  beforeEach(() => {
    callCount = 0;
  });

  it('should refresh token and replay request on token expiry', async () => {
    const implementer = createMockImplementer(async () => {
      callCount++;
      if (callCount === 1) {
        return createMockResponse({ error: 'expired' }, 401);
      }
      return createMockResponse({ success: true }, 200);
    });

    const instance = createInstance(implementer);
    const doRefreshToken = vi.fn(async () => {});

    instance.config.refreshToken = {
      isTokenExpireFail: (err) => err instanceof RequestApiError && err.code === 401,
      doRefreshToken,
    };

    const result = await instance.get('http://test.com/api', 'test');
    expect(doRefreshToken).toHaveBeenCalledOnce();
    expect(callCount).toBe(2);
    expect(result).toBeDefined();
  });

  it('should queue concurrent requests during refresh and replay all', async () => {
    let firstCall = true;
    const implementer = createMockImplementer(async () => {
      callCount++;
      if (firstCall) {
        firstCall = false;
        return createMockResponse({ error: 'expired' }, 401);
      }
      return createMockResponse({ success: true }, 200);
    });

    const instance = createInstance(implementer);

    let resolveRefresh: () => void;
    const refreshPromise = new Promise<void>(r => { resolveRefresh = r; });
    const doRefreshToken = vi.fn(async () => { await refreshPromise; });

    instance.config.refreshToken = {
      isTokenExpireFail: (err) => err instanceof RequestApiError && err.code === 401,
      doRefreshToken,
    };

    const req1 = instance.get('http://test.com/api/1', 'test1');
    await new Promise(r => setTimeout(r, 10));

    const req2 = instance.get('http://test.com/api/2', 'test2');
    const req3 = instance.get('http://test.com/api/3', 'test3');

    resolveRefresh!();

    const [r1, r2, r3] = await Promise.all([req1, req2, req3]);
    expect(doRefreshToken).toHaveBeenCalledOnce();
    expect(r1).toBeDefined();
    expect(r2).toBeDefined();
    expect(r3).toBeDefined();
  });

  it('should reject all queued requests when refresh fails', async () => {
    const implementer = createMockImplementer(async () => {
      return createMockResponse({ error: 'expired' }, 401);
    });

    const instance = createInstance(implementer);
    const doRefreshToken = vi.fn(async () => { throw new Error('refresh failed'); });

    instance.config.refreshToken = {
      isTokenExpireFail: (err) => err instanceof RequestApiError && err.code === 401,
      doRefreshToken,
    };

    await expect(instance.get('http://test.com/api', 'test')).rejects.toBeInstanceOf(RequestApiError);
  });

  it('should throw normally when refreshToken is not configured', async () => {
    const implementer = createMockImplementer(async () => {
      return createMockResponse({ error: 'expired' }, 401);
    });

    const instance = createInstance(implementer);

    await expect(instance.get('http://test.com/api', 'test')).rejects.toBeInstanceOf(RequestApiError);
  });

  it('should throw normally for non-token errors', async () => {
    const implementer = createMockImplementer(async () => {
      return createMockResponse({ error: 'server error' }, 500);
    });

    const instance = createInstance(implementer);
    const doRefreshToken = vi.fn(async () => {});

    instance.config.refreshToken = {
      isTokenExpireFail: (err) => err instanceof RequestApiError && err.code === 401,
      doRefreshToken,
    };

    instance.config.responseDataHandler = async (response) => {
      if (response.status === 500) {
        throw new RequestApiError('serverError', 'server error', '服务器错误', 500, null, null, undefined, { apiName: 'test' } as any);
      }
      const { RequestApiResult } = await import('../../request/core/RequestApiResult');
      return new RequestApiResult(null) as any;
    };

    await expect(instance.get('http://test.com/api', 'test')).rejects.toBeInstanceOf(RequestApiError);
    expect(doRefreshToken).not.toHaveBeenCalled();
  });
});
