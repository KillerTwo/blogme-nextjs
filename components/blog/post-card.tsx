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
  const formattedDate = format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN });

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <Link href={`/posts/${post.id}`}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
        </div>
      )}
      
      <CardHeader className="space-y-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{post.author.name}</span>
        </div>
        
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-lg font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.summary}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Link href={`/categories/${post.category.slug}`}>
            <Badge variant="secondary" className="hover:bg-blue-100 transition-colors">
              {post.category.name}
            </Badge>
          </Link>
          {post.tags.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <Badge variant="outline" className="hover:bg-gray-100 transition-colors">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}