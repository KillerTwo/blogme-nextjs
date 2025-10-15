import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { User } from "next-auth"

// 扩展User类型以包含token
declare module "next-auth" {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    accessToken?: string
    refreshToken?: string
  }

  interface Session {
    user: User
    accessToken?: string
    refreshToken?: string
  }
}

// NextAuth v5 使用 @auth/core/jwt 来扩展JWT类型
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
    refreshToken?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // 调用后端登录API
          const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'
          const response = await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            console.error('后端登录失败:', response.status, response.statusText)
            return null
          }

          const data = await response.json()

          // 假设后端返回格式为: { id, username, email, accessToken, refreshToken }
          if (data.accessToken) {
            return {
              id: data.id?.toString() || data.userId?.toString() || '1',
              name: data.username || data.name,
              email: data.email || null,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            } as User
          }

          return null
        } catch (error) {
          console.error('登录请求异常:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 首次登录时，将user信息保存到token中
      if (user) {
        token.id = user.id
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      // 将token信息传递到session中
      if (token && session.user) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})