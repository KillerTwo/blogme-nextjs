// src/lib/api/server.ts
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from './auth';
import { redirect } from 'next/navigation';

const API_BASE = process.env.BACKEND_API_URL; // e.g. http://spring:8080

export async function serverFetch(path: string, init?: RequestInit): Promise<any> {
  let token = getAccessToken();

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  // 如果401则尝试刷新token
  if (res.status === 401) {
    const refresh = getRefreshToken();
    if (refresh) {
      const newTokens = await refreshAccessToken(refresh);
      if (newTokens?.accessToken) {
        setAuthTokens(newTokens.accessToken, newTokens.refreshToken);
        headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
        res = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: 'no-store' });
      }
    }
  }

  if (res.status === 401) {
    clearAuthTokens();
    redirect('/login');
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`ServerFetch Error: ${res.status} ${msg}`);
  }

  return res.json();
}

async function refreshAccessToken(refreshToken: string) {
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
