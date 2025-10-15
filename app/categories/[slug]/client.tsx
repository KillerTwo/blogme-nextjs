"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BlogLayout } from '@/components/layout/blog-layout';
import { PostCard } from '@/components/blog/post-card';
import { Sidebar } from '@/components/blog/sidebar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { FolderOpen, ArrowLeft } from 'lucide-react';
import { posts } from '@/lib/data';
import type { Category } from '@/lib/types';
import ContentLayout from "@/components/layout/content-layout";

interface CategoryClientProps {
  category: Category;
}

export function CategoryClient({ category }: CategoryClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const categoryPosts = posts.filter(post => post.categoryId === category.id);
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = categoryPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categoryPosts.length / pageSize);

  return (
      <ContentLayout>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <Link 
              href="/categories" 
              className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回分类列表
            </Link>

            <div className="flex items-center mb-6">
              <FolderOpen className="h-8 w-8 mr-3 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                {category.description && (
                  <p className="text-gray-600 mt-2">{category.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  共 {categoryPosts.length} 篇文章
                </p>
              </div>
            </div>
          </div>

          {categoryPosts.length > 0 ? (
            <>
              <div className="flex flex-col gap-2">
                {currentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center">
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
                        />
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
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">该分类下暂无文章</p>
            </div>
          )}
      </ContentLayout>
  );
}