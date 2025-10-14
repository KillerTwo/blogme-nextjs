// HttpOnly Cookies方案的token管理器

const ACCESS_TOKEN_KEY = 'httponly_access_token';
const REFRESH_TOKEN_KEY = 'httponly_refresh_token';

// Cookie配置
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7天
};

// 设置token到HttpOnly cookies
export async function setHttpOnlyTokens(accessToken: string, refreshToken?: string) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
  
  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS);
  }
}

// 清除HttpOnly cookies
export async function clearHttpOnlyTokens() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}

// 获取access token
export async function getHttpOnlyAccessToken(): Promise<string | null> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value || null;
}

// 获取refresh token
export async function getHttpOnlyRefreshToken(): Promise<string | null> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value || null;
}

// 检查是否已登录
export async function isHttpOnlyAuthenticated(): Promise<boolean> {
  const token = await getHttpOnlyAccessToken();
  return !!token;
}