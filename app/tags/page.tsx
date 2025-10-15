import Link from 'next/link';
import { BlogLayout } from '@/components/layout/blog-layout';
import { Sidebar } from '@/components/blog/sidebar';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { tags } from '@/lib/data';

export default function TagsPage() {
  return (
    <BlogLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <Tag className="h-8 w-8 mr-3 text-blue-600" />
              <h1 className="text-3xl font-bold">标签云</h1>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge 
                    variant="outline" 
                    className="text-base px-4 py-2 hover:bg-blue-100 hover:border-blue-500 transition-colors"
                    style={{
                      fontSize: `${Math.min(1.5, 0.8 + (tag.postCount / 10))}rem`
                    }}
                  >
                    {tag.name} ({tag.postCount})
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Sidebar />
        </div>
      </div>
    </BlogLayout>
  );
}