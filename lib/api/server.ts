// 服务端API请求工具
import { getServerAccessToken, getServerRefreshToken, setServerTokens, clearServerTokens } from './token-manager';
import { redirect } from 'next/navigation';
import type { RequestConfig, RefreshTokenResponse } from '@/types/api';

const API_BASE = process.env.BACKEND_API_URL; // e.g. http://spring:8080

export async function serverFetch<T = any>(
  path: string, 
  config: RequestConfig = {}
): Promise<T> {
  const { skipAuth = false, retryOnAuthError = true, ...init } = config;
  
  let token = skipAuth ? null : await getServerAccessToken();

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  });
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  // 如果401且允许重试，尝试刷新token
  if (res.status === 401 && retryOnAuthError && !skipAuth) {
    const refreshToken = await getServerRefreshToken();
    if (refreshToken) {
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens?.accessToken) {
        await setServerTokens(newTokens.accessToken, newTokens.refreshToken);
        headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
        res = await fetch(`${API_BASE}${path}`, { 
          ...init, 
          headers, 
          cache: 'no-store' 
        });
      }
    }
  }

  // 如果仍然401，清除token并重定向
  if (res.status === 401) {
    await clearServerTokens();
    redirect('/login');
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Server API Error: ${res.status} ${errorText}`);
  }

  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
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

// 登录工具函数
export async function serverLogin(username: string, password: string) {
  return serverFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    skipAuth: true,
  });
}

// 登出工具函数
export async function serverLogout() {
  try {
    await serverFetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    await clearServerTokens();
  }
}
