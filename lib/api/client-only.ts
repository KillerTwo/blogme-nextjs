// 客户端专用API工具 - 避免导入服务端代码
export { clientFetch, clientLogin, clientLogout } from './client';
export { 
  getClientAccessToken,
  getClientRefreshToken, 
  setClientTokens,
  clearClientTokens
} from './token-manager';

// 客户端专用的统一API函数
export async function apiFetch<T = any>(path: string, config: any = {}): Promise<T> {
  const { clientFetch } = await import('./client');
  return clientFetch<T>(path, config);
}