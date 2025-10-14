// 统一的token管理器，支持客户端和服务端通过cookie共享token

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// 通用的cookie配置
const COOKIE_OPTIONS = {
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7天
};

// 服务端token管理 - 只读取cookies，不设置
export async function setServerTokens(access: string, refresh?: string) {
  // 服务端组件不应该设置token，这应该由客户端处理
  console.warn('服务端组件不应该设置token，请在客户端处理');
}

export async function clearServerTokens() {
  // 服务端组件不应该清除token，这应该由客户端处理
  console.warn('服务端组件不应该清除token，请在客户端处理');
}

export async function getServerAccessToken(): Promise<string | null> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value || null;
}

export async function getServerRefreshToken(): Promise<string | null> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value || null;
}

// 客户端token管理 - 使用可读cookie以便共享
export function setClientTokens(access: string, refresh?: string) {
  if (typeof window === 'undefined') return;
  
  // 设置可从客户端读取的cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=${access}; ${getCookieString(COOKIE_OPTIONS)}`;
  if (refresh) {
    document.cookie = `${REFRESH_TOKEN_KEY}=${refresh}; ${getCookieString(COOKIE_OPTIONS)}`;
  }
}

export function clearClientTokens() {
  if (typeof window === 'undefined') return;
  
  // 清除cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function getClientAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return getCookieValue(ACCESS_TOKEN_KEY);
}

export function getClientRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return getCookieValue(REFRESH_TOKEN_KEY);
}

// 辅助函数：从cookie字符串中获取值
function getCookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// 辅助函数：生成cookie字符串
function getCookieString(options: any): string {
  const parts = [];
  if (options.path) parts.push(`path=${options.path}`);
  if (options.sameSite) parts.push(`samesite=${options.sameSite}`);
  if (options.secure) parts.push('secure');
  if (options.maxAge) parts.push(`max-age=${options.maxAge}`);
  return parts.join('; ');
}

// 通用token管理（自动检测环境）
export function getAccessToken(): Promise<string | null> | string | null {
  if (typeof window === 'undefined') {
    // 服务端环境
    return getServerAccessToken();
  } else {
    // 客户端环境
    return getClientAccessToken();
  }
}

export function getRefreshToken(): Promise<string | null> | string | null {
  if (typeof window === 'undefined') {
    // 服务端环境
    return getServerRefreshToken();
  } else {
    // 客户端环境
    return getClientRefreshToken();
  }
}

export function setTokens(access: string, refresh?: string): Promise<void> | void {
  if (typeof window === 'undefined') {
    // 服务端环境
    return setServerTokens(access, refresh);
  } else {
    // 客户端环境
    return setClientTokens(access, refresh);
  }
}

export function clearTokens(): Promise<void> | void {
  if (typeof window === 'undefined') {
    // 服务端环境
    return clearServerTokens();
  } else {
    // 客户端环境
    return clearClientTokens();
  }
}