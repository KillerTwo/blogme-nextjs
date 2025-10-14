// HttpOnly Cookies方案的统一导出
export { 
  httpOnlyApi,
  getHttpOnlyApiClient,
  HttpOnlyApiClient 
} from './httponly-client';

export {
  httpOnlyLoginAction,
  httpOnlyLogoutAction,
  httpOnlyRefreshTokenAction,
  httpOnlyApiCallAction
} from './httponly-actions';

export {
  setHttpOnlyTokens,
  clearHttpOnlyTokens,
  getHttpOnlyAccessToken,
  getHttpOnlyRefreshToken,
  isHttpOnlyAuthenticated
} from './httponly-token-manager';

// 类型定义
export type { RequestConfig, RefreshTokenResponse, LoginResponse, ApiResponse, User } from '@/types/api';

// 导入用于默认导出
import { httpOnlyApi } from './httponly-client';
import { httpOnlyLoginAction, httpOnlyLogoutAction, httpOnlyApiCallAction } from './httponly-actions';

// 默认导出HttpOnly API
export default {
  api: httpOnlyApi,
  login: httpOnlyLoginAction,
  logout: httpOnlyLogoutAction,
  apiCall: httpOnlyApiCallAction,
};