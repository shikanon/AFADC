import { apiClient } from './client';

// 用户信息接口
export interface User {
  id: number;
  username: string;
  display_name: string;
  email: string;
  phone: string | null;
  role: string;
  organization_id: number;
  is_active: boolean;
  created_at: string;
}

// 登录响应接口
export interface LoginResponse {
  token: string;
  user: User;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 注册响应接口（与登录响应相同）
export type RegisterResponse = LoginResponse;

// 注册请求参数
export interface RegisterParams {
  email: string;
  password: string;
  organization_name: string;
  display_name?: string;
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应，包含token和用户信息
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  try {
    return await apiClient.postForm<LoginResponse>('/api/auth/login', params);
  } catch (error) {
    // 可以在这里添加额外的错误处理逻辑
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * 用户登出
 * 清除本地存储的token
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
};

/**
 * 用户注册
 * 创建新的组织和管理员账号
 * @param params 注册参数
 * @returns 注册响应，包含token和用户信息
 */
export const register = async (params: RegisterParams): Promise<RegisterResponse> => {
  try {
    return await apiClient.post<RegisterResponse>('/api/auth/register', params);
  } catch (error) {
    // 可以在这里添加额外的错误处理逻辑
    console.error('Register failed:', error);
    throw error;
  }
};

/**
 * 保存登录状态到本地存储
 * @param token 认证token
 * @param user 用户信息
 */
export const saveAuthState = (token: string, user: User): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_info', JSON.stringify(user));
};

/**
 * 从本地存储获取用户信息
 * @returns 用户信息，如果不存在则返回null
 */
export const getUserInfoFromStorage = (): User | null => {
  const userInfoStr = localStorage.getItem('user_info');
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('Failed to parse user info:', error);
    return null;
  }
};

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};