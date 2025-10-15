// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const PROTECTED_PATHS = ['/dashboard', '/settings', '/profile']
const JWT_PROTECTED_PATHS = ['/testserver2'] // JWT方案保护的路径

// NextAuth保护的路径（使用next-auth认证）
const NEXTAUTH_PROTECTED_PATHS = [
  '/admin',
  '/posts/create',
  '/posts/edit',
  // 可以添加更多需要保护的路径
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 如果访问的是公开页面或API，放行
  if (
    pathname.startsWith('/api') || // API 路径不拦截
    pathname.startsWith('/_next') || // Next.js内部文件
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/testclient') || // 测试页面放行
    pathname.startsWith('/testfetch') // 测试页面放行
  ) {
    return NextResponse.next()
  }

  // NextAuth方案的路径保护
  if (NEXTAUTH_PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return await handleNextAuthProtection(req, pathname)
  }

  // JWT方案的路径保护
  if (JWT_PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return handleJWTAuth(req, pathname)
  }

  // 原有的cookie方案保护
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

  // ✅ 放行
  return NextResponse.next()
}

// 处理NextAuth认证的函数
async function handleNextAuthProtection(req: NextRequest, pathname: string) {
  // 获取NextAuth session
  const session = await auth()

  // 如果没有session，重定向到登录页
  if (!session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname) // NextAuth标准参数
    return NextResponse.redirect(loginUrl)
  }

  // 有session，放行
  return NextResponse.next()
}

// 处理JWT认证的函数
function handleJWTAuth(req: NextRequest, pathname: string) {
  // JWT + localStorage方案：middleware无法验证localStorage中的token
  // 直接放行请求，让客户端组件自己处理认证检查
  // 添加header标记，让页面组件知道这是需要JWT认证的路径

  const response = NextResponse.next()
  response.headers.set('x-jwt-auth-required', 'true')
  response.headers.set('x-requested-path', pathname)

  return response
}

// 指定中间件生效的路径范围
export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
