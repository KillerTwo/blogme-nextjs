// 客户端API请求工具
import { getClientAccessToken, getClientRefreshToken, setClientTokens, clearClientTokens } from './token-manager';
import type { RequestConfig, RefreshTokenResponse } from '@/types/api';

export async function clientFetch<T = any>(
  path: string, 
  config: RequestConfig = {}
): Promise<T> {
  const { skipAuth = false, retryOnAuthError = true, ...init } = config;
  
  let token = skipAuth ? null : getClientAccessToken();

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  });
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(`/api${path}`, {
    method: init?.method || 'GET',
    ...init,
    headers,
    credentials: 'include', // 保持cookie自动附带
  });

  // 如果401且允许重试，尝试刷新token
  if (res.status === 401 && retryOnAuthError && !skipAuth) {
    const refreshToken = getClientRefreshToken();
    if (refreshToken) {
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens?.accessToken) {
        setClientTokens(newTokens.accessToken, newTokens.refreshToken);
        headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
        res = await fetch(`/api${path}`, {
          method: init?.method || 'GET',
          ...init,
          headers,
          credentials: 'include',
        });
      }
    }
  }

  // 如果仍然401，清除token并跳转登录
  if (res.status === 401) {
    clearClientTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Client API Error: ${res.status} ${errorText}`);
  }

  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch {
    return null;
  }
}

// 登录工具函数
export async function clientLogin(username: string, password: string) {
  const result = await clientFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    skipAuth: true,
  });
  
  // 登录成功后保存token
  if (result?.access_token) {
    setClientTokens(result.access_token, result.refresh_token);
  }
  
  return result;
}

// 登出工具函数
export async function clientLogout() {
  try {
    await clientFetch('/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearClientTokens();
  }
}

// 兼容旧API名称
export const apiFetch = clientFetch;
