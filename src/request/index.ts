
export * from './core/RequestApiResult';
export * from './core/RequestApiConfig';
export * from './core/RequestCore';
export * from './core/RequestHandler';
export * from './core/RequestImplementer';
export * from './utils/AllType';
export * from './utils/AllType';

import RequestApiConfig from './core/RequestApiConfig';
import UniappImplementer from './implementer/Uniapp';
import WebFetchImplementer from './implementer/WebFetch';

export {
  RequestApiConfig,
  UniappImplementer,
  WebFetchImplementer,
}