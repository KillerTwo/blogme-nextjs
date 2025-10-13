import { notFound } from 'next/navigation';
import { CategoryClient } from './client';
import { categories } from '@/lib/data';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  return <CategoryClient category={category} />;
}