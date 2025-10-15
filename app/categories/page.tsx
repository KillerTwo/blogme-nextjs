import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen } from 'lucide-react';
import { categories } from '@/lib/data';
import ContentLayout from "@/components/layout/content-layout";

export default function CategoriesPage() {
  return (
      <ContentLayout>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <FolderOpen className="h-8 w-8 mr-3 text-blue-600" />
              <h1 className="text-3xl font-bold">文章分类</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </CardTitle>
                        <Badge variant="secondary">
                          {category.postCount} 篇
                        </Badge>
                      </div>
                      {category.description && (
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
      </ContentLayout>
  );
}