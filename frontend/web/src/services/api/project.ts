import { apiClient } from './client';

// 项目创建人信息接口
export interface ProjectCreator {
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

// 项目接口
export interface Project {
  id: number;
  name: string;
  project_type: string;
  status: string;
  description: string;
  prompt: string;
  cover_image: string;
  video_scale: string;
  video_resolution: string;
  organization_id: number;
  created_by_id: number;
  created_at: string;
  created_by: ProjectCreator;
}

// 获取项目列表参数接口
export interface GetProjectsParams {
  page?: number;
  size?: number;
  search?: string;
}

/**
 * 获取项目列表
 * @param params 查询参数，包含页码、每页数量和搜索关键词
 * @returns 项目列表数据
 */
export const getProjects = async (params: GetProjectsParams = {}) => {
  // 设置默认参数
  const defaultParams = {
    page: 1,
    size: 10, // 与curl命令中的size保持一致
    ...params
  };
  
  // 打印请求日志
  console.log('请求项目列表:', {
    url: '/api/projects',
    params: defaultParams
  });
  
  try {
    // 调用API获取项目列表
    const response = await apiClient.get<Project[]>('/api/projects', { params: defaultParams });
    
    // 打印响应日志
    console.log('项目列表请求成功，返回数据条数:', response.length);
    
    return response;
  } catch (error) {
    // 打印错误日志
    console.error('获取项目列表失败:', error);
    throw error;
  }
};