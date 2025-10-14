import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Globe, MapPin, Calendar, Code, Heart, Shield, Server } from 'lucide-react';
import { author } from '@/lib/data';
import { httpOnlyApi } from '@/lib/api/httponly-client';
import { getHttpOnlyAccessToken, isHttpOnlyAuthenticated } from '@/lib/api/httponly-token-manager';
import type { User as UserType } from '@/types/api';

export default async function TestServer1Page() {
  let loginResult: any = null;
  let apiResult: any = null;
  let accessToken: string | null = null;
  let isAuthenticated = false;
  let error: string | null = null;

  const user: UserType = {
    username: "admin",
    password: "123456",
  };

  try {
    console.log("开始HttpOnly服务端测试...");
    
    // 只检查是否已经登录（不执行登录操作）
    isAuthenticated = await isHttpOnlyAuthenticated();
    console.log("当前认证状态:", isAuthenticated);
    
    // 获取当前token
    accessToken = await getHttpOnlyAccessToken();
    console.log("当前AccessToken:", accessToken ? `${accessToken.substring(0, 10)}...` : 'null');
    
    // 测试API调用
    if (accessToken) {
      console.log("开始HttpOnly服务端API调用...");
      apiResult = await httpOnlyApi.fetch('/test', {
        method: 'GET'
      });
      console.log("HttpOnly API调用结果:", apiResult);
    } else {
      apiResult = { message: "未登录：请先访问 /testclient1 页面进行登录" };
    }
    
  } catch (err) {
    console.error('HttpOnly服务端测试错误:', err);
    error = err instanceof Error ? err.message : '未知错误';
  }

  const skills = [
    'Server Components', 'HttpOnly Cookies', 'Server Actions', 'Security', 'Next.js 15'
  ];

  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <Server className="h-8 w-8 mr-3 text-purple-600" />
              <h1 className="text-3xl font-bold">
                HttpOnly服务端测试+++ {apiResult.Authorization}
                {error && <span className="text-sm text-red-500 ml-2">(错误: {error})</span>}
                {accessToken && <span className="text-sm text-green-500 ml-2">(Token: {accessToken.substring(0, 10)}...)</span>}
                {isAuthenticated && <span className="text-sm text-blue-500 ml-2">(✓ 已认证)</span>}
              </h1>
            </div>

            {/* 测试结果显示 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  HttpOnly服务端测试结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700">认证状态:</h4>
                    <div className="text-sm mt-1">
                      <span className={`px-2 py-1 rounded ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isAuthenticated ? '已认证' : '未认证'}
                      </span>
                    </div>
                  </div>
                  
                  {loginResult && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">登录结果:</h4>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(loginResult, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {accessToken && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">访问令牌:</h4>
                      <div className="text-xs bg-blue-50 p-2 rounded mt-1">
                        {accessToken.substring(0, 20)}... (HttpOnly Cookie)
                      </div>
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
                </div>
              </CardContent>
            </Card>

            {/* 安全特性说明 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  HttpOnly安全特性
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded">
                    <h5 className="font-semibold text-green-800 mb-2">✓ XSS防护</h5>
                    <p className="text-sm text-green-700">HttpOnly cookies无法被JavaScript访问</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded">
                    <h5 className="font-semibold text-blue-800 mb-2">✓ CSRF防护</h5>
                    <p className="text-sm text-blue-700">SameSite属性防止跨站请求</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <h5 className="font-semibold text-purple-800 mb-2">✓ 服务端管理</h5>
                    <p className="text-sm text-purple-700">Server Actions安全处理认证</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded">
                    <h5 className="font-semibold text-orange-800 mb-2">✓ 自动传输</h5>
                    <p className="text-sm text-orange-700">Cookie自动包含在请求中</p>
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
                  服务端技术栈
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
              <h2 className="text-xl font-bold mb-4">服务端组件认证</h2>
              <p className="mb-4 leading-relaxed">
                这个服务端组件演示了HttpOnly Cookies方案在Next.js 15中的实现。
                所有的认证逻辑都在服务端执行，确保了最高的安全性。
              </p>

              <h3 className="text-lg font-bold mb-3 mt-6">实现原理</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Server Actions处理登录认证，设置HttpOnly cookies</li>
                <li className="mb-2">服务端组件自动读取cookie中的token</li>
                <li className="mb-2">API调用时自动携带认证信息</li>
                <li className="mb-2">统一的错误处理和重定向机制</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">vs 原方案对比</h3>
              <p className="mb-4 leading-relaxed">
                相比于原方案的混合cookie策略，HttpOnly方案提供了：
                更高的安全性、更清晰的架构、更简单的维护，
                是生产环境的最佳选择。
              </p>

              <Separator className="my-6" />

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  <span>安全至上，简单至美！</span>
                </div>
                <p className="text-sm text-gray-500">
                  HttpOnly Cookies + Server Actions = 现代Web应用的最佳实践
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