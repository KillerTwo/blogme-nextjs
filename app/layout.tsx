import type { Metadata } from "next";
import "./globals.css";
import {BlogLayout} from "@/components/layout/blog-layout";
import {Sidebar} from "@/components/blog/sidebar";

export const metadata: Metadata = {
  title: "MyXIdeal Blog - 现代化个人博客系统",
  description: "基于 Next.js 和 shadcn/ui 构建的现代化个人博客系统，分享技术与生活",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
      {/*<BlogLayoutHead />*/}
      {children}
      {/*<BlogLayout>
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
              <div className="lg:col-span-5 space-y-8">{children}</div>
              <div className="lg:col-span-2">
                  <Sidebar />
              </div>
          </div>
      </BlogLayout>*/}
      </body>
    </html>
  );
}
