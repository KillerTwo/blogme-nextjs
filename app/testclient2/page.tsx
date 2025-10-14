'use client'
import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Globe, MapPin, Calendar, Code, Heart, Key, Smartphone } from 'lucide-react';
import { author } from '@/lib/data';
import { useJWTAuth, JWTAuthProvider } from '@/lib/auth/jwt-auth-context';
import { jwtApi } from '@/lib/api/jwt-client';
import { getJWTAccessToken } from '@/lib/api/jwt-token-manager';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/types/api';

function TestClient2Content() {
  const { isAuthenticated, user, loading, login, logout } = useJWTAuth();
  const [loginResult, setLoginResult] = useState<any>(null);
  const [apiResult, setApiResult] = useState<any>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testUser: UserType = {
    username: "admin",
    password: "123456",
  };

  // 更新当前token显示
  const updateTokenDisplay = () => {
    const token = getJWTAccessToken();
    setCurrentToken(token);
  };

  useEffect(() => {
    updateTokenDisplay();
  }, [isAuthenticated]);

  // 自动登录测试
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      handleAutoLogin();
    }
  }, [loading, isAuthenticated]);

  const handleAutoLogin = async () => {
    try {
      setError(null);
      console.log("开始JWT自动登录测试...");
      const result = await login(testUser.username, testUser.password);
      console.log("JWT登录返回结果：", result);
      setLoginResult(result);
      updateTokenDisplay();
      
      // 登录成功后测试API调用
      if (result?.access_token) {
        await handleApiCall();
      }
    } catch (err) {
      console.error('JWT登录错误:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    }
  };

  const handleApiCall = async () => {
    try {
      console.log("开始JWT API调用测试...");
      const testData = await jwtApi.fetch('/test', {
        method: 'GET'
      });
      console.log("JWT API调用结果：", testData);
      setApiResult(testData);
    } catch (err) {
      console.error('API调用错误:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLoginResult(null);
      setApiResult(null);
      setCurrentToken(null);
      setError(null);
    } catch (err) {
      console.error('登出错误:', err);
    }
  };

  const skills = [
    'JWT Tokens', 'localStorage', 'React Context', 'Auto Refresh', 'Multi-tab Sync'
  ];

  if (loading) {
    return (
      <BlogLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">正在检查JWT认证状态...</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <Key className="h-8 w-8 mr-3 text-amber-600" />
              <h1 className="text-3xl font-bold">
                JWT + localStorage客户端测试
                {loading && <span className="text-sm text-gray-500 ml-2">(加载中...)</span>}
                {error && <span className="text-sm text-red-500 ml-2">(错误: {error})</span>}
                {isAuthenticated && <span className="text-sm text-green-500 ml-2">(✓ 已认证)</span>}
              </h1>
            </div>

            {/* 认证状态卡片 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  JWT认证状态
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className={`p-4 rounded ${isAuthenticated ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h5 className={`font-semibold mb-2 ${isAuthenticated ? 'text-green-800' : 'text-red-800'}`}>
                      认证状态
                    </h5>
                    <p className={`text-sm ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                      {isAuthenticated ? '✓ 已登录' : '✗ 未登录'}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded">
                    <h5 className="font-semibold text-blue-800 mb-2">存储方式</h5>
                    <p className="text-sm text-blue-700">localStorage</p>
                  </div>
                </div>
                
                {user && (
                  <div className="bg-gray-50 p-4 rounded mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">用户信息</h5>
                    <pre className="text-xs text-gray-700 overflow-auto">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                )}
                
                {currentToken && (
                  <div className="bg-yellow-50 p-4 rounded mb-4">
                    <h5 className="font-semibold text-yellow-800 mb-2">当前Token</h5>
                    <p className="text-xs text-yellow-700 break-all font-mono">
                      {currentToken.substring(0, 50)}...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 测试结果显示 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  JWT测试结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loginResult && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">登录结果:</h4>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(loginResult, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {apiResult && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">API调用结果:</h4>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(apiResult, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  <div className="pt-4 space-x-4">
                    <button 
                      onClick={handleApiCall}
                      disabled={!isAuthenticated}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      测试API调用
                    </button>
                    <button 
                      onClick={handleAutoLogin}
                      disabled={isAuthenticated}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      重新登录
                    </button>
                    <button 
                      onClick={handleLogout}
                      disabled={!isAuthenticated}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      登出测试
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 个人简介卡片 */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl mb-2">{author.name}</CardTitle>
                    <p className="text-gray-600 mb-4">{author.bio}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {author.email}
                      </div>
                      {author.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          <a 
                            href={author.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600"
                          >
                            {author.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        中国
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        加入于 2020年
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* 技能标签 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  JWT技术栈
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 详细介绍 */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-4">JWT + localStorage 方案特点</h2>
              <p className="mb-4 leading-relaxed">
                这个页面演示了JWT + localStorage方案的实现。该方案将JWT token存储在浏览器的localStorage中，
                提供了灵活的客户端认证管理，支持多端共享和离线使用。
              </p>

              <h3 className="text-lg font-bold mb-3 mt-6">客户端管理优势</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">客户端完全控制token生命周期</li>
                <li className="mb-2">支持自动token刷新和过期检测</li>
                <li className="mb-2">多标签页之间状态自动同步</li>
                <li className="mb-2">React Context提供全局认证状态</li>
                <li className="mb-2">适合SPA应用和移动端开发</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">实现特色</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">自动拦截API请求添加Authorization头</li>
                <li className="mb-2">token过期时自动刷新，用户无感知</li>
                <li className="mb-2">支持并发请求时的token刷新锁定</li>
                <li className="mb-2">完整的错误处理和状态管理</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">安全考虑</h3>
              <p className="mb-4 leading-relaxed">
                虽然存在XSS风险，但通过合理的安全策略（CSP、输入验证等）和token过期机制，
                可以在便利性和安全性之间找到平衡点。适合对安全性要求不是最高的应用场景。
              </p>

              <Separator className="my-6" />

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  <span>灵活便捷，开发友好！</span>
                </div>
                <p className="text-sm text-gray-500">
                  JWT + localStorage方案为现代Web应用提供了灵活的认证解决方案
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Sidebar />
        </div>
      </div>
    </BlogLayout>
  );
}

export default function TestClient2Page() {
  return (
    <JWTAuthProvider>
      <TestClient2Content />
    </JWTAuthProvider>
  );
}