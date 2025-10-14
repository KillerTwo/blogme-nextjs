'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getJWTAccessToken, 
  getJWTUser, 
  isJWTAuthenticated,
  clearJWTTokens,
  onJWTAuthChange,
  type JWTUser 
} from '../api/jwt-token-manager';
import { jwtApi } from '../api/jwt-client';

interface JWTAuthContextType {
  isAuthenticated: boolean;
  user: JWTUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const JWTAuthContext = createContext<JWTAuthContextType | undefined>(undefined);

interface JWTAuthProviderProps {
  children: ReactNode;
}

export function JWTAuthProvider({ children }: JWTAuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<JWTUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查认证状态
  const checkAuth = () => {
    const authenticated = isJWTAuthenticated();
    const userData = getJWTUser();
    
    setIsAuthenticated(authenticated);
    setUser(userData);
    setLoading(false);
  };

  // 登录函数
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const result = await jwtApi.login(username, password);
      
      if (result?.access_token) {
        checkAuth(); // 重新检查状态
        return result;
      } else {
        throw new Error('登录失败：无效的响应');
      }
    } catch (error) {
      console.error('登录错误:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      setLoading(true);
      await jwtApi.logout();
    } catch (error) {
      console.error('登出错误:', error);
    } finally {
      clearJWTTokens();
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  // 初始化和监听存储变化
  useEffect(() => {
    // 初始检查
    checkAuth();

    // 监听localStorage变化（多标签页同步）
    const unsubscribe = onJWTAuthChange((authenticated) => {
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        setUser(null);
      } else {
        setUser(getJWTUser());
      }
    });

    return unsubscribe;
  }, []);

  const value: JWTAuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <JWTAuthContext.Provider value={value}>
      {children}
    </JWTAuthContext.Provider>
  );
}

// 自定义Hook
export function useJWTAuth() {
  const context = useContext(JWTAuthContext);
  if (context === undefined) {
    throw new Error('useJWTAuth must be used within a JWTAuthProvider');
  }
  return context;
}

// 高阶组件：需要认证的组件包装器
export function withJWTAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useJWTAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>检查认证状态...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // 客户端重定向到登录页
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <Component {...props} />;
  };
}

// Hook：检查页面是否需要认证（用于服务端组件）
export function useJWTPageAuth() {
  const { isAuthenticated, loading } = useJWTAuth();

  useEffect(() => {
    // 对于JWT方案，检查是否是受保护的路径
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isProtectedPath = currentPath.startsWith('/testserver2'); // JWT保护的路径
      
      if (isProtectedPath && !loading && !isAuthenticated) {
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, loading]);

  return { isAuthenticated, loading };
}