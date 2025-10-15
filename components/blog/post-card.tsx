import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, MessageCircle, Clock } from 'lucide-react';
import type { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN });

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="flex flex-col md:flex-row md:px-3 md:py-0">
        {/* 左侧内容区 */}
        <div className="flex-1 flex flex-col">
          <CardHeader className="space-y-2 pb-2 pt-2">
            {/* 标签徽章 */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                置顶
              </Badge>
              {post.tags.slice(0, 2).map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge variant="outline" className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* 标题 */}
            <Link href={`/posts/${post.id}`}>
              <h3 className="text-base font-semibold line-clamp-2 hover:text-blue-600 transition-colors" style={{ color: '#34495e' }}>
                {post.title}
              </h3>
            </Link>
          </CardHeader>

          <CardContent className="flex-1 pb-2 pt-0">
            {/* 分类和统计信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              <Link href={`/categories/${post.category.slug}`} className="flex items-center hover:text-blue-600 transition-colors">
                <span className="mr-1">📂</span>
                <span>{post.category.name}</span>
              </Link>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{post.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{post.commentCount}</span>
              </div>
            </div>

            {/* 摘要 */}
            <p className="text-gray-600 text-sm line-clamp-2">
              {post.summary}
            </p>
          </CardContent>

          <CardFooter className="pt-0 pb-2">
            {/* 底部标签 */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge variant="secondary" className="text-xs hover:bg-gray-200 transition-colors">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardFooter>
        </div>

        {/* 右侧图片区 */}
        {post.coverImage && (
          <div className="relative w-full md:w-48 h-32 md:h-32 overflow-hidden md:ml-4 md:mr-2 flex-shrink-0 md:self-center">
            <Link href={`/posts/${post.id}`}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
              />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}