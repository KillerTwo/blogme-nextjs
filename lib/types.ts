export interface Post {
  id: number;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  category: Category;
  tags: Tag[];
  author: Author;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  parentId?: number;
  children?: Category[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

export interface Author {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  email?: string;
  website?: string;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface FriendLink {
  id: number;
  name: string;
  url: string;
  description?: string;
  logo?: string;
}

export interface Guestbook {
  id: number;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  parentId?: number;
  replies?: Guestbook[];
}

export interface Archive {
  year: number;
  months: {
    month: number;
    posts: Post[];
  }[];
}