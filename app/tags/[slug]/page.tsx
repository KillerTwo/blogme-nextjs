import { notFound } from 'next/navigation';
import { TagClient } from './client';
import { tags } from '@/lib/data';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = tags.find(t => t.slug === slug);
  
  if (!tag) {
    notFound();
  }

  return <TagClient tag={tag} />;
}