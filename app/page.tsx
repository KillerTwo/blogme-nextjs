"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PostCard } from '@/components/blog/post-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { posts } from '@/lib/data';
import ContentLayout from "@/components/layout/content-layout";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 每页显示6篇文章

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / pageSize);

  const carouselPosts = posts.slice(0, 4);
  return (
      <ContentLayout>
          {/* 轮播图 */}
          <Carousel className="w-full" autoplay={true} autoplayDelay={4000}>
            <CarouselContent>
              {carouselPosts.map((post) => (
                <CarouselItem key={post.id}>
                  <Link href={`/posts/${post.id}`}>
                    <div className="relative h-80 rounded-lg overflow-hidden group">
                      <Image
                        src={post.coverImage || '/placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-200 line-clamp-2">
                          {post.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* 文章列表 */}
          <div>
            {/*<div className="mb-4">
              <h2 className="text-xl font-semibold">最新文章</h2>
            </div>*/}
            <div className="flex flex-col gap-2">
              {currentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {/* 分页信息 */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                第 {currentPage} 页，共 {totalPages} 页 (总共 {posts.length} 篇文章)
              </div>
            </div>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    >
                      <span className="hidden sm:block">上一页</span>
                    </PaginationPrevious>
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    >
                      <span className="hidden sm:block">下一页</span>
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
      </ContentLayout>
  );
}
