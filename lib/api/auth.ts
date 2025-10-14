// 向后兼容的auth工具 - 重新导出新的token管理器
export {
  setServerTokens as setAuthTokens,
  clearServerTokens as clearAuthTokens,
  getServerAccessToken as getAccessToken,
  getServerRefreshToken as getRefreshToken,
} from './token-manager';
