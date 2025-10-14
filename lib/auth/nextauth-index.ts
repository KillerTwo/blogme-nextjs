// NextAuth v5 + DAL方案的统一导出
export { 
  auth,
  signIn, 
  signOut,
  handlers 
} from './nextauth-config'

export { default as NextAuthProvider } from './nextauth-provider'

// 导出DAL相关功能
export {
  getSession,
  getAuthUser,
  requirePermission,
  getUserProfile,
  getProtectedData,
  callProtectedAPI,
  checkAuth,
  AuthError,
  ForbiddenError
} from '../dal/auth-dal'

// 客户端hooks (需要在客户端组件中使用)
export { useSession, signIn as clientSignIn, signOut as clientSignOut } from 'next-auth/react'