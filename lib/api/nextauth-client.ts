/**
 * NextAuth客户端API请求工具类
 * 自动从NextAuth session中获取token并添加到请求头
 */

import { getSession } from 'next-auth/react'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>
  skipAuth?: boolean // 是否跳过自动添加token
  baseURL?: string // 可选的自定义baseURL
}

class NextAuthClientApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8080'
  }

  /**
   * 获取当前session中的accessToken
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      const session = await getSession()
      return session?.accessToken || null
    } catch (error) {
      console.error('获取accessToken失败:', error)
      return null
    }
  }

  /**
   * 构建完整URL（包含query参数）
   */
  private buildUrl(endpoint: string, params?: Record<string, any>, baseURL?: string): string {
    const base = baseURL || this.baseURL
    const url = endpoint.startsWith('http') ? endpoint : `${base}${endpoint}`

    if (!params || Object.keys(params).length === 0) {
      return url
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  /**
   * 构建请求headers
   */
  private async buildHeaders(options: RequestOptions = {}): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // 合并自定义headers
    if (options.headers) {
      const customHeaders = new Headers(options.headers)
      customHeaders.forEach((value, key) => {
        headers[key] = value
      })
    }

    // 自动添加Authorization header
    if (!options.skipAuth) {
      const token = await this.getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * 通用请求方法
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { params, skipAuth, baseURL, ...fetchOptions } = options
      const url = this.buildUrl(endpoint, params, baseURL)
      const headers = await this.buildHeaders(options)

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      // 处理响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`
        }))
        return {
          error: errorData.error || errorData.message || `请求失败: ${response.status}`,
          message: errorData.message,
        }
      }

      // 处理204 No Content
      if (response.status === 204) {
        return { data: null as T }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API请求异常:', error)
      return {
        error: error instanceof Error ? error.message : '网络请求失败',
      }
    }
  }

  /**
   * GET请求
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST请求
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT请求
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * 上传文件
   */
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    options?: Omit<RequestOptions, 'body' | 'headers'>
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, options?.params, options?.baseURL)
      const token = await this.getAccessToken()

      const headers: Record<string, string> = {}
      if (token && !options?.skipAuth) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`
        }))
        return {
          error: errorData.error || errorData.message || `上传失败: ${response.status}`,
          message: errorData.message,
        }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('文件上传异常:', error)
      return {
        error: error instanceof Error ? error.message : '文件上传失败',
      }
    }
  }

  /**
   * 下载文件
   */
  async download(
    endpoint: string,
    filename?: string,
    options?: RequestOptions
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const url = this.buildUrl(endpoint, options?.params, options?.baseURL)
      const headers = await this.buildHeaders(options)

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        return {
          success: false,
          error: `下载失败: ${response.status}`,
        }
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      return { success: true }
    } catch (error) {
      console.error('文件下载异常:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '文件下载失败',
      }
    }
  }
}

// 导出单例
export const nextauthClient = new NextAuthClientApiClient()

// 便捷方法导出
export const nextauthApi = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    nextauthClient.get<T>(endpoint, options),

  post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    nextauthClient.post<T>(endpoint, data, options),

  put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    nextauthClient.put<T>(endpoint, data, options),

  patch: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    nextauthClient.patch<T>(endpoint, data, options),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    nextauthClient.delete<T>(endpoint, options),

  upload: <T = any>(endpoint: string, formData: FormData, options?: Omit<RequestOptions, 'body' | 'headers'>) =>
    nextauthClient.upload<T>(endpoint, formData, options),

  download: (endpoint: string, filename?: string, options?: RequestOptions) =>
    nextauthClient.download(endpoint, filename, options),
}

export default nextauthClient
