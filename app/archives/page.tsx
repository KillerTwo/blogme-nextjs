import Link from 'next/link';
import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Archive, Calendar } from 'lucide-react';
import { posts } from '@/lib/data';
import type { Archive as ArchiveType } from '@/lib/types';

export default function ArchivesPage() {
  // 按年月归档文章
  const archives: ArchiveType[] = posts.reduce((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let yearArchive = acc.find(a => a.year === year);
    if (!yearArchive) {
      yearArchive = { year, months: [] };
      acc.push(yearArchive);
    }

    let monthArchive = yearArchive.months.find(m => m.month === month);
    if (!monthArchive) {
      monthArchive = { month, posts: [] };
      yearArchive.months.push(monthArchive);
    }

    monthArchive.posts.push(post);
    return acc;
  }, [] as ArchiveType[]).sort((a, b) => b.year - a.year);

  // 对每年的月份进行排序
  archives.forEach(yearArchive => {
    yearArchive.months.sort((a, b) => b.month - a.month);
    yearArchive.months.forEach(monthArchive => {
      monthArchive.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  });

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Archive className="h-8 w-8 mr-3 text-blue-600" />
                <h1 className="text-3xl font-bold">文章归档</h1>
              </div>
              <Badge variant="secondary" className="text-base px-3 py-1">
                共 {posts.length} 篇文章
              </Badge>
            </div>

            <div className="space-y-8">
              {archives.map((yearArchive) => (
                <div key={yearArchive.year}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                    {yearArchive.year} 年
                    <Badge variant="outline" className="ml-3">
                      {yearArchive.months.reduce((sum, month) => sum + month.posts.length, 0)} 篇
                    </Badge>
                  </h2>

                  <div className="space-y-6">
                    {yearArchive.months.map((monthArchive) => (
                      <Card key={monthArchive.month}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {monthNames[monthArchive.month - 1]}
                            <Badge variant="secondary" className="ml-2">
                              {monthArchive.posts.length} 篇
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {monthArchive.posts.map((post) => (
                              <div key={post.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors">
                                <Link 
                                  href={`/posts/${post.id}`}
                                  className="flex-1 hover:text-blue-600 transition-colors"
                                >
                                  <div className="font-medium">{post.title}</div>
                                  <div className="text-sm text-gray-500 mt-1">{post.summary}</div>
                                </Link>
                                <div className="text-sm text-gray-400 ml-4">
                                  {new Date(post.createdAt).toLocaleDateString('zh-CN', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {archives.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无文章归档
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <Sidebar />
        </div>
      </div>
    </BlogLayout>
  );
}