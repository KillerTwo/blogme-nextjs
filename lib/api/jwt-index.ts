// JWT + localStorage方案的统一导出
export { 
  jwtApi,
  getJWTApiClient,
  JWTApiClient 
} from './jwt-client';

export {
  setJWTTokens,
  getJWTAccessToken,
  getJWTRefreshToken,
  getJWTUser,
  clearJWTTokens,
  isJWTAuthenticated,
  parseJWTToken,
  isJWTTokenExpired,
  onJWTAuthChange,
  type JWTUser,
  type JWTTokens
} from './jwt-token-manager';

export {
  JWTAuthProvider,
  useJWTAuth,
  withJWTAuth,
  useJWTPageAuth
} from '../auth/jwt-auth-context';

// 类型定义
export type { RequestConfig, RefreshTokenResponse, LoginResponse, ApiResponse, User } from '@/types/api';

// 导入用于默认导出
import { jwtApi } from './jwt-client';
import { useJWTAuth } from '../auth/jwt-auth-context';

// 默认导出JWT API
export default {
  api: jwtApi,
  useAuth: useJWTAuth,
};