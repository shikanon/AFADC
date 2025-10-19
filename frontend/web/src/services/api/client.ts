import { message } from '../../components/Common/Message';

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://115.190.79.225:8000';

// 请求配置接口
interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
}

// 响应接口（暂时注释，避免未使用警告）
// interface ApiResponse<T = any> {
//   code: number;
//   data?: T;
//   message: string;
// }

// 错误处理函数
const handleError = (error: any): never => {
  let errorMessage = '请求失败，请稍后重试';

  if (error.response) {
    // 服务器响应了但状态码不在 2xx 范围
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        errorMessage = data.message || '请求参数错误';
        break;
      case 401:
        errorMessage = '登录已过期，请重新登录';
        // 可以在这里处理登录过期逻辑，比如跳转到登录页
        break;
      case 403:
        errorMessage = '没有权限访问该资源';
        break;
      case 404:
        errorMessage = '请求的资源不存在';
        break;
      case 500:
        errorMessage = '服务器内部错误';
        break;
      default:
        errorMessage = data.message || `请求失败: ${status}`;
    }
  } else if (error.request) {
    // 请求已发出但没有收到响应
    errorMessage = '网络错误，请检查您的网络连接';
  } else {
    // 设置请求时发生了错误
    errorMessage = error.message;
  }

  // 显示错误消息
  message.error(errorMessage);
  throw error;
};

// 构建URL，处理查询参数
const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  const baseUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return `${baseUrl}?${searchParams.toString()}`;
};

// 请求超时处理
const timeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`请求超时: ${ms}ms`)), ms);
  });
};

// HTTP请求客户端
class ApiClient {
  // 获取认证token
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // 通用请求方法
  async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      params,
      timeout = 30000,
      ...restConfig
    } = config;

    // 构建请求头
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    // 如果有认证token，添加到请求头
    const token = this.getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 构建请求配置
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      ...restConfig,
    };

    try {
      // 使用Promise.race实现请求超时
      const response = await Promise.race([
        fetch(buildUrl(endpoint, params), requestConfig),
        timeoutPromise(timeout),
      ]);

      const data = await response.json();

      // 检查响应状态
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data,
          },
        };
      }

      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  // GET请求
  get<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  // POST请求
  post<T = any>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // 表单提交请求 (application/x-www-form-urlencoded)
  postForm<T = any>(endpoint: string, data: Record<string, any>, config: RequestConfig = {}): Promise<T> {
    // 构建URLSearchParams
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      headers: {
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  // PUT请求
  put<T = any>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE请求
  delete<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// 导出API客户端实例
export const apiClient = new ApiClient();

// 导出常用方法
export const { get, post, postForm, put, delete: del } = apiClient;