import { apiClient } from './client';

// 项目创建人信息接口
export interface ProjectCreator {
  id: number;
  username: string;
  display_name: string;
}

// 项目基础信息接口
export interface ProjectBasicInfo {
  title: string;
  description: string;
  cover_image?: string;
}

// 项目接口
export interface Project {
  id: number;
  name: string;
  project_type: string;
  status: string;
  basic_info_json: ProjectBasicInfo;
  organization_id: number;
  created_by_id: number;
  created_by: ProjectCreator;
  created_at: string;
  chapters: any[];
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
export const getProjects = (params: GetProjectsParams = {}) => {
  // 设置默认参数
  const defaultParams = {
    page: 1,
    size: 20,
    ...params
  };
  
  // 调用API获取项目列表
  return apiClient.get('/api/projects', { params: defaultParams });
};