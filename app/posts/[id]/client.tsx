"use client";

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { CommentSystem } from '@/components/blog/comment-system';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Eye, MessageCircle, Clock, ArrowLeft } from 'lucide-react';
import type { Post, Comment } from '@/lib/types';

interface PostClientProps {
  post: Post;
  comments: Comment[];
}

export function PostClient({ post, comments }: PostClientProps) {
  const formattedDate = format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN });

  // 生成标题ID的辅助函数
  const generateHeadingId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中文、英文、数字、空格、连字符
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <BlogLayout>
      {/* 目录导航 */}
      <TableOfContents content={post.content} />
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-5">
          <article className="bg-white rounded-lg shadow-sm p-8">
            {/* 返回按钮 */}
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Link>

            {/* 文章头部信息 */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{post.author.name}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentCount}</span>
                </div>
              </div>

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
            </header>

            {/* 封面图片 */}
            {post.coverImage && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* 文章摘要 */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <p className="text-gray-700 italic">{post.summary}</p>
            </div>

            <Separator className="mb-8" />

            {/* 文章内容 */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => {
                    const text = String(children);
                    const id = generateHeadingId(text);
                    return <h1 id={id} className="text-2xl font-bold mb-4 mt-8 scroll-mt-20">{children}</h1>;
                  },
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = generateHeadingId(text);
                    return <h2 id={id} className="text-xl font-bold mb-3 mt-6 scroll-mt-20">{children}</h2>;
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = generateHeadingId(text);
                    return <h3 id={id} className="text-lg font-bold mb-2 mt-4 scroll-mt-20">{children}</h3>;
                  },
                  h4: ({ children }) => {
                    const text = String(children);
                    const id = generateHeadingId(text);
                    return <h4 id={id} className="text-base font-bold mb-2 mt-3 scroll-mt-20">{children}</h4>;
                  },
                  h5: ({ children }) => {
                    const text = String(children);
                    const id = generateHeadingId(text);
                    return <h5 id={id} className="text-sm font-bold mb-2 mt-3 scroll-mt-20">{children}</h5>;
                  },
                  h6: ({ children }) => {
                    const text = String(children);
                    const id = generateHeadingId(text);
                    return <h6 id={id} className="text-xs font-bold mb-2 mt-3 scroll-mt-20">{children}</h6>;
                  },
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        <code>{children}</code>
                      </pre>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            <Separator className="my-8" />

            {/* 作者信息 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{post.author.name}</h3>
                  <p className="text-gray-600 mb-2">{post.author.bio}</p>
                  {post.author.website && (
                    <a 
                      href={post.author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      访问个人网站
                    </a>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* 评论系统 */}
            <CommentSystem postId={post.id} comments={comments} />
          </article>
        </div>

        <div className="lg:col-span-2">
          <Sidebar />
        </div>
      </div>
    </BlogLayout>
  );
}