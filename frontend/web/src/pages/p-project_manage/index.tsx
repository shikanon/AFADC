

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import { SearchToolbar, ConfirmDialog } from '../../components/Common';

interface Project {
  id: string;
  name: string;
  type: 'static' | 'dynamic';
  status: 'draft' | 'progress' | 'completed' | 'failed';
  creator: string;
  createTime: string;
  thumbnail: string;
  projectId: string;
}

const ProjectManagePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 确认对话框状态
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState({
    title: '',
    message: '',
    confirmText: '确认',
    cancelText: '取消',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // 项目数据
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: '魔法学院的秘密',
      type: 'static',
      status: 'completed',
      creator: '张设计师',
      createTime: '2024-01-15 14:30',
      thumbnail: 'https://s.coze.cn/image/Hv-VXqfCFwc/',
      projectId: 'PROJ-001'
    },
    {
      id: '2',
      name: '未来都市传奇',
      type: 'dynamic',
      status: 'progress',
      creator: '李动画师',
      createTime: '2024-01-14 09:15',
      thumbnail: 'https://s.coze.cn/image/s014HsJnqq8/',
      projectId: 'PROJ-002'
    },
    {
      id: '3',
      name: '海底探险记',
      type: 'static',
      status: 'draft',
      creator: '王编剧',
      createTime: '2024-01-13 16:45',
      thumbnail: 'https://s.coze.cn/image/Axzc7d5lVJc/',
      projectId: 'PROJ-003'
    },
    {
      id: '4',
      name: '校园青春物语',
      type: 'dynamic',
      status: 'failed',
      creator: '陈策划',
      createTime: '2024-01-12 11:20',
      thumbnail: 'https://s.coze.cn/image/fHm2Nv1IRC0/',
      projectId: 'PROJ-004'
    },
    {
      id: '5',
      name: '星际旅行日记',
      type: 'static',
      status: 'progress',
      creator: '刘导演',
      createTime: '2024-01-11 13:50',
      thumbnail: 'https://s.coze.cn/image/n-x2CArILeY/',
      projectId: 'PROJ-005'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '项目管理 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

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
  const filteredProjects = projects.filter(project => {
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
  const handleBatchDelete = () => {
    if (selectedProjectIds.length > 0) {
      handleDeleteWithConfirm();
    }
  };

  // 删除单个项目
  const handleDeleteProject = (projectId: string) => {
    setSelectedProjectIds([projectId]);
    handleDeleteWithConfirm();
  };

  // 显示确认对话框
  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
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
  const handleConfirmDelete = () => {
    console.log('删除项目:', selectedProjectIds);
    setSelectedProjectIds([]);
  };

  // 使用ConfirmDialog的删除处理
  const handleDeleteWithConfirm = () => {
    if (selectedProjectIds.length === 0) return;
    
    const message = selectedProjectIds.length === 1 
      ? '确定要删除这个项目吗？' 
      : `确定要删除选中的${selectedProjectIds.length}个项目吗？`;
    
    showConfirmDialog('删除确认', message, handleConfirmDelete);
  };

  // 项目操作处理
  const handleProjectAction = (project: Project, action: string) => {
    const { id, type } = project;
    const path = type === 'static' ? '/static-create-step1' : '/dynamic-create-step1';
    
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

  // 新建项目
  const handleCreateProject = (type: 'static' | 'dynamic') => {
    const path = type === 'static' ? '/static-create-step1' : '/dynamic-create-step1';
    navigate(path);
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 获取状态徽章样式
  const getStatusBadgeClass = (status: string) => {
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
  const getTypeBadgeClass = (type: string) => {
    const baseClass = styles.typeBadge;
    return type === 'static' ? `${baseClass} ${styles.typeStatic}` : `${baseClass} ${styles.typeDynamic}`;
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'progress': return '进行中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return status;
    }
  };

  // 获取类型文本
  const getTypeText = (type: string) => {
    return type === 'static' ? '静态漫' : '动态漫';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用Header组件 */}
      <Header 
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
                  onClick={() => handleCreateProject('static')}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  新建静态漫
                </button>
                <button 
                  onClick={() => handleCreateProject('dynamic')}
                  className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                >
                  新建动态漫
                </button>
              </div>
            }
          />

          {/* 工具栏 - 使用SearchToolbar组件 */}
          <SearchToolbar
            searchValue={projectSearchTerm}
            onSearchChange={setProjectSearchTerm}
            searchPlaceholder="搜索剧本名称、ID..."
            filters={[
              {
                value: typeFilter,
                onChange: setTypeFilter,
                options: [
                  { value: '', label: '全部类型' },
                  { value: 'static', label: '静态漫' },
                  { value: 'dynamic', label: '动态漫' }
                ]
              },
              {
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: '', label: '全部状态' },
                  { value: 'draft', label: '草稿' },
                  { value: 'progress', label: '进行中' },
                  { value: 'completed', label: '已完成' },
                  { value: 'failed', label: '失败' }
                ]
              }
            ]}
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
                  {filteredProjects.map((project) => (
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

          {/* 分页 */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-text-secondary">
              共 <span className="font-medium text-text-primary">25</span> 个项目，每页显示
              <select 
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
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
              <button 
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === 1 ? 'bg-primary text-white' : 'border border-border-light hover:bg-bg-secondary transition-colors'
                }`}
              >
                1
              </button>
              <button 
                onClick={() => handlePageChange(2)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === 2 ? 'bg-primary text-white' : 'border border-border-light hover:bg-bg-secondary transition-colors'
                }`}
              >
                2
              </button>
              <button 
                onClick={() => handlePageChange(3)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === 3 ? 'bg-primary text-white' : 'border border-border-light hover:bg-bg-secondary transition-colors'
                }`}
              >
                3
              </button>
              <span className="px-2 text-text-secondary">...</span>
              <button 
                onClick={() => handlePageChange(5)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === 5 ? 'bg-primary text-white' : 'border border-border-light hover:bg-bg-secondary transition-colors'
                }`}
              >
                5
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
};

export default ProjectManagePage;

