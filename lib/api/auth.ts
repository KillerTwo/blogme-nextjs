// src/lib/api/auth.ts
import { cookies } from 'next/headers';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function setAuthTokens(access: string, refresh?: string) {
  const cookieStore = cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, access, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  if (refresh) {
    cookieStore.set(REFRESH_TOKEN_KEY, refresh, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

export function clearAuthTokens() {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value || null;
}

export function getRefreshToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value || null;
}
