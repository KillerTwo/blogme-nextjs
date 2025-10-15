"use client";

import { useState, useEffect } from 'react';
import BlogLayoutHead from "@/components/blog/blog-layout-head";
import {NextAuthProvider} from "@/lib/auth/nextauth-index";

// import BlogLayoutHead from "@/components/blog/blog-layout-head";

interface LayoutProps {
  children: React.ReactNode;
}

function MyBlogLayout({ children }: LayoutProps) {
  const [lastScrollY, setLastScrollY] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      /*if (currentScrollY < 100) {
        setHeaderVisible(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }
      }*/

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogLayoutHead />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <div className="text-gray-900 font-medium">ModStart Blog - 现代化个人博客系统</div>
            <div className="text-gray-500 text-sm">
              Powered by Next.js & shadcn/ui
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 ModStart. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function BlogLayout({ children }: LayoutProps) {
    return (
        <NextAuthProvider>
            <MyBlogLayout>{children}</MyBlogLayout>
        </NextAuthProvider>
    );
}
