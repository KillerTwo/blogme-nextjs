// src/app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE = process.env.BACKEND_API_URL; // e.g. http://spring:8080
const REFRESH_PATH = '/api/auth/refresh';

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 });
  }

  try {
    // 调用 Spring Boot 的刷新接口
    const res = await fetch(`${API_BASE}${REFRESH_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
    }

    const data = await res.json();

    // Spring Boot 返回的格式：
    // { accessToken: 'xxx', refreshToken: 'yyy', expiresIn: 3600 }

    const response = NextResponse.json({ success: true });

    // 更新 cookie
    response.cookies.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1小时
    });

    if (data.refreshToken) {
      response.cookies.set('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7天
      });
    }

    return response;
  } catch (err) {
    console.error('Token refresh error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
