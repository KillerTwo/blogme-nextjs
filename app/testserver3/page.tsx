import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Database, Shield, Key, AlertTriangle, CheckCircle } from "lucide-react"
import { 
  getUserProfile, 
  getProtectedData, 
  callProtectedAPI, 
  checkAuth,
  AuthError,
  ForbiddenError 
} from "@/lib/dal/auth-dal"
import NextAuthProvider from "@/lib/auth/nextauth-provider"

// 服务端组件：展示用户信息
async function UserProfileSection() {
  try {
    const profile = await getUserProfile()
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            用户资料 (DAL认证通过)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded">
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    if (error instanceof AuthError) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              用户资料 (需要登录)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-yellow-700">⚠️ {error.message}</p>
              <p className="text-sm text-yellow-600 mt-2">
                请在 <a href="/testclient3" className="underline">客户端页面</a> 先登录
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }
    throw error
  }
}

// 服务端组件：展示受保护数据
async function ProtectedDataSection() {
  try {
    const data = await getProtectedData()
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Shield className="h-5 w-5 mr-2" />
            受保护数据 (权限验证通过)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded">
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              受保护数据 (权限不足)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-red-700">🚫 {error.message}</p>
            </div>
          </CardContent>
        </Card>
      )
    } else if (error instanceof AuthError) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              受保护数据 (需要登录)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-yellow-700">⚠️ {error.message}</p>
            </div>
          </CardContent>
        </Card>
      )
    }
    throw error
  }
}

// 服务端组件：API调用测试
async function APICallSection() {
  try {
    const apiData = await callProtectedAPI('/test')
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Database className="h-5 w-5 mr-2" />
            API调用结果 (认证通过)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded">
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    if (error instanceof AuthError) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              API调用结果 (需要登录)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-yellow-700">⚠️ {error.message}</p>
            </div>
          </CardContent>
        </Card>
      )
    }
    throw error
  }
}

// 认证状态检查组件
async function AuthStatusSection() {
  const { isAuthenticated, user } = await checkAuth()
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2" />
          NextAuth v5 + DAL 服务端认证状态
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded ${isAuthenticated ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <h5 className={`font-semibold mb-2 ${isAuthenticated ? 'text-green-800' : 'text-yellow-800'}`}>
                认证状态
              </h5>
              <p className={`text-sm ${isAuthenticated ? 'text-green-700' : 'text-yellow-700'}`}>
                {isAuthenticated ? '✓ 已认证' : '⚠️ 未认证'}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h5 className="font-semibold text-blue-800 mb-2">DAL架构</h5>
              <p className="text-sm text-blue-700">服务端数据访问层</p>
            </div>
          </div>
          
          {user && (
            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-semibold text-gray-800 mb-2">当前用户</h5>
              <pre className="text-xs text-gray-700 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="bg-blue-50 p-4 rounded">
              <h5 className="font-semibold text-blue-800 mb-2">快速开始</h5>
              <p className="text-sm text-blue-700">
                请访问 <a href="/testclient3" className="underline font-medium">客户端测试页面</a> 进行登录
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 加载组件
function LoadingCard({ title }: { title: string }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600">正在加载...</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TestServer3Page() {
  return (
    <NextAuthProvider>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Server className="h-8 w-8 mr-3" />
          NextAuth v5 + DAL 服务端测试
        </h1>
        
        {/* 认证状态 - 不需要Suspense，因为checkAuth不会抛出错误 */}
        <AuthStatusSection />
        
        {/* 用户资料 - 使用Suspense处理异步加载 */}
        <Suspense fallback={<LoadingCard title="用户资料" />}>
          <UserProfileSection />
        </Suspense>
        
        {/* 受保护数据 - 使用Suspense处理异步加载 */}
        <Suspense fallback={<LoadingCard title="受保护数据" />}>
          <ProtectedDataSection />
        </Suspense>
        
        {/* API调用 - 使用Suspense处理异步加载 */}
        <Suspense fallback={<LoadingCard title="API调用结果" />}>
          <APICallSection />
        </Suspense>
        
        {/* DAL架构说明 */}
        <Card>
          <CardHeader>
            <CardTitle>Data Access Layer (DAL) 特点</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <strong>集中认证</strong>: 所有数据访问都经过DAL认证检查</li>
              <li>• <strong>类型安全</strong>: 完整的TypeScript类型推断</li>
              <li>• <strong>缓存优化</strong>: 使用React cache避免重复认证调用</li>
              <li>• <strong>错误分级</strong>: 区分认证错误和权限错误</li>
              <li>• <strong>安全边界</strong>: 每个数据访问点都是安全检查点</li>
              <li>• <strong>性能优化</strong>: 服务端渲染时并行处理认证检查</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </NextAuthProvider>
  )
}