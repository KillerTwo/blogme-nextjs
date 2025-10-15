import type { Post, Category, Tag, Author, FriendLink, Guestbook, Comment } from './types';

export const author: Author = {
  id: 1,
  name: '天下第一',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ModStart',
  bio: '热爱技术，分享生活。专注于Web开发、React、Node.js等领域。',
  email: 'admin@example.com',
  website: 'https://modstart.com',
};

export const categories: Category[] = [
  { 
    id: 1, 
    name: '技术分享', 
    slug: 'technology', 
    description: '技术相关的文章', 
    postCount: 12,
    children: [
      { id: 11, name: '前端开发', slug: 'frontend', description: '前端技术文章', postCount: 8, parentId: 1 },
      { id: 12, name: '后端开发', slug: 'backend', description: '后端技术文章', postCount: 6, parentId: 1 },
      { id: 13, name: '移动开发', slug: 'mobile', description: '移动端开发技术', postCount: 4, parentId: 1 },
    ]
  },
  { 
    id: 2, 
    name: '生活随笔', 
    slug: 'life', 
    description: '记录生活点滴', 
    postCount: 8,
    children: [
      { id: 21, name: '日常生活', slug: 'daily', description: '日常生活记录', postCount: 5, parentId: 2 },
      { id: 22, name: '旅行游记', slug: 'travel', description: '旅行见闻', postCount: 3, parentId: 2 },
    ]
  },
  { 
    id: 3, 
    name: '教程指南', 
    slug: 'tutorial', 
    description: '各类教程和指南', 
    postCount: 15,
    children: [
      { id: 31, name: '基础教程', slug: 'basic', description: '基础入门教程', postCount: 8, parentId: 3 },
      { id: 32, name: '进阶教程', slug: 'advanced', description: '进阶技术教程', postCount: 5, parentId: 3 },
      { id: 33, name: '实战项目', slug: 'project', description: '实战项目教程', postCount: 2, parentId: 3 },
    ]
  },
  { 
    id: 4, 
    name: '开源项目', 
    slug: 'opensource', 
    description: '开源项目分享', 
    postCount: 6 
  },
];

export const tags: Tag[] = [
  { id: 1, name: 'React', slug: 'react', postCount: 10 },
  { id: 2, name: 'TypeScript', slug: 'typescript', postCount: 8 },
  { id: 3, name: 'Node.js', slug: 'nodejs', postCount: 6 },
  { id: 4, name: 'Laravel', slug: 'laravel', postCount: 5 },
  { id: 5, name: 'Vue', slug: 'vue', postCount: 7 },
  { id: 6, name: 'JavaScript', slug: 'javascript', postCount: 12 },
  { id: 7, name: 'CSS', slug: 'css', postCount: 4 },
  { id: 8, name: 'Docker', slug: 'docker', postCount: 3 },
];

export const posts: Post[] = [
  {
    id: 1,
    title: 'React Router 7 完全指南',
    summary: '深入了解 React Router 7 的新特性和最佳实践，包括数据加载、类型安全等内容。',
    content: `# React Router 7 完全指南

React Router 7 带来了许多令人兴奋的新特性，本文将详细介绍这些特性和最佳实践。

## 主要特性

### 1. 类型安全
React Router 7 提供了完整的 TypeScript 支持，让开发更加安全和高效。

### 2. 数据加载
新的数据加载机制让获取数据变得更加简单直观。

\`\`\`typescript
export async function loader() {
  const data = await fetchData();
  return data;
}
\`\`\`

### 3. 路由配置
支持更灵活的路由配置方式，包括嵌套路由和动态路由。

## 安装和配置

首先安装 React Router 7：

\`\`\`bash
npm install react-router@7
\`\`\`

### 基础配置
配置基本的路由结构：

\`\`\`jsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  }
]);
\`\`\`

## 高级特性

### 错误边界
React Router 7 提供了更好的错误处理机制。

### 懒加载
支持路由级别的代码分割和懒加载。

## 最佳实践

### 1. 类型定义
为路由参数定义明确的类型。

### 2. 错误处理
合理处理路由错误和加载状态。

### 3. 性能优化
使用懒加载和预加载策略优化性能。

## 总结

React Router 7 是一个强大的路由库，值得每个 React 开发者学习和使用。`,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[0], tags[1]],
    author,
    viewCount: 1234,
    commentCount: 15,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Next.js 与 shadcn/ui 最佳实践',
    summary: '探索 Next.js 与 shadcn/ui 的完美结合，打造现代化的 React 应用。',
    content: `# Next.js 与 shadcn/ui 最佳实践

Next.js 是现代 React 应用的首选框架，结合 shadcn/ui 组件库可以快速构建美观的界面。

## 核心特性

### App Router
Next.js 13+ 引入的 App Router 提供了更好的开发体验。

### shadcn/ui 组件
shadcn/ui 提供了高质量的、可定制的 React 组件。

\`\`\`tsx
import { Button } from "@/components/ui/button"

function App() {
  return <Button variant="outline">Click me</Button>
}
\`\`\`

## 主题定制
使用 CSS 变量和 Tailwind CSS 实现主题定制。

## 最佳实践
合理使用服务端渲染和客户端渲染。`,
    coverImage: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[0], tags[6]],
    author,
    viewCount: 987,
    commentCount: 8,
    createdAt: '2024-01-14T09:30:00Z',
    updatedAt: '2024-01-14T09:30:00Z',
  },
  {
    id: 3,
    title: 'TypeScript 高级技巧',
    summary: '掌握 TypeScript 的高级特性，编写更安全、更优雅的代码。',
    content: `# TypeScript 高级技巧

TypeScript 为 JavaScript 带来了类型安全。

## 泛型

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## 条件类型
条件类型让类型系统更加灵活。

## 工具类型
TypeScript 提供了丰富的工具类型。`,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [tags[1], tags[5]],
    author,
    viewCount: 2156,
    commentCount: 23,
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
  },
  {
    id: 4,
    title: 'Node.js 性能优化实战',
    summary: '从实战角度出发，分享 Node.js 应用的性能优化方法和最佳实践。',
    content: `# Node.js 性能优化实战

性能优化是生产环境的重要课题。

## 异步处理
充分利用 Node.js 的异步特性。

## 缓存策略
合理使用缓存可以大幅提升性能。

## 集群模式
使用 cluster 模块充分利用多核CPU。`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[2], tags[5]],
    author,
    viewCount: 1543,
    commentCount: 12,
    createdAt: '2024-01-12T11:10:00Z',
    updatedAt: '2024-01-12T11:10:00Z',
  },
  {
    id: 5,
    title: '我的2024年度总结',
    summary: '回顾这一年的收获与成长，展望未来的发展方向。',
    content: `# 我的2024年度总结

时光飞逝，转眼间2024年即将结束。

## 技术成长
今年学习了很多新技术...

## 工作收获
在工作中遇到了很多挑战...

## 生活感悟
技术之外，生活也很精彩...`,
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
    categoryId: 2,
    category: categories[1],
    tags: [],
    author,
    viewCount: 876,
    commentCount: 5,
    createdAt: '2024-01-11T16:45:00Z',
    updatedAt: '2024-01-11T16:45:00Z',
  },
  {
    id: 6,
    title: 'Docker 容器化部署指南',
    summary: '从零开始学习 Docker，掌握容器化部署的核心技术。',
    content: `# Docker 容器化部署指南

Docker 已成为现代应用部署的标准。

## Dockerfile 编写
编写高效的 Dockerfile 是关键。

## Docker Compose
使用 Docker Compose 管理多容器应用。

## 最佳实践
容器化部署的一些注意事项。`,
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [tags[7]],
    author,
    viewCount: 1876,
    commentCount: 18,
    createdAt: '2024-01-10T13:30:00Z',
    updatedAt: '2024-01-10T13:30:00Z',
  },
  {
    id: 7,
    title: 'Vue 3 响应式原理深度解析',
    summary: '深入理解 Vue 3 的响应式系统，掌握 Proxy 和 Reflect 的使用。',
    content: '# Vue 3 响应式原理深度解析\n\nVue 3 的响应式系统是框架的核心...',
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[4], tags[5]],
    author,
    viewCount: 2341,
    commentCount: 28,
    createdAt: '2024-01-09T10:15:00Z',
    updatedAt: '2024-01-09T10:15:00Z',
  },
  {
    id: 8,
    title: 'CSS Grid 布局完全指南',
    summary: 'CSS Grid 是现代网页布局的强大工具，掌握它让布局变得简单。',
    content: '# CSS Grid 布局完全指南\n\nCSS Grid 为我们提供了强大的布局能力...',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [tags[6], tags[5]],
    author,
    viewCount: 1654,
    commentCount: 15,
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-08T14:20:00Z',
  },
  {
    id: 9,
    title: 'Python 数据分析入门',
    summary: '使用 Pandas 和 NumPy 进行数据分析，从零开始学习数据科学。',
    content: '# Python 数据分析入门\n\n数据科学已成为最热门的技术领域之一...',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [],
    author,
    viewCount: 987,
    commentCount: 7,
    createdAt: '2024-01-07T09:30:00Z',
    updatedAt: '2024-01-07T09:30:00Z',
  },
  {
    id: 10,
    title: 'GraphQL API 设计最佳实践',
    summary: '构建高效的 GraphQL API，提升前后端数据交互体验。',
    content: '# GraphQL API 设计最佳实践\n\nGraphQL 为 API 设计带来了革命性变化...',
    coverImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[2], tags[5]],
    author,
    viewCount: 1432,
    commentCount: 19,
    createdAt: '2024-01-06T11:45:00Z',
    updatedAt: '2024-01-06T11:45:00Z',
  },
  {
    id: 11,
    title: '微服务架构设计模式',
    summary: '深入理解微服务架构的设计模式和最佳实践。',
    content: '# 微服务架构设计模式\n\n微服务架构已成为现代应用开发的主流选择...',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[2]],
    author,
    viewCount: 2156,
    commentCount: 34,
    createdAt: '2024-01-05T16:00:00Z',
    updatedAt: '2024-01-05T16:00:00Z',
  },
  {
    id: 12,
    title: 'MongoDB 数据库优化指南',
    summary: '学习 MongoDB 性能优化技巧，提升数据库查询效率。',
    content: '# MongoDB 数据库优化指南\n\n数据库性能优化是后端开发的重要技能...',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[2]],
    author,
    viewCount: 1765,
    commentCount: 23,
    createdAt: '2024-01-04T12:15:00Z',
    updatedAt: '2024-01-04T12:15:00Z',
  },
  {
    id: 13,
    title: 'Webpack 5 配置详解',
    summary: '掌握 Webpack 5 的新特性和配置技巧，优化构建流程。',
    content: '# Webpack 5 配置详解\n\nWebpack 5 带来了许多重要的更新...',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[5]],
    author,
    viewCount: 1298,
    commentCount: 16,
    createdAt: '2024-01-03T08:30:00Z',
    updatedAt: '2024-01-03T08:30:00Z',
  },
  {
    id: 14,
    title: 'Redis 缓存策略与实践',
    summary: '深入了解 Redis 缓存策略，提升应用性能。',
    content: '# Redis 缓存策略与实践\n\n缓存是提升应用性能的重要手段...',
    coverImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[2]],
    author,
    viewCount: 1876,
    commentCount: 25,
    createdAt: '2024-01-02T15:20:00Z',
    updatedAt: '2024-01-02T15:20:00Z',
  },
  {
    id: 15,
    title: 'Tailwind CSS 实用技巧',
    summary: '掌握 Tailwind CSS 的高级用法，快速构建美观界面。',
    content: '# Tailwind CSS 实用技巧\n\nTailwind CSS 让样式开发变得更加高效...',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [tags[6], tags[5]],
    author,
    viewCount: 1543,
    commentCount: 18,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 16,
    title: 'Git 工作流程最佳实践',
    summary: '学习 Git 分支管理和团队协作的最佳实践。',
    content: '# Git 工作流程最佳实践\n\n良好的 Git 工作流程是团队协作的基础...',
    coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [],
    author,
    viewCount: 2087,
    commentCount: 31,
    createdAt: '2023-12-31T14:30:00Z',
    updatedAt: '2023-12-31T14:30:00Z',
  },
  {
    id: 17,
    title: 'Kubernetes 容器编排入门',
    summary: '学习 Kubernetes 基础概念，掌握容器编排技术。',
    content: '# Kubernetes 容器编排入门\n\nKubernetes 是现代容器编排的标准...',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[7]],
    author,
    viewCount: 1732,
    commentCount: 22,
    createdAt: '2023-12-30T09:15:00Z',
    updatedAt: '2023-12-30T09:15:00Z',
  },
  {
    id: 18,
    title: 'Jest 测试框架完全指南',
    summary: '掌握 Jest 测试框架，编写高质量的单元测试。',
    content: '# Jest 测试框架完全指南\n\n测试是保证代码质量的重要环节...',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [tags[0], tags[5]],
    author,
    viewCount: 1456,
    commentCount: 14,
    createdAt: '2023-12-29T13:45:00Z',
    updatedAt: '2023-12-29T13:45:00Z',
  },
  {
    id: 19,
    title: 'Figma 设计系统构建',
    summary: '使用 Figma 构建完整的设计系统，提升设计效率。',
    content: '# Figma 设计系统构建\n\n设计系统是现代产品开发的重要组成部分...',
    coverImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [],
    author,
    viewCount: 1123,
    commentCount: 9,
    createdAt: '2023-12-28T16:20:00Z',
    updatedAt: '2023-12-28T16:20:00Z',
  },
  {
    id: 20,
    title: 'PWA 开发实战指南',
    summary: '构建 Progressive Web App，提供原生应用体验。',
    content: '# PWA 开发实战指南\n\nPWA 技术让网页应用具备了原生应用的体验...',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [tags[0], tags[5]],
    author,
    viewCount: 1654,
    commentCount: 20,
    createdAt: '2023-12-27T11:30:00Z',
    updatedAt: '2023-12-27T11:30:00Z',
  },
  {
    id: 21,
    title: 'Nginx 配置优化技巧',
    summary: '学习 Nginx 配置优化，提升服务器性能和安全性。',
    content: '# Nginx 配置优化技巧\n\nNginx 是最流行的 Web 服务器之一...',
    coverImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [],
    author,
    viewCount: 1987,
    commentCount: 27,
    createdAt: '2023-12-26T08:15:00Z',
    updatedAt: '2023-12-26T08:15:00Z',
  },
  {
    id: 22,
    title: 'Flutter 跨平台开发入门',
    summary: '使用 Flutter 开发跨平台应用，一套代码多端运行。',
    content: '# Flutter 跨平台开发入门\n\nFlutter 是 Google 推出的跨平台开发框架...',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    categoryId: 3,
    category: categories[2],
    tags: [],
    author,
    viewCount: 1432,
    commentCount: 17,
    createdAt: '2023-12-25T14:00:00Z',
    updatedAt: '2023-12-25T14:00:00Z',
  },
  {
    id: 23,
    title: '机器学习算法基础',
    summary: '了解常用的机器学习算法，为 AI 开发打好基础。',
    content: '# 机器学习算法基础\n\n机器学习是人工智能的重要分支...',
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    categoryId: 1,
    category: categories[0],
    tags: [],
    author,
    viewCount: 2341,
    commentCount: 35,
    createdAt: '2023-12-24T10:45:00Z',
    updatedAt: '2023-12-24T10:45:00Z',
  },
];

export const friendLinks: FriendLink[] = [
  {
    id: 1,
    name: 'ModStart',
    url: 'https://modstart.com',
    description: '模块化快速开发框架',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=ModStart',
  },
  {
    id: 2,
    name: 'Next.js',
    url: 'https://nextjs.org',
    description: 'The React Framework for Production',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=NextJS',
  },
  {
    id: 3,
    name: 'React',
    url: 'https://react.dev',
    description: 'The library for web and native user interfaces',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=React',
  },
  {
    id: 4,
    name: 'shadcn/ui',
    url: 'https://ui.shadcn.com',
    description: 'Beautifully designed components',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=ShadcnUI',
  },
];

const flatGuestbooks: Guestbook[] = [
  {
    id: 1,
    author: '访客A',
    email: 'visitor1@example.com',
    content: '网站做得很不错，内容很有价值！',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    author: '博主',
    email: 'admin@example.com',
    content: '谢谢支持！会继续努力的 😊',
    createdAt: '2024-01-15T11:00:00Z',
    parentId: 1,
  },
  {
    id: 3,
    author: '访客B',
    email: 'visitor2@example.com',
    content: '我也觉得很棒！',
    createdAt: '2024-01-15T14:20:00Z',
    parentId: 1,
  },
  {
    id: 4,
    author: '技术爱好者',
    email: 'tech@example.com',
    content: '感谢分享这些技术文章，对我帮助很大。',
    createdAt: '2024-01-14T15:20:00Z',
  },
  {
    id: 5,
    author: '博主',
    email: 'admin@example.com',
    content: '很高兴能帮到你！有任何问题都可以留言交流。',
    createdAt: '2024-01-14T16:30:00Z',
    parentId: 4,
  },
];

function buildCommentTree(comments: Guestbook[]): Guestbook[] {
  const map = new Map<number, Guestbook>();
  const roots: Guestbook[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const node = map.get(comment.id)!;
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.replies!.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export const guestbooks = buildCommentTree(flatGuestbooks);

// 文章评论数据
const flatComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    author: '前端爱好者',
    email: 'frontend@example.com',
    content: '这篇 React Router 7 的文章写得太好了！解答了我很多疑惑。',
    createdAt: '2024-01-15T12:30:00Z',
  },
  {
    id: 2,
    postId: 1,
    author: '博主',
    email: 'admin@example.com',
    content: '感谢支持！React Router 7 确实有很多令人兴奋的新特性。',
    createdAt: '2024-01-15T13:00:00Z',
    parentId: 1,
  },
  {
    id: 3,
    postId: 1,
    author: 'TypeScript开发者',
    email: 'ts-dev@example.com',
    content: '类型安全这一块讲得很详细，实用！',
    createdAt: '2024-01-15T14:20:00Z',
  },
  {
    id: 4,
    postId: 2,
    author: 'UI设计师',
    email: 'designer@example.com',
    content: 'shadcn/ui 确实比 Ant Design 更现代化，组件也很美观。',
    createdAt: '2024-01-14T15:30:00Z',
  },
  {
    id: 5,
    postId: 2,
    author: '博主',
    email: 'admin@example.com',
    content: '是的，shadcn/ui 的设计理念很棒，而且可定制性很强。',
    createdAt: '2024-01-14T16:00:00Z',
    parentId: 4,
  },
  {
    id: 6,
    postId: 3,
    author: 'TS新手',
    email: 'newbie@example.com',
    content: '工具类型那部分有点难理解，能再详细解释一下吗？',
    createdAt: '2024-01-13T16:45:00Z',
  },
  {
    id: 7,
    postId: 3,
    author: '博主',
    email: 'admin@example.com',
    content: '好建议！我会单独写一篇关于 TypeScript 工具类型的文章。',
    createdAt: '2024-01-13T17:30:00Z',
    parentId: 6,
  },
  {
    id: 8,
    postId: 3,
    author: '全栈工程师',
    email: 'fullstack@example.com',
    content: '泛型和条件类型的组合确实很强大，在实际项目中经常用到。',
    createdAt: '2024-01-13T18:00:00Z',
  },
];

function buildCommentTreeForPost(comments: Comment[]): Comment[] {
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const node = map.get(comment.id)!;
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.replies!.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

// 根据文章ID获取评论
export const getCommentsByPostId = (postId: number): Comment[] => {
  const postComments = flatComments.filter(comment => comment.postId === postId);
  return buildCommentTreeForPost(postComments);
};