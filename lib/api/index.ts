// 统一的API请求工具，自动检测环境并共享token
export { 
  api, 
  getApiClient,
  UnifiedApiClient 
} from './unified-fetch';

// 向后兼容：导出原有的分离式API
export { clientFetch, clientLogin, clientLogout } from './client';
export { serverFetch, serverLogin, serverLogout } from './server';

// Token管理工具
export * from './token-manager';

// 类型定义
export type { RequestConfig, RefreshTokenResponse, LoginResponse, ApiResponse, User } from '@/types/api';

// 导出便捷的API方法
import { api } from './unified-fetch';
export const unifiedFetch = api.fetch;
export const unifiedLogin = api.login;
export const unifiedLogout = api.logout;

// 默认导出统一API（推荐使用）
export default api;