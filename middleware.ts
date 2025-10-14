// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/settings', '/profile']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 如果访问的是公开页面或API，放行
  if (
    pathname.startsWith('/api') || // API 路径不拦截
    pathname.startsWith('/_next') || // Next.js内部文件
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // 检查是否需要保护
  const needsAuth = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  if (!needsAuth) {
    return NextResponse.next()
  }

  // 从Cookie中取出AccessToken
  const token = req.cookies.get(process.env.JWT_ACCESS_COOKIE!)?.value

  // 如果没有token，重定向到登录页
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname) // 登录后可返回
    return NextResponse.redirect(loginUrl)
  }

  // 可选：校验token格式（简单检测或解码JWT）
  /*try {
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'))
    const exp = payload.exp * 1000
    if (Date.now() > exp) {
      // Token过期，重定向到登录页
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    // Token解析失败，重定向
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }*/

  // ✅ 放行
  return NextResponse.next()
}

// 指定中间件生效的路径范围
export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
