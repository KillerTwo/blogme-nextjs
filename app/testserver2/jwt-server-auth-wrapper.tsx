'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Loader2 } from 'lucide-react';
import { JWTAuthProvider, useJWTAuth } from '@/lib/auth/jwt-auth-context';
import { jwtApi } from '@/lib/api/jwt-client';
import { getJWTAccessToken } from '@/lib/api/jwt-token-manager';
import { useEffect, useState } from 'react';

function JWTServerAuthContent() {
  const { isAuthenticated, user, loading, login } = useJWTAuth();
  const [apiResult, setApiResult] = useState<any>(null);
  const [authCheck, setAuthCheck] = useState<string>('检查中...');
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 检查认证状态并进行必要的操作
  useEffect(() => {
    const checkAuthAndCallAPI = async () => {
      if (loading) {
        setAuthCheck('正在检查认证状态...');
        return;
      }

      if (!isAuthenticated) {
        setAuthCheck('未登录，尝试自动登录...');
        try {
          // 自动登录
          await login('admin', '123456');
        } catch (err) {
          setError('自动登录失败');
          setAuthCheck('需要手动登录');
          return;
        }
      }

      if (isAuthenticated) {
        setAuthCheck('已认证，调用API...');
        const token = getJWTAccessToken();
        setCurrentToken(token);
        
        try {
          const result = await jwtApi.fetch('/test');
          setApiResult(result);
          setAuthCheck('API调用成功');
        } catch (err) {
          setError('API调用失败');
          setAuthCheck('API调用失败');
        }
      }
    };

    checkAuthAndCallAPI();
  }, [isAuthenticated, loading, login]);

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>正在检查JWT认证状态...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2" />
          客户端包装器 - JWT认证与API调用
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded ${isAuthenticated ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <h5 className={`font-semibold mb-2 ${isAuthenticated ? 'text-green-800' : 'text-yellow-800'}`}>
                认证状态
              </h5>
              <p className={`text-sm ${isAuthenticated ? 'text-green-700' : 'text-yellow-700'}`}>
                {isAuthenticated ? '✓ 已认证' : '⚠️ 未认证'}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h5 className="font-semibold text-blue-800 mb-2">检查状态</h5>
              <p className="text-sm text-blue-700">{authCheck}</p>
            </div>
          </div>

          {user && (
            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-semibold text-gray-800 mb-2">用户信息</h5>
              <pre className="text-xs text-gray-700 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}

          {currentToken && (
            <div className="bg-purple-50 p-4 rounded">
              <h5 className="font-semibold text-purple-800 mb-2">当前Token</h5>
              <p className="text-xs text-purple-700 break-all font-mono">
                {currentToken.substring(0, 100)}...
              </p>
            </div>
          )}

          {apiResult && (
            <div className="bg-green-50 p-4 rounded">
              <h5 className="font-semibold text-green-800 mb-2">API调用结果</h5>
              <pre className="text-xs text-green-700 overflow-auto">
                {JSON.stringify(apiResult, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded">
              <h5 className="font-semibold text-red-800 mb-2">错误信息</h5>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded">
            <h5 className="font-semibold text-blue-800 mb-2">架构说明</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 服务端组件渲染静态内容和布局</li>
              <li>• 客户端包装器处理JWT认证逻辑</li>
              <li>• Context提供全局认证状态管理</li>
              <li>• 自动处理token刷新和API调用</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JWTServerAuthWrapper() {
  return (
    <JWTAuthProvider>
      <JWTServerAuthContent />
    </JWTAuthProvider>
  );
}