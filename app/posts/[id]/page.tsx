import { notFound } from 'next/navigation';
import { PostClient } from './client';
import { posts, getCommentsByPostId } from '@/lib/data';

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    notFound();
  }

  const comments = getCommentsByPostId(post.id);

  return <PostClient post={post} comments={comments} />;
}