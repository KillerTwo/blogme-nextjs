// HttpOnly方案的Server Actions
'use server';

import { setHttpOnlyTokens, clearHttpOnlyTokens, getHttpOnlyAccessToken } from './httponly-token-manager';
import { redirect } from 'next/navigation';

export interface LoginResult {
  success: boolean;
  message?: string;
  access_token?: string;
}

// 登录Server Action
export async function httpOnlyLoginAction(username: string, password: string): Promise<LoginResult> {
  try {
    // 调用后端登录API
    const response = await fetch(`${process.env.BACKEND_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: '登录失败：用户名或密码错误',
      };
    }

    const data = await response.json();
    
    if (data.access_token) {
      // 设置HttpOnly cookies
      await setHttpOnlyTokens(data.access_token, data.refresh_token);
      
      return {
        success: true,
        message: '登录成功',
        access_token: data.access_token,
      };
    } else {
      return {
        success: false,
        message: '登录失败：无效的响应',
      };
    }
  } catch (error) {
    console.error('登录错误:', error);
    return {
      success: false,
      message: '登录失败：网络错误',
    };
  }
}

// 登出Server Action
export async function httpOnlyLogoutAction() {
  try {
    // 清除HttpOnly cookies
    await clearHttpOnlyTokens();
    
    // 可以选择调用后端登出API
    // await fetch(`${process.env.BACKEND_API_URL}/logout`, { method: 'POST' });
    
  } catch (error) {
    console.error('登出错误:', error);
  } finally {
    // 重定向到登录页面
    redirect('/login');
  }
}

// 通用API调用的Server Action
export async function httpOnlyApiCallAction(path: string, options?: { method?: string; body?: any }): Promise<any> {
  try {
    // 获取HttpOnly token
    const token = await getHttpOnlyAccessToken();
    
    if (!token) {
      return {
        success: false,
        error: '未登录：请先登录获取token',
      };
    }

    // 构建请求
    const response = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API调用失败: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API调用错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}
export async function httpOnlyRefreshTokenAction(): Promise<boolean> {
  try {
    const { getHttpOnlyRefreshToken } = await import('./httponly-token-manager');
    const refreshToken = await getHttpOnlyRefreshToken();
    
    if (!refreshToken) return false;

    const response = await fetch(`${process.env.BACKEND_API_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    
    if (data.accessToken) {
      await setHttpOnlyTokens(data.accessToken, data.refreshToken);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('刷新token错误:', error);
    return false;
  }
}