import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Globe, MapPin, Calendar, Code, Heart, Key, Server, AlertTriangle } from 'lucide-react';
import { author } from '@/lib/data';
import { headers } from 'next/headers';
import JWTServerAuthWrapper from './jwt-server-auth-wrapper';

export default async function TestServer2Page() {
  // 检查middleware设置的header
  const headersList = await headers();
  const jwtAuthRequired = headersList.get('x-jwt-auth-required');
  const requestedPath = headersList.get('x-requested-path');

  const skills = [
    'Server Components', 'JWT + localStorage', 'Middleware Protection', 'Client Hydration'
  ];

  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <Server className="h-8 w-8 mr-3 text-indigo-600" />
              <h1 className="text-3xl font-bold">
                JWT + localStorage服务端测试
                {jwtAuthRequired && <span className="text-sm text-blue-500 ml-2">(需要认证)</span>}
              </h1>
            </div>

            {/* 服务端限制说明 */}
            <Card className="mb-8 border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  服务端组件限制
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-amber-700 space-y-2">
                  <p className="text-sm">
                    ⚠️ 服务端组件无法直接访问localStorage中的JWT token
                  </p>
                  <p className="text-sm">
                    💡 解决方案：使用客户端组件包装器进行认证检查和API调用
                  </p>
                  <p className="text-sm">
                    🔒 Middleware已标记此页面需要认证: {jwtAuthRequired || 'false'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 架构说明 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  JWT + localStorage服务端架构
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded">
                    <h5 className="font-semibold text-red-800 mb-2">❌ 不可行</h5>
                    <p className="text-sm text-red-700">服务端直接读取localStorage</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <h5 className="font-semibold text-green-800 mb-2">✅ 解决方案</h5>
                    <p className="text-sm text-green-700">客户端包装器 + 认证检查</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded">
                    <h5 className="font-semibold text-blue-800 mb-2">🔄 中间件</h5>
                    <p className="text-sm text-blue-700">路由级别的预检查</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <h5 className="font-semibold text-purple-800 mb-2">⚡ 水合</h5>
                    <p className="text-sm text-purple-700">客户端接管认证逻辑</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 使用客户端包装器进行API调用和认证检查 */}
            <JWTServerAuthWrapper />

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
              <h2 className="text-xl font-bold mb-4">JWT服务端组件挑战</h2>
              <p className="mb-4 leading-relaxed">
                JWT + localStorage方案在服务端组件中面临天然的限制：服务端无法访问浏览器的localStorage。
                这需要我们采用混合架构来解决认证问题。
              </p>

              <h3 className="text-lg font-bold mb-3 mt-6">解决方案</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">使用Next.js Middleware进行路由级别的预检查</li>
                <li className="mb-2">服务端组件渲染基础布局和静态内容</li>
                <li className="mb-2">客户端组件接管认证检查和动态内容</li>
                <li className="mb-2">通过Context共享认证状态</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">架构特点</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">服务端快速渲染：减少首屏加载时间</li>
                <li className="mb-2">客户端认证：保持JWT方案的灵活性</li>
                <li className="mb-2">渐进增强：优雅的降级策略</li>
                <li className="mb-2">SEO友好：服务端渲染保证搜索引擎可访问</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">最佳实践</h3>
              <p className="mb-4 leading-relaxed">
                对于JWT + localStorage方案，建议主要使用客户端组件进行业务逻辑处理，
                服务端组件负责SEO和首屏性能优化。这样可以充分发挥两种组件的优势。
              </p>

              <Separator className="my-6" />

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  <span>混合架构，最佳体验！</span>
                </div>
                <p className="text-sm text-gray-500">
                  通过合理的架构设计，JWT + localStorage方案同样可以在服务端组件中发挥作用
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