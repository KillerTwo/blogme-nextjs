import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, CheckCircle, User } from 'lucide-react'

export default async function AdminPage() {
  const session = await auth()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Shield className="h-8 w-8 mr-3 text-green-600" />
        受保护的管理页面
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            认证成功 - 您已成功访问受保护页面
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-green-700 mb-4">
              ✅ 恭喜！您已经通过中间件的认证检查，可以访问这个受保护的页面。
            </p>
            <div className="border-t border-green-200 pt-4 mt-4">
              <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" />
                当前登录用户信息
              </h5>
              <pre className="text-sm text-gray-700 bg-white p-3 rounded overflow-auto">
                {JSON.stringify(session?.user, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>中间件保护机制说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-blue-50 p-3 rounded">
              <h6 className="font-semibold text-blue-800 mb-1">工作流程</h6>
              <ol className="list-decimal list-inside space-y-1">
                <li>用户访问 /admin 路径</li>
                <li>middleware.ts 拦截请求</li>
                <li>调用 auth() 检查 NextAuth session</li>
                <li>如果未登录 → 重定向到 /login</li>
                <li>如果已登录 → 放行请求，显示此页面</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-3 rounded">
              <h6 className="font-semibold text-yellow-800 mb-1">受保护的路径</h6>
              <ul className="list-disc list-inside space-y-1">
                <li>/admin - 管理页面</li>
                <li>/posts/create - 创建文章</li>
                <li>/posts/edit - 编辑文章</li>
              </ul>
              <p className="mt-2 text-xs text-yellow-700">
                可在 middleware.ts 的 NEXTAUTH_PROTECTED_PATHS 中添加更多路径
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded">
              <h6 className="font-semibold text-green-800 mb-1">安全特性</h6>
              <ul className="list-disc list-inside space-y-1">
                <li>服务端拦截，无法绕过</li>
                <li>自动重定向到登录页</li>
                <li>登录后可返回原页面 (callbackUrl)</li>
                <li>Token存储在HTTP-Only Cookie中</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h6 className="font-semibold text-gray-800 mb-2">测试步骤</h6>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>退出登录（在 /testclient3 页面点击登出）</li>
          <li>尝试访问 /admin 页面</li>
          <li>观察是否自动跳转到登录页面</li>
          <li>登录后观察是否能正常访问此页面</li>
        </ol>
      </div>
    </div>
  )
}
