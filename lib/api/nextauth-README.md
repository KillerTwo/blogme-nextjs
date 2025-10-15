# NextAuth API 请求工具类使用指南

本项目封装了基于 NextAuth v5 的前后端请求工具类，自动处理 token 注入到请求头的 Authorization 字段。

## 文件说明

- `nextauth-client.ts` - 客户端组件使用的请求工具
- `nextauth-server.ts` - 服务端组件使用的请求工具
- `auth.ts` - NextAuth 配置，集成后端登录 API

## 一、客户端组件使用 (`nextauth-client.ts`)

### 1. 基础使用

```typescript
'use client'

import { nextauthApi } from '@/lib/api/nextauth-client'

export default function MyClientComponent() {
  const handleFetchData = async () => {
    // GET 请求
    const result = await nextauthApi.get('/api/users')

    if (result.error) {
      console.error('请求失败:', result.error)
      return
    }

    console.log('数据:', result.data)
  }

  return <button onClick={handleFetchData}>获取数据</button>
}
```

### 2. POST 请求

```typescript
const handleCreatePost = async () => {
  const result = await nextauthApi.post('/api/posts', {
    title: '标题',
    content: '内容'
  })

  if (result.error) {
    console.error('创建失败:', result.error)
    return
  }

  console.log('创建成功:', result.data)
}
```

### 3. 带查询参数的请求

```typescript
const result = await nextauthApi.get('/api/posts', {
  params: {
    page: 1,
    limit: 10,
    search: 'keyword'
  }
})
```

### 4. 文件上传

```typescript
const handleUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('description', '文件描述')

  const result = await nextauthApi.upload('/api/upload', formData)

  if (result.error) {
    console.error('上传失败:', result.error)
    return
  }

  console.log('上传成功:', result.data)
}
```

### 5. 文件下载

```typescript
const handleDownload = async () => {
  const result = await nextauthApi.download('/api/export', 'data.xlsx')

  if (!result.success) {
    console.error('下载失败:', result.error)
  }
}
```

### 6. 跳过认证（公开接口）

```typescript
const result = await nextauthApi.get('/api/public/info', {
  skipAuth: true
})
```

## 二、服务端组件使用 (`nextauth-server.ts`)

### 1. 在服务端组件中使用

```typescript
import { nextauthServerApi } from '@/lib/api/nextauth-server'

export default async function MyServerComponent() {
  // GET 请求
  const result = await nextauthServerApi.get('/api/users')

  if (result.error) {
    return <div>加载失败: {result.error}</div>
  }

  return (
    <div>
      <h1>用户列表</h1>
      <pre>{JSON.stringify(result.data, null, 2)}</pre>
    </div>
  )
}
```

### 2. 在 Server Actions 中使用

```typescript
'use server'

import { nextauthServerApi } from '@/lib/api/nextauth-server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const result = await nextauthServerApi.post('/api/posts', {
    title,
    content
  })

  if (result.error) {
    return { success: false, error: result.error }
  }

  return { success: true, data: result.data }
}
```

### 3. 在 Route Handler 中使用

```typescript
// app/api/proxy/route.ts
import { nextauthServerApi } from '@/lib/api/nextauth-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await nextauthServerApi.get('/api/backend-data')

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    )
  }

  return NextResponse.json(result.data)
}
```

## 三、完整的请求方法

### 客户端和服务端都支持以下方法：

```typescript
// GET 请求
nextauthApi.get<T>(endpoint, options?)

// POST 请求
nextauthApi.post<T>(endpoint, data?, options?)

// PUT 请求
nextauthApi.put<T>(endpoint, data?, options?)

// PATCH 请求
nextauthApi.patch<T>(endpoint, data?, options?)

// DELETE 请求
nextauthApi.delete<T>(endpoint, options?)

// 文件上传
nextauthApi.upload<T>(endpoint, formData, options?)

// 文件下载（仅客户端）
nextauthApi.download(endpoint, filename?, options?)
```

## 四、配置选项 (RequestOptions)

```typescript
interface RequestOptions {
  params?: Record<string, any>      // URL 查询参数
  skipAuth?: boolean                 // 是否跳过自动添加 token
  baseURL?: string                   // 自定义 baseURL
  headers?: HeadersInit              // 自定义请求头
  cache?: RequestCache               // 缓存策略（仅服务端）
  // ...其他 fetch 标准选项
}
```

## 五、响应格式 (ApiResponse)

```typescript
interface ApiResponse<T> {
  data?: T           // 成功时的数据
  error?: string     // 错误信息
  message?: string   // 附加消息
}
```

## 六、环境变量配置

在 `.env.local` 中配置：

```bash
# 后端 API 地址
BACKEND_URL=http://localhost:8080

# 客户端可访问的后端地址（可选）
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# NextAuth 密钥
AUTH_SECRET=your-secret-key
```

## 七、认证流程

### 1. 用户登录

```typescript
'use client'

import { signIn } from 'next-auth/react'

const handleLogin = async () => {
  const result = await signIn('credentials', {
    username: 'admin',
    password: '123456',
    redirect: false
  })

  if (result?.error) {
    console.error('登录失败')
  } else {
    console.log('登录成功')
  }
}
```

### 2. 自动 Token 注入

登录成功后，`nextauthApi` 和 `nextauthServerApi` 会自动：
1. 从 NextAuth session 中获取 accessToken
2. 将 token 添加到请求头：`Authorization: Bearer <token>`
3. 发送到后端服务

### 3. 后端接收

后端 Spring Boot 示例：

```java
@GetMapping("/api/users")
public ResponseEntity<?> getUsers(
    @RequestHeader("Authorization") String authorization
) {
    // authorization = "Bearer <token>"
    String token = authorization.substring(7);
    // 验证 token...
    return ResponseEntity.ok(users);
}
```

## 八、实际使用示例

### 示例 1: 博客文章列表（客户端）

```typescript
'use client'

import { useState, useEffect } from 'react'
import { nextauthApi } from '@/lib/api/nextauth-client'

interface Post {
  id: string
  title: string
  content: string
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await nextauthApi.get<Post[]>('/api/posts', {
        params: { page: 1, limit: 10 }
      })

      if (result.data) {
        setPosts(result.data)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  if (loading) return <div>加载中...</div>

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}
```

### 示例 2: 用户资料（服务端）

```typescript
import { nextauthServerApi } from '@/lib/api/nextauth-server'

interface UserProfile {
  id: string
  name: string
  email: string
}

export default async function ProfilePage() {
  const result = await nextauthServerApi.get<UserProfile>('/api/user/profile')

  if (result.error) {
    return <div>加载失败: {result.error}</div>
  }

  const profile = result.data!

  return (
    <div>
      <h1>用户资料</h1>
      <p>姓名: {profile.name}</p>
      <p>邮箱: {profile.email}</p>
    </div>
  )
}
```

## 九、测试页面

项目中已经包含两个测试页面：

- `/testclient3` - 客户端认证测试
- `/testserver3` - 服务端认证测试

可以访问这两个页面查看完整的使用示例。

## 十、注意事项

1. **客户端 vs 服务端**
   - 客户端组件：使用 `nextauth-client.ts`
   - 服务端组件/Actions/Route Handlers：使用 `nextauth-server.ts`

2. **性能优化**
   - 服务端请求使用了 React `cache` 优化
   - 默认使用 `cache: 'no-store'` 确保数据新鲜

3. **错误处理**
   - 始终检查 `result.error` 是否存在
   - 根据业务需求处理错误情况

4. **TypeScript 支持**
   - 所有方法都支持泛型，可以指定返回数据类型
   - 示例：`nextauthApi.get<User[]>('/api/users')`

5. **后端 API 格式**
   - 确保后端返回标准 JSON 格式
   - 错误时应返回包含 `error` 或 `message` 字段的 JSON
