

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import { SearchToolbar, ConfirmDialog } from '../../components/Common';
import * as api from '../../services/api';
import StaticCreateDialog, { FormData as StaticFormData } from './StaticCreateDialog';

// 使用API定义的项目类型，并进行适配
import type { Project as ApiProject, GetProjectsParams } from '../../services/api/project';

// 页面使用的项目类型接口
interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  creator: string;
  createTime: string;
  thumbnail: string;
  projectId: string;
}

// 定义确认对话框配置类型
interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ProjectManagePage() {
  // 使用数组解构简化React.useState调用
  var useState = React.useState;
  
  // 基础状态
  var projectsState = useState<Project[]>([]);
  var projects = projectsState[0];
  var setProjects = projectsState[1];
  
  var currentPageState = useState<number>(1);
  var currentPage = currentPageState[0];
  var setCurrentPage = currentPageState[1];
  
  var pageSizeState = useState<number>(10);
  var pageSize = pageSizeState[0];
  var setPageSize = pageSizeState[1];
  
  var projectSearchTermState = useState<string>('');
  var projectSearchTerm = projectSearchTermState[0];
  var setProjectSearchTerm = projectSearchTermState[1];
  
  var isSidebarCollapsedState = useState<boolean>(false);
  var isSidebarCollapsed = isSidebarCollapsedState[0];
  var setIsSidebarCollapsed = isSidebarCollapsedState[1];
  
  var selectedProjectIdsState = useState<string[]>([]);
  var selectedProjectIds = selectedProjectIdsState[0];
  var setSelectedProjectIds = selectedProjectIdsState[1];
  
  // 加载状态和错误处理
  var isLoadingState = useState<boolean>(false);
  var isLoading = isLoadingState[0];
  var setIsLoading = isLoadingState[1];
  
  var errorMessageState = useState<string | null>(null);
  var errorMessage = errorMessageState[0];
  var setErrorMessage = errorMessageState[1];
  
  // 确认对话框状态
  var isConfirmDialogVisibleState = useState<boolean>(false);
  var isConfirmDialogVisible = isConfirmDialogVisibleState[0];
  var setIsConfirmDialogVisible = isConfirmDialogVisibleState[1];
  
  var confirmDialogConfigState = useState<ConfirmDialogConfig>({
    title: '',
    message: '',
    confirmText: '确认',
    cancelText: '取消',
    onConfirm: function() {},
    onCancel: function() {}
  });
  var confirmDialogConfig = confirmDialogConfigState[0];
  var setConfirmDialogConfig = confirmDialogConfigState[1];
  
  // API返回的总项目数
  var totalProjectsState = useState<number>(0);
  var totalProjects = totalProjectsState[0];
  var setTotalProjects = totalProjectsState[1];
  
  // 项目类型转换函数：将API项目转换为页面项目格式
  const convertApiProjectToPageProject = (apiProject: ApiProject): Project => {
    return {
      id: String(apiProject.id),
      name: apiProject.name,
      type: apiProject.project_type || 'static_comic',
      status: apiProject.status,
      creator: apiProject.created_by?.display_name || apiProject.created_by?.username || '未知用户',
      createTime: apiProject.created_at,
      thumbnail: apiProject.cover_image || '', // 直接使用cover_image字段，不再从basic_info_json中获取
      projectId: `PROJ-${String(apiProject.id).padStart(3, '0')}`
    };
  };
  
  // 获取项目列表的函数
  const fetchProjects = async (page: number = 1, searchTerm: string = '') => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const params: GetProjectsParams = {
        page,
        size: pageSize,
        search: searchTerm
      };
      
      // 由于可能存在API调用问题，先添加错误捕获并保留兜底数据
      const response = await api.getProjects(params);
      
      // 检查响应格式 - API现在直接返回项目数组
      if (Array.isArray(response)) {
        const convertedProjects = response.map(convertApiProjectToPageProject);
        setProjects(convertedProjects);
        setTotalProjects(convertedProjects.length); // 直接使用数组长度作为总数
      } else {
        // API响应格式不正确，使用空数组
        console.warn('API返回格式不正确，预期为数组');
        setProjects([]);
        setTotalProjects(0);
      }
    } catch (err) {
      console.error('获取项目列表失败:', err);
      setErrorMessage('获取项目列表失败，请稍后重试');
      // 出错时使用空数组，避免页面崩溃
      setProjects([]);
      setTotalProjects(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 使用react-router-dom的useNavigate hook实现导航
  var isLoggedIn: boolean = true;
  const navigate = useNavigate();
  
  // 未使用的过滤变量，避免编译警告
  var typeFilter: string = '';
  var statusFilter: string = '';
  
  // 初始化时获取项目数据
  React.useEffect(function() {
    // 设置页面标题
    var originalTitle = document.title;
    document.title = '项目管理 - AI漫剧速成工场';
    
    // 调用API获取项目列表
    fetchProjects();
    
    // 组件卸载时恢复原标题
    return function() {
      document.title = originalTitle;
    };
  }, []);
  
  // 监听搜索条件变化
  React.useEffect(function() {
    // 使用防抖处理搜索
    const timerId = setTimeout(() => {
      fetchProjects(1, projectSearchTerm);
      setCurrentPage(1); // 搜索时重置到第一页
    }, 300);
    
    return function() {
      clearTimeout(timerId);
    };
  }, [projectSearchTerm, pageSize]);
  
  // 监听分页变化
  React.useEffect(function() {
    fetchProjects(currentPage, projectSearchTerm);
  }, [currentPage, pageSize, projectSearchTerm]);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024 && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  // 筛选项目
  const filteredProjects: Project[] = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                         project.projectId.toLowerCase().includes(projectSearchTerm.toLowerCase());
    const matchesType = !typeFilter || project.type === typeFilter;
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjectIds(filteredProjects.map(project => project.id));
    } else {
      setSelectedProjectIds([]);
    }
  };

  // 选择单个项目
  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjectIds(prev => [...prev, projectId]);
    } else {
      setSelectedProjectIds(prev => prev.filter(id => id !== projectId));
    }
  };

  // 批量删除
  const handleBatchDelete = (): void => {
    if (selectedProjectIds.length > 0) {
      handleDeleteWithConfirm();
    }
  };

  // 删除单个项目
  const handleDeleteProject = (projectId: string): void => {
    setSelectedProjectIds([projectId]);
    handleDeleteWithConfirm();
  };

  // 显示确认对话框
  const showConfirmDialog = (title: string, message: string, onConfirm: () => void): void => {
    setConfirmDialogConfig({
      title,
      message,
      confirmText: '确认删除',
      cancelText: '取消',
      onConfirm: () => {
        onConfirm();
        setIsConfirmDialogVisible(false);
      },
      onCancel: () => {
        setIsConfirmDialogVisible(false);
        setSelectedProjectIds([]);
      }
    });
    setIsConfirmDialogVisible(true);
  };

  // 确认删除
  const handleConfirmDelete = (): void => {
    console.log('删除项目:', selectedProjectIds);
    setSelectedProjectIds([]);
  };

  // 使用ConfirmDialog的删除处理
  const handleDeleteWithConfirm = (): void => {
    if (selectedProjectIds.length === 0) return;
    
    const message = selectedProjectIds.length === 1 
      ? '确定要删除这个项目吗？' 
      : `确定要删除选中的${selectedProjectIds.length}个项目吗？`;
    
    showConfirmDialog('删除确认', message, handleConfirmDelete);
  };

  // 项目操作处理
  const handleProjectAction = (project: Project, action: string): void => {
    const { id, type } = project;
    const path = type === 'static_comic' ? '/static-create-step1' : '/dynamic-create-step1';
    
    switch (action) {
      case 'edit':
      case 'continue':
      case 'regenerate':
      case 'view':
        navigate(`${path}?projectId=${id}`);
        break;
      case 'delete':
        handleDeleteProject(id);
        break;
    }
  };

  // 静态漫创建弹窗状态
  var isStaticDialogVisibleState = useState<boolean>(false);
  var isStaticDialogVisible = isStaticDialogVisibleState[0];
  var setIsStaticDialogVisible = isStaticDialogVisibleState[1];
  
  // 新建项目
  const handleCreateProject = (type: 'static_comic' | 'dynamic_comic'): void => {
    if (type === 'static_comic') {
      // 打开静态漫创建弹窗
      setIsStaticDialogVisible(true);
    } else {
      // 动态漫仍使用原来的导航逻辑
      navigate('/dynamic-create-step1');
    }
  };
  
  // 处理静态漫表单提交
  const handleStaticFormSubmit = (formData: StaticFormData) => {
    // 生成项目ID
    const generateProjectId = (): string => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `PROJ-${timestamp}-${random}`;
    };
    
    const projectId = generateProjectId();
    const projectData = {
      projectId,
      ...formData,
      step: 1,
      type: 'static_comic'
    };
    
    // 保存到localStorage并导航到下一步
    localStorage.setItem('currentProject', JSON.stringify(projectData));
    navigate(`/static-create-step2?projectId=${projectId}`);
  };
  
  // 关闭静态漫创建弹窗
  const handleStaticDialogClose = () => {
    setIsStaticDialogVisible(false);
  };

  // 分页处理
  const handlePageChange = (page: number): void => {
    if (page < 1 || (page > 1 && projects.length === 0)) return;
    setCurrentPage(page);
  };
  
  // 页面大小变化处理
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // 重置到第一页
  };

  // 获取状态徽章样式
  const getStatusBadgeClass = (status: string): string => {
    const baseClass = styles.statusBadge;
    switch (status) {
      case 'draft':
        return `${baseClass} ${styles.statusDraft}`;
      case 'progress':
        return `${baseClass} ${styles.statusProgress}`;
      case 'completed':
        return `${baseClass} ${styles.statusCompleted}`;
      case 'failed':
        return `${baseClass} ${styles.statusFailed}`;
      default:
        return baseClass;
    }
  };

  // 获取类型徽章样式
  const getTypeBadgeClass = (type: string): string => {
    const baseClass = styles.typeBadge;
    return type === 'static_comic' ? `${baseClass} ${styles.typeStatic}` : `${baseClass} ${styles.typeDynamic}`;
  };

  // 获取状态文本
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'draft': return '草稿';
      case 'progress': return '进行中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return status;
    }
  };

  // 获取类型文本
  const getTypeText = (type: string): string => {
    return type === 'static_comic' ? '静态漫' : '动态漫';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用Header组件 */}
      <Header 
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        searchPlaceholder="搜索项目、资产..."
      />

      {/* 左侧菜单 - 使用Sidebar组件 */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        currentPath="/project-manage"
      />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            title="项目管理"
            breadcrumbs={[
              { label: '首页', path: '/' },
              { label: '项目管理', path: '/project-manage' }
            ]}
            actions={
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleCreateProject('static_comic')}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  新建静态漫
                </button>
                <button 
                  onClick={() => handleCreateProject('dynamic_comic')}
                  className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                >
                  新建动态漫
                </button>
              </div>
            }
          />

          {/* 工具栏 - 使用SearchToolbar组件 */}
          <SearchToolbar
            searchTerm={projectSearchTerm}
            onSearchChange={setProjectSearchTerm}
            searchPlaceholder="搜索剧本名称、ID..."
            actions={
              <button 
                onClick={handleBatchDelete}
                disabled={selectedProjectIds.length === 0}
                className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                批量删除
              </button>
            }
          />

          {/* 项目列表 */}
          <div className="bg-white rounded-lg border border-border-light overflow-hidden">
            <div className="overflow-x-auto">

          {/* 确认对话框 */}
          <ConfirmDialog
            isVisible={isConfirmDialogVisible}
            title={confirmDialogConfig.title}
            message={confirmDialogConfig.message}
            confirmText={confirmDialogConfig.confirmText}
            cancelText={confirmDialogConfig.cancelText}
            onConfirm={confirmDialogConfig.onConfirm}
            onCancel={confirmDialogConfig.onCancel}
          />
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedProjectIds.length === filteredProjects.length && filteredProjects.length > 0}
                        ref={(input) => {
                          if (input) input.indeterminate = selectedProjectIds.length > 0 && selectedProjectIds.length < filteredProjects.length;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-border-medium"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">剧本名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">创建人</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">创建时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project: Project) => (
                    <tr key={project.id} className={`border-t border-border-light ${styles.tableRowHover}`}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedProjectIds.includes(project.id)}
                          onChange={(e) => handleSelectProject(project.id, e.target.checked)}
                          className="rounded border-border-medium"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={project.thumbnail} 
                            alt={`${project.name}项目缩略图`} 
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div 
                              className="font-medium text-text-primary cursor-pointer hover:text-primary"
                              onClick={() => handleProjectAction(project, 'edit')}
                            >
                              {project.name}
                            </div>
                            <div className="text-sm text-text-secondary">ID: {project.projectId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={getTypeBadgeClass(project.type)}>
                          {getTypeText(project.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadgeClass(project.status)}>
                          {getStatusText(project.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-primary">{project.creator}</td>
                      <td className="px-4 py-3 text-text-secondary">{project.createTime}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {(project.status === 'draft' || project.status === 'completed') && (
                            <button 
                              onClick={() => handleProjectAction(project, 'edit')}
                              className="text-primary hover:text-blue-600 text-sm" 
                              title="编辑"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {project.status === 'progress' && (
                            <button 
                              onClick={() => handleProjectAction(project, 'continue')}
                              className="text-primary hover:text-blue-600 text-sm" 
                              title="继续制作"
                            >
                              <i className="fas fa-play"></i>
                            </button>
                          )}
                          {project.status === 'failed' && (
                            <button 
                              onClick={() => handleProjectAction(project, 'regenerate')}
                              className="text-warning hover:text-yellow-600 text-sm" 
                              title="重新生成"
                            >
                              <i className="fas fa-redo"></i>
                            </button>
                          )}
                          <button 
                            onClick={() => handleProjectAction(project, 'view')}
                            className="text-text-secondary hover:text-text-primary text-sm" 
                            title="查看详情"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            onClick={() => handleProjectAction(project, 'delete')}
                            className="text-danger hover:text-red-600 text-sm" 
                            title="删除"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 加载状态 */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {/* 错误提示 */}
          {errorMessage && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
              {errorMessage}
            </div>
          )}
          
          {/* 无数据提示 */}
          {!isLoading && projects.length === 0 && !errorMessage && (
            <div className="text-center py-10 text-text-secondary">
              {projectSearchTerm ? '没有找到匹配的项目' : '暂无项目数据'}
            </div>
          )}
          
          {/* 分页 */}
          {!isLoading && projects.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-text-secondary">
                共 <span className="font-medium text-text-primary">{totalProjects}</span> 个项目，每页显示
                <select 
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="mx-2 border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select> 个
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {/* 简化分页按钮，显示前3页和最后一页 */}
                {[1, 2, 3, Math.ceil(totalProjects / pageSize)].filter((page, index, self) => 
                  page >= 1 && page <= Math.ceil(totalProjects / pageSize) && self.indexOf(page) === index
                ).map(function(page) {
                  return (
                    <button 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? 'px-3 py-1 rounded text-sm bg-primary text-white' : 'px-3 py-1 rounded text-sm border border-border-light hover:bg-bg-secondary transition-colors'}
                    >
                      {page}
                    </button>
                  );
                })}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={projects.length < pageSize}
                  className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors disabled:opacity-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* 静态漫创建弹窗 */}
      <StaticCreateDialog 
        isOpen={isStaticDialogVisible}
        onClose={handleStaticDialogClose}
        onConfirm={handleStaticFormSubmit}
      />
    </div>
  );
}

export default ProjectManagePage;

