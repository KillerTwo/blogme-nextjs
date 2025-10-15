// Data Access Layer for NextAuth v5 + DAL方案
import { auth } from "@/auth"
import { cache } from "react"
import type { Session } from "next-auth"

// 错误类型定义
export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends AuthError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

// 缓存认证检查，避免重复调用
export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const session = await auth()
    return session
  } catch (error) {
    console.error('获取session失败:', error)
    return null
  }
})

// 获取当前认证用户，如果未认证则抛出错误
export const getAuthUser = cache(async () => {
  const session = await getSession()
  
  if (!session?.user) {
    throw new AuthError('未认证，请先登录')
  }
  
  return session.user
})

// 检查用户是否有特定权限（示例）
export const requirePermission = cache(async (permission: string) => {
  const user = await getAuthUser()
  
  // 这里可以根据实际业务逻辑检查权限
  // 示例：admin用户拥有所有权限
  if (user.name === 'Admin User') {
    return true
  }
  
  // 其他权限检查逻辑...
  throw new ForbiddenError(`缺少权限: ${permission}`)
})

// 模拟数据访问函数，展示DAL模式
export const getUserProfile = cache(async () => {
  const user = await getAuthUser() // DAL中的认证检查
  
  // 模拟从数据库获取用户详细信息
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: {
      bio: '这是一个使用NextAuth v5 + DAL方案的用户',
      joinDate: '2024-01-01',
      role: user.name === 'Admin User' ? 'administrator' : 'user'
    }
  }
})

// 模拟受保护的数据访问
export const getProtectedData = cache(async () => {
  await requirePermission('read:protected') // 权限检查
  
  // 模拟敏感数据
  return {
    secretData: '这是受保护的数据',
    timestamp: new Date().toISOString(),
    accessedBy: (await getAuthUser()).name
  }
})

// 使用nextauth-server调用受保护的后端API
export const callProtectedAPI = cache(async (endpoint: string) => {
  const user = await getAuthUser() // 确保已认证

  // 使用nextauth-server工具类调用后端API
  const { nextauthServerApi } = await import('@/lib/api/nextauth-server')
  const result = await nextauthServerApi.get(endpoint)

  if (result.error) {
    console.error('API调用错误:', result.error)
    // 返回模拟数据作为降级
    return {
      message: '模拟API响应（实际调用失败）',
      user: user.name,
      endpoint,
      error: result.error,
      timestamp: new Date().toISOString()
    }
  }

  return result.data
})

// 辅助函数：安全地检查认证状态（不抛出错误）
export const checkAuth = cache(async (): Promise<{ isAuthenticated: boolean; user: Session['user'] | null }> => {
  const session = await getSession()
  return {
    isAuthenticated: !!session?.user,
    user: session?.user || null
  }
})