'use client'
import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Globe, MapPin, Calendar, Code, Heart, Shield } from 'lucide-react';
import { author } from '@/lib/data';
import { httpOnlyLoginAction, httpOnlyLogoutAction, httpOnlyApiCallAction } from '@/lib/api/httponly-actions';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/types/api';

export default function TestClient1Page() {
  const [loginResult, setLoginResult] = useState<any>(null);
  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user: UserType = {
    username: "admin",
    password: "123456",
  };

  useEffect(() => {
    const testHttpOnlyAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 使用HttpOnly登录Action
        console.log("开始HttpOnly登录测试...");
        const loginResponse = await httpOnlyLoginAction(user.username, user.password);
        console.log("HttpOnly登录返回结果：", loginResponse);
        setLoginResult(loginResponse);
        
        if (loginResponse.success) {
          // HttpOnly登录成功后，通过Server Action调用API
          console.log("HttpOnly登录成功，开始通过Server Action调用API...");
          const apiResponse = await httpOnlyApiCallAction('/test', { method: 'GET' });
          console.log("HttpOnly API调用结果：", apiResponse);
          setApiResult(apiResponse);
        }
        
      } catch (err) {
        console.error('HttpOnly客户端测试错误:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };
    
    testHttpOnlyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await httpOnlyLogoutAction();
    } catch (err) {
      console.error('登出错误:', err);
    }
  };

  const handleApiCall = async () => {
    try {
      setLoading(true);
      console.log("手动触发HttpOnly API调用...");
      const apiResponse = await httpOnlyApiCallAction('/test', { method: 'GET' });
      console.log("手动API调用结果：", apiResponse);
      setApiResult(apiResponse);
    } catch (err) {
      console.error('API调用错误:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const skills = [
    'HttpOnly Cookies', 'Server Actions', 'Next.js 15', 'Security', 'Authentication'
  ];

  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <Shield className="h-8 w-8 mr-3 text-green-600" />
              <h1 className="text-3xl font-bold">
                HttpOnly客户端测试
                {loading && <span className="text-sm text-gray-500 ml-2">(加载中...)</span>}
                {error && <span className="text-sm text-red-500 ml-2">(错误: {error})</span>}
                {loginResult?.success && <span className="text-sm text-green-500 ml-2">(✓ 登录成功)</span>}
              </h1>
            </div>

            {/* 测试结果显示 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  HttpOnly Cookies 测试结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700">登录结果:</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(loginResult, null, 2)}
                    </pre>
                  </div>
                  
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
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {loading ? '调用中...' : '测试API调用'}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      测试登出
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
                  HttpOnly技术栈
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
              <h2 className="text-xl font-bold mb-4">HttpOnly Cookies 方案特点</h2>
              <p className="mb-4 leading-relaxed">
                这个页面演示了HttpOnly Cookies方案的实现。该方案具有更高的安全性，
                token存储在HttpOnly cookies中，JavaScript无法直接访问，有效防止XSS攻击。
                客户端通过Server Actions安全地调用后端API。
              </p>

              <h3 className="text-lg font-bold mb-3 mt-6">客户端API调用方式</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">客户端无法直接读取HttpOnly cookie中的token</li>
                <li className="mb-2">通过Server Actions代理API调用，保证安全性</li>
                <li className="mb-2">Server Actions在服务端读取token并转发请求</li>
                <li className="mb-2">客户端只能获得API调用结果，无法获取token</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">安全优势</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">HttpOnly cookies防止XSS攻击窃取token</li>
                <li className="mb-2">SameSite属性防止CSRF攻击</li>
                <li className="mb-2">Server Actions确保安全的服务端操作</li>
                <li className="mb-2">统一的token管理策略</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">实现方式</h3>
              <p className="mb-4 leading-relaxed">
                使用Next.js 15的Server Actions处理登录登出，
                HttpOnly cookies存储token，客户端通过Server Actions与服务端安全交互。
              </p>

              <Separator className="my-6" />

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  <span>安全第一！</span>
                </div>
                <p className="text-sm text-gray-500">
                  HttpOnly Cookies方案提供了更高的安全性，
                  适合生产环境使用。
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