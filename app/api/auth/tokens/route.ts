import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { action, accessToken, refreshToken } = await request.json();
    const cookieStore = await cookies();
    
    const COOKIE_OPTIONS = {
      sameSite: 'lax' as const,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7天
      httpOnly: true,
    };

    if (action === 'set') {
      if (accessToken) {
        cookieStore.set('access_token', accessToken, COOKIE_OPTIONS);
      }
      if (refreshToken) {
        cookieStore.set('refresh_token', refreshToken, COOKIE_OPTIONS);
      }
      return NextResponse.json({ success: true });
    } else if (action === 'clear') {
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}