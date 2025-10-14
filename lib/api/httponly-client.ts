// HttpOnly Cookies方案的统一API客户端
import { getHttpOnlyAccessToken, getHttpOnlyRefreshToken } from './httponly-token-manager';
import type { RequestConfig, RefreshTokenResponse } from '@/types/api';

export class HttpOnlyApiClient {
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
    
    // 获取token（只在服务端有效）
    let token = null;
    if (!skipAuth && this.isServer) {
      token = await getHttpOnlyAccessToken();
    }

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
      credentials: 'include', // 重要：确保cookie被发送
    };

    // 服务端特定配置
    if (this.isServer) {
      fetchConfig.cache = 'no-store';
    }

    let res = await fetch(`${this.apiBase}${path}`, fetchConfig);

    // 处理401错误，尝试刷新token（只在服务端）
    if (res.status === 401 && retryOnAuthError && !skipAuth && this.isServer) {
      const refreshToken = await getHttpOnlyRefreshToken();
      if (refreshToken) {
        const newTokens = await this.refreshAccessToken(refreshToken);
        if (newTokens?.accessToken) {
          // 刷新token需要通过Server Action处理
          // 这里先记录，实际应用中需要重定向到登录页面
          console.warn('Token过期，需要重新登录');
        }
      }
    }

    // 如果仍然401，处理重定向
    if (res.status === 401) {
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

  // 刷新token（仅服务端使用）
  private async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
    if (!this.isServer) return null;
    
    try {
      const res = await fetch(`${process.env.BACKEND_API_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!res.ok) return null;
      
      return res.json();
    } catch {
      return null;
    }
  }
}

// 创建单例实例
let httpOnlyApiClientInstance: HttpOnlyApiClient | null = null;

export function getHttpOnlyApiClient(): HttpOnlyApiClient {
  if (!httpOnlyApiClientInstance) {
    httpOnlyApiClientInstance = new HttpOnlyApiClient();
  }
  return httpOnlyApiClientInstance;
}

// 导出便捷方法
export const httpOnlyApi = {
  fetch: <T = any>(path: string, config?: RequestConfig) => 
    getHttpOnlyApiClient().fetch<T>(path, config),
};