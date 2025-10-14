import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
