"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 解析Markdown内容生成目录
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中文、英文、数字、空格、连字符
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  // 监听滚动，高亮当前章节
  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      
      let currentActiveId = '';
      for (const heading of headings) {
        if (heading) {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            currentActiveId = heading.id;
          }
        }
      }
      
      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems, activeId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (tocItems.length === 0) return null;

  // 折叠状态：显示为简洁的圆形按钮
  if (isCollapsed) {
    return (
      <Button
        onClick={() => setIsCollapsed(false)}
        className={cn(
          "fixed top-20 right-4 z-10 h-12 w-12 rounded-full shadow-lg",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "border-2 border-white/20 backdrop-blur-sm",
          "transition-all duration-300 hover:scale-105 active:scale-95",
          "max-sm:h-10 max-sm:w-10 max-sm:top-16 max-sm:right-2",
          className
        )}
        title={`展开目录 (${tocItems.length}个章节)`}
      >
        <div className="flex flex-col items-center justify-center">
          <List className="h-4 w-4 max-sm:h-3 max-sm:w-3" />
          <span className="text-xs mt-0.5 leading-none max-sm:hidden">
            {tocItems.length}
          </span>
        </div>
      </Button>
    );
  }

  // 展开状态：显示完整的目录卡片
  return (
    <Card className={cn(
      "fixed z-10 shadow-lg backdrop-blur-sm bg-white/95 border-gray-200/50 transition-all duration-300",
      // 响应式位置和大小
      "top-20 right-4 lg:right-4",
      "max-sm:top-16 max-sm:right-2 max-sm:left-2",
      // 折叠状态的宽度处理
      isCollapsed 
        ? "w-auto max-sm:w-auto" 
        : "w-72 max-h-96 max-sm:w-auto max-sm:max-w-xs",
      className
    )}>
      <CardHeader className="pb-2 px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <List className="h-4 w-4 mr-2 text-blue-600" />
            <span>文章目录</span>
            <span className="ml-2 text-xs text-gray-500 font-normal">
              ({tocItems.length})
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            title="折叠目录"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 max-h-80 overflow-y-auto max-sm:max-h-60">
        <nav className="space-y-1">
          {tocItems.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(item.id)}
              className={cn(
                "block w-full text-left text-xs py-2 px-3 rounded-md transition-all duration-200",
                "hover:bg-gray-100/80 hover:shadow-sm max-sm:py-1.5 max-sm:px-2",
                {
                  "ml-3 max-sm:ml-2": item.level === 2,
                  "ml-6 max-sm:ml-4": item.level === 3,
                  "ml-9 max-sm:ml-6": item.level === 4,
                  "ml-12 max-sm:ml-8": item.level === 5,
                  "ml-15 max-sm:ml-10": item.level === 6,
                },
                activeId === item.id 
                  ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <span className="line-clamp-2">{item.text}</span>
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}