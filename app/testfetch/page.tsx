import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Globe, MapPin, Calendar, Code, Heart } from 'lucide-react';
import { author } from '@/lib/data';
import { api } from '@/lib/api';
import type { User as UserType } from '@/types/api';

export default async function TestFetchPage() {
  let accessToken: string | null = null;
  let authorization: string | null = null;
  let error: string | null = null;

  const user: UserType = {
    username: "admin",
    password: "123456",
  };

  try {
    // 使用统一API登录
    const res = await api.login(user.username, user.password);
    console.log("服务端登录返回结果：", res);
    accessToken = res.access_token;
    
    // 测试普通API调用
    const testData = await api.fetch('/test', {
      method: 'GET'
    });
    authorization = testData.Authorization;
    console.log("测试API调用结果：", testData);
    
  } catch (err) {
    console.error('服务端API调用错误:', err);
    error = err instanceof Error ? err.message : '未知错误';
  }

  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 
    'Vue', 'Python', 'Docker', 'Git', 'AWS'
  ];

  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <User className="h-8 w-8 mr-3 text-blue-600" />
              <h1 className="text-3xl font-bold">
                服务端API测试{authorization}+
                {error && <span className="text-sm text-red-500 ml-2">(错误: {error})</span>}
                {accessToken && <span className="text-sm text-green-500 ml-2">(Token: {accessToken.substring(0, 10)}...)</span>}
              </h1>
            </div>

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
                  技能标签
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
              <h2 className="text-xl font-bold mb-4">个人经历</h2>
              <p className="mb-4 leading-relaxed">
                我是一名热爱技术的全栈开发者，专注于前端开发已有多年经验。
                在工作中，我主要使用 React、Vue、Node.js 等技术栈，
                喜欢探索新技术，分享技术心得。
              </p>

              <h3 className="text-lg font-bold mb-3 mt-6">工作经验</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">2022年至今 - 高级前端工程师，负责企业级应用开发</li>
                <li className="mb-2">2020-2022年 - 前端工程师，参与多个大型项目开发</li>
                <li className="mb-2">2018-2020年 - 初级开发工程师，学习并实践前端技术</li>
              </ul>

              <h3 className="text-lg font-bold mb-3 mt-6">开源贡献</h3>
              <p className="mb-4 leading-relaxed">
                积极参与开源社区，为多个知名开源项目贡献代码，
                同时维护自己的开源项目，帮助更多开发者解决技术问题。
              </p>

              <h3 className="text-lg font-bold mb-3 mt-6">兴趣爱好</h3>
              <p className="mb-4 leading-relaxed">
                除了编程，我还喜欢阅读技术书籍、写作、旅行和摄影。
                相信技术改变生活，也希望通过自己的努力让世界变得更美好。
              </p>

              <Separator className="my-6" />

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  <span>感谢您的关注！</span>
                </div>
                <p className="text-sm text-gray-500">
                  如果您对我的文章有任何建议或想要交流技术问题，
                  欢迎通过邮件或者在留言板留言与我联系。
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