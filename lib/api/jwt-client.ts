// JWT + localStorage方案的API客户端
import { 
  getJWTAccessToken, 
  getJWTRefreshToken, 
  setJWTTokens, 
  clearJWTTokens,
  isJWTTokenExpired
} from './jwt-token-manager';
import type { RequestConfig, RefreshTokenResponse } from '@/types/api';

export class JWTApiClient {
  private apiBase: string;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string | null> | null = null;
  
  constructor() {
    this.apiBase = '/api'; // 使用Next.js的API路由代理
  }

  // 统一的fetch方法
  async fetch<T = any>(path: string, config: RequestConfig = {}): Promise<T> {
    const { skipAuth = false, retryOnAuthError = true, ...init } = config;
    
    // 获取token并检查是否需要刷新
    let token = skipAuth ? null : await this.getValidToken();

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    });
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const fetchConfig: RequestInit = {
      method: init?.method || 'GET',
      ...init,
      headers,
      credentials: 'include',
    };

    let response = await fetch(`${this.apiBase}${path}`, fetchConfig);

    // 处理401错误，尝试刷新token
    if (response.status === 401 && retryOnAuthError && !skipAuth) {
      const newToken = await this.refreshToken();
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        response = await fetch(`${this.apiBase}${path}`, {
          ...fetchConfig,
          headers,
        });
      }
    }

    // 如果仍然401，清除token并重定向
    if (response.status === 401) {
      clearJWTTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JWT API Error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  // 获取有效的token（如果需要会自动刷新）
  private async getValidToken(): Promise<string | null> {
    const token = getJWTAccessToken();
    if (!token) return null;

    // 对于非标准JWT格式的token（如"admin"），跳过过期检查
    if (!token.includes('.')) {
      return token;
    }

    // 检查token是否过期
    if (isJWTTokenExpired(token)) {
      return await this.refreshToken();
    }

    return token;
  }

  // 刷新token
  private async refreshToken(): Promise<string | null> {
    // 防止并发刷新
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  // 执行token刷新
  private async performTokenRefresh(): Promise<string | null> {
    const refreshToken = getJWTRefreshToken();
    if (!refreshToken) {
      clearJWTTokens();
      return null;
    }

    // 对于非标准JWT格式的token，不进行刷新
    if (!refreshToken.includes('.') || refreshToken.split('.').length !== 3) {
      console.log('跳过非JWT格式的refresh token刷新:', refreshToken);
      return getJWTAccessToken(); // 直接返回当前token
    }

    try {
      const response = await fetch(`${this.apiBase}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearJWTTokens();
        return null;
      }

      const data: RefreshTokenResponse = await response.json();
      
      if (data.accessToken) {
        setJWTTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        return data.accessToken;
      }

      clearJWTTokens();
      return null;
    } catch (error) {
      console.error('Token刷新失败:', error);
      clearJWTTokens();
      return null;
    }
  }

  // 登录方法
  async login(username: string, password: string) {
    const result = await this.fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true,
    });
    
    // 登录成功后保存token
    if (result?.access_token) {
      setJWTTokens({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user: result.user,
      });
    }
    
    return result;
  }

  // 登出方法
  async logout() {
    try {
      await this.fetch('/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearJWTTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }
}

// 创建单例实例
let jwtApiClientInstance: JWTApiClient | null = null;

export function getJWTApiClient(): JWTApiClient {
  if (!jwtApiClientInstance) {
    jwtApiClientInstance = new JWTApiClient();
  }
  return jwtApiClientInstance;
}

// 导出便捷方法
export const jwtApi = {
  fetch: <T = any>(path: string, config?: RequestConfig) => 
    getJWTApiClient().fetch<T>(path, config),
  login: (username: string, password: string) => 
    getJWTApiClient().login(username, password),
  logout: () => 
    getJWTApiClient().logout(),
};