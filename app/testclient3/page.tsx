'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Key, Loader2, LogOut, User, Shield } from "lucide-react"
import NextAuthProvider from "@/lib/auth/nextauth-provider"

function NextAuthClientContent() {
  const { data: session, status } = useSession()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('123456')
  const [isLogging, setIsLogging] = useState(false)
  const [apiResult, setApiResult] = useState<any>(null)
  const [apiLoading, setApiLoading] = useState(false)

  const handleLogin = async () => {
    setIsLogging(true)
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      })
      
      if (result?.error) {
        console.error('登录失败:', result.error)
      }
    } catch (error) {
      console.error('登录错误:', error)
    } finally {
      setIsLogging(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setApiResult(null)
  }

  const callTestAPI = async () => {
    setApiLoading(true)
    try {
      // 调用测试API
      const response = await fetch('/api/test', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setApiResult(data)
      } else {
        setApiResult({ error: `API调用失败: ${response.status}` })
      }
    } catch (error) {
      setApiResult({ error: 'API调用异常' })
    } finally {
      setApiLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>正在检查NextAuth认证状态...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 认证状态卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            NextAuth v5 + DAL - 客户端认证
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded ${session ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <h5 className={`font-semibold mb-2 ${session ? 'text-green-800' : 'text-yellow-800'}`}>
                  认证状态
                </h5>
                <p className={`text-sm ${session ? 'text-green-700' : 'text-yellow-700'}`}>
                  {session ? '✓ 已认证' : '⚠️ 未认证'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h5 className="font-semibold text-blue-800 mb-2">认证方案</h5>
                <p className="text-sm text-blue-700">NextAuth v5 + Session</p>
              </div>
            </div>

            {session ? (
              <div className="space-y-4">
                {/* 用户信息 */}
                <div className="bg-gray-50 p-4 rounded">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    用户信息
                  </h5>
                  <pre className="text-xs text-gray-700 overflow-auto">
                    {JSON.stringify(session.user, null, 2)}
                  </pre>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Button onClick={callTestAPI} disabled={apiLoading} className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    {apiLoading ? '调用中...' : '调用受保护API'}
                  </Button>
                  <Button onClick={handleLogout} variant="outline" className="flex items-center">
                    <LogOut className="h-4 w-4 mr-1" />
                    登出
                  </Button>
                </div>

                {/* API调用结果 */}
                {apiResult && (
                  <div className="bg-purple-50 p-4 rounded">
                    <h5 className="font-semibold text-purple-800 mb-2">API调用结果</h5>
                    <pre className="text-xs text-purple-700 overflow-auto">
                      {JSON.stringify(apiResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* 登录表单 */}
                <div className="space-y-2">
                  <Input
                    placeholder="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button 
                    onClick={handleLogin} 
                    disabled={isLogging}
                    className="w-full"
                  >
                    {isLogging ? '登录中...' : '登录'}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  默认账号：admin / 123456
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 架构说明 */}
      <Card>
        <CardHeader>
          <CardTitle>NextAuth v5 + DAL 架构特点</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• <strong>NextAuth v5</strong>: 社区最受欢迎的认证库</li>
            <li>• <strong>Session-based</strong>: 安全的服务端session管理</li>
            <li>• <strong>Data Access Layer</strong>: 集中的数据访问和认证检查</li>
            <li>• <strong>SSR友好</strong>: 完美支持服务端渲染</li>
            <li>• <strong>类型安全</strong>: 完整的TypeScript支持</li>
            <li>• <strong>多层防护</strong>: DAL确保每个数据访问都经过认证</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TestClient3Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">NextAuth v5 + DAL 客户端测试</h1>
      <NextAuthProvider>
        <NextAuthClientContent />
      </NextAuthProvider>
    </div>
  )
}