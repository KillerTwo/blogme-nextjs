import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';
import { friendLinks } from '@/lib/data';

export default function LinksPage() {
  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <ExternalLink className="h-8 w-8 mr-3 text-blue-600" />
              <h1 className="text-3xl font-bold">友情链接</h1>
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">申请友链</h2>
              <p className="text-gray-600 text-sm">
                欢迎优质的技术博客与本站交换友情链接！请确保您的网站内容健康、更新频率稳定。
                如需申请友链，请通过邮件联系或在留言板留言。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {friendLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="group-hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={link.logo} alt={link.name} />
                          <AvatarFallback>{link.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-blue-600 transition-colors flex items-center">
                            {link.name}
                            <ExternalLink className="h-4 w-4 ml-2 opacity-50" />
                          </CardTitle>
                          {link.description && (
                            <CardDescription className="mt-1">
                              {link.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>

            {/* 友链要求 */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">友链要求</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 网站内容积极向上，无违法违规内容</li>
                <li>• 技术类博客，内容质量较高</li>
                <li>• 网站访问稳定，更新频率良好</li>
                <li>• 优先考虑原创内容较多的博客</li>
                <li>• 网站设计美观，用户体验良好</li>
              </ul>
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