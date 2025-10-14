// 统一的API请求工具，支持客户端和服务端共享token
import type { RequestConfig, RefreshTokenResponse } from '@/types/api';

export class UnifiedApiClient {
  private isServer: boolean;
  private apiBase: string;
  
  constructor() {
    this.isServer = typeof window === 'undefined';
    this.apiBase = this.isServer 
      ? (process.env.BACKEND_API_URL || '') 
      : '/api';
  }

  // 统一的fetch方法
  async fetch<T = any>(path: string, config: RequestConfig = {}): Promise<T> {
    const { skipAuth = false, retryOnAuthError = true, ...init } = config;
    
    // 获取token
    let token = skipAuth ? null : await this.getAccessToken();

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
    };

    // 服务端特定配置
    if (this.isServer) {
      fetchConfig.cache = 'no-store';
    } else {
      // 客户端特定配置
      fetchConfig.credentials = 'include';
    }

    let res = await fetch(`${this.apiBase}${path}`, fetchConfig);

    // 处理401错误，尝试刷新token
    if (res.status === 401 && retryOnAuthError && !skipAuth) {
      const refreshToken = await this.getRefreshToken();
      if (refreshToken) {
        const newTokens = await this.refreshAccessToken(refreshToken);
        if (newTokens?.accessToken) {
          await this.setTokens(newTokens.accessToken, newTokens.refreshToken);
          headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
          res = await fetch(`${this.apiBase}${path}`, {
            ...fetchConfig,
            headers,
          });
        }
      }
    }

    // 如果仍然401，清除token并处理重定向
    if (res.status === 401) {
      await this.clearTokens();
      if (this.isServer) {
        const { redirect } = await import('next/navigation');
        redirect('/login');
      } else {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} ${errorText}`);
    }

    return res.json();
  }

  // 登录方法
  async login(username: string, password: string) {
    const result = await this.fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true,
    });
    
    // 登录成功后保存token - 只在客户端设置
    if (result?.access_token && !this.isServer) {
      await this.setTokens(result.access_token, result.refresh_token);
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
      await this.clearTokens();
    }
  }

  // Token管理方法
  private async getAccessToken(): Promise<string | null> {
    if (this.isServer) {
      const { getServerAccessToken } = await import('./token-manager');
      return getServerAccessToken();
    } else {
      const { getClientAccessToken } = await import('./token-manager');
      return getClientAccessToken();
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    if (this.isServer) {
      const { getServerRefreshToken } = await import('./token-manager');
      return getServerRefreshToken();
    } else {
      const { getClientRefreshToken } = await import('./token-manager');
      return getClientRefreshToken();
    }
  }

  private async setTokens(access: string, refresh?: string): Promise<void> {
    if (this.isServer) {
      const { setServerTokens } = await import('./token-manager');
      return setServerTokens(access, refresh);
    } else {
      const { setClientTokens } = await import('./token-manager');
      return setClientTokens(access, refresh);
    }
  }

  private async clearTokens(): Promise<void> {
    if (this.isServer) {
      const { clearServerTokens } = await import('./token-manager');
      return clearServerTokens();
    } else {
      const { clearClientTokens } = await import('./token-manager');
      return clearClientTokens();
    }
  }

  // 刷新token
  private async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
    try {
      const endpoint = this.isServer 
        ? `${process.env.BACKEND_API_URL}/refresh`
        : '/api/refresh';
        
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        ...(this.isServer ? {} : { credentials: 'include' }),
      });
      
      if (!res.ok) return null;
      
      return res.json();
    } catch {
      return null;
    }
  }
}

// 创建单例实例
let apiClientInstance: UnifiedApiClient | null = null;

export function getApiClient(): UnifiedApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new UnifiedApiClient();
  }
  return apiClientInstance;
}

// 导出便捷方法
export const api = {
  fetch: <T = any>(path: string, config?: RequestConfig) => 
    getApiClient().fetch<T>(path, config),
  login: (username: string, password: string) => 
    getApiClient().login(username, password),
  logout: () => 
    getApiClient().logout(),
};

// 向后兼容导出
export const unifiedFetch = api.fetch;
export const unifiedLogin = api.login;
export const unifiedLogout = api.logout;