// JWT + localStorage方案的token管理器
const ACCESS_TOKEN_KEY = 'jwt_access_token';
const REFRESH_TOKEN_KEY = 'jwt_refresh_token';
const USER_KEY = 'jwt_user_info';

export interface JWTUser {
  id: string;
  username: string;
  email?: string;
}

export interface JWTTokens {
  accessToken: string;
  refreshToken?: string;
  user?: JWTUser;
}

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 设置token到localStorage
export function setJWTTokens(tokens: JWTTokens): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    
    if (tokens.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
    }
  } catch (error) {
    console.error('设置JWT tokens失败:', error);
  }
}

// 获取access token
export function getJWTAccessToken(): string | null {
  if (!isBrowser) return null;
  
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('获取access token失败:', error);
    return null;
  }
}

// 获取refresh token
export function getJWTRefreshToken(): string | null {
  if (!isBrowser) return null;
  
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('获取refresh token失败:', error);
    return null;
  }
}

// 获取用户信息
export function getJWTUser(): JWTUser | null {
  if (!isBrowser) return null;
  
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 清除所有token和用户信息
export function clearJWTTokens(): void {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('清除tokens失败:', error);
  }
}

// 检查是否已登录
export function isJWTAuthenticated(): boolean {
  const token = getJWTAccessToken();
  return !!token;
}

// 简单的JWT token解析（仅用于获取过期时间，生产环境建议使用专业库）
export function parseJWTToken(token: string): any {
  try {
    // 检查是否是有效的JWT格式（应该有3个部分，用.分隔）
    const parts = token.split('.');
    if (parts.length !== 3) {
      // 如果不是标准JWT格式，返回一个默认的payload
      console.warn('Token不是标准JWT格式:', token);
      return {
        exp: Math.floor(Date.now() / 1000) + 3600, // 假设1小时后过期
        iat: Math.floor(Date.now() / 1000),
        sub: 'user'
      };
    }
    
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('解析JWT token失败:', error);
    // 返回一个默认的payload，避免破坏应用
    return {
      exp: Math.floor(Date.now() / 1000) + 3600, // 假设1小时后过期
      iat: Math.floor(Date.now() / 1000),
      sub: 'user'
    };
  }
}

// 检查token是否过期
export function isJWTTokenExpired(token: string): boolean {
  if (!token) return true;
  
  // 对于非标准JWT格式的token（如"admin"），直接返回未过期
  if (!token.includes('.') || token.split('.').length !== 3) {
    return false;
  }
  
  try {
    const payload = parseJWTToken(token);
    if (!payload || !payload.exp) {
      // 如果无法获取过期时间，假设未过期（由服务端验证）
      return false;
    }
    
    // exp是秒级时间戳，需要转换为毫秒
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    // 提前5分钟认为token过期，用于主动刷新
    const bufferTime = 5 * 60 * 1000;
    
    return currentTime >= (expirationTime - bufferTime);
  } catch (error) {
    console.error('检查token过期时间失败:', error);
    // 出错时假设未过期，让服务端来验证
    return false;
  }
}

// 监听localStorage变化（用于多标签页同步）
export function onJWTAuthChange(callback: (isAuthenticated: boolean) => void): () => void {
  if (!isBrowser) return () => {};
  
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === ACCESS_TOKEN_KEY) {
      callback(!!e.newValue);
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // 返回清除监听器的函数
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}