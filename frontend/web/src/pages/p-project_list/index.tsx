

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import { Project, Workspace } from './types';

const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [currentDeleteProjectId, setCurrentDeleteProjectId] = useState<string | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectTypeFilter, setProjectTypeFilter] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('');
  const [projectSort, setProjectSort] = useState('created_desc');
  const [workspaceInfo, setWorkspaceInfo] = useState<Workspace>({
    id: 'ws_001',
    name: '我的工作空间',
    projects: 5,
    members: 3
  });

  // 项目数据
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj_001',
      name: '樱花之恋',
      type: 'static',
      status: 'completed',
      description: '一个关于青春校园的浪漫故事，樱花飞舞的季节里，两个年轻人的相遇...',
      createTime: '2024-01-15',
      duration: '3分钟',
      thumbnail: 'https://s.coze.cn/image/lDOfhRgRd-c/'
    },
    {
      id: 'proj_002',
      name: '星际冒险',
      type: 'dynamic',
      status: 'progress',
      description: '未来科幻题材，人类与外星文明的第一次接触，充满未知与挑战...',
      createTime: '2024-01-12',
      duration: '5分钟',
      thumbnail: 'https://s.coze.cn/image/B_nr_FeBMBM/'
    },
    {
      id: 'proj_003',
      name: '魔法学院',
      type: 'static',
      status: 'draft',
      description: '奇幻魔法世界，年轻的魔法师们在学院中的成长与冒险故事...',
      createTime: '2024-01-10',
      duration: '8分钟',
      thumbnail: 'https://s.coze.cn/image/Vjj2Bs_z3ZA/'
    },
    {
      id: 'proj_004',
      name: '都市传说',
      type: 'dynamic',
      status: 'completed',
      description: '现代都市背景下的神秘故事，探索城市中隐藏的传说与秘密...',
      createTime: '2024-01-08',
      duration: '4分钟',
      thumbnail: 'https://s.coze.cn/image/7ZHLKHrYezU/'
    },
    {
      id: 'proj_005',
      name: '海底世界',
      type: 'static',
      status: 'progress',
      description: '美丽的海底王国，海洋生物们的生活与冒险，环保主题的温馨故事...',
      createTime: '2024-01-05',
      duration: '6分钟',
      thumbnail: 'https://s.coze.cn/image/AnzmqXl2fIE/'
    }
  ]);

  // 表单状态
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState('static');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '项目管理 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  // 加载工作空间信息
  useEffect(() => {
    const workspaceId = searchParams.get('workspace_id');
    if (workspaceId) {
      loadWorkspaceInfo(workspaceId);
    }
  }, [searchParams]);

  const loadWorkspaceInfo = (workspaceId: string) => {
    const mockWorkspaces: Record<string, Workspace> = {
      'ws_001': { id: 'ws_001', name: '我的工作空间', projects: 5, members: 3 },
      'ws_002': { id: 'ws_002', name: '团队协作空间', projects: 8, members: 6 },
      'ws_003': { id: 'ws_003', name: '个人创作空间', projects: 3, members: 1 }
    };
    
    const workspace = mockWorkspaces[workspaceId] || mockWorkspaces['ws_001'];
    setWorkspaceInfo(workspace);
  };

  // 筛选和搜索逻辑
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(projectSearchTerm.toLowerCase());
    const matchesType = !projectTypeFilter || project.type === projectTypeFilter;
    const matchesStatus = !projectStatusFilter || project.status === projectStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 排序逻辑
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (projectSort) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'created_asc':
        return a.createTime.localeCompare(b.createTime);
      case 'created_desc':
        return b.createTime.localeCompare(a.createTime);
      default:
        return 0;
    }
  });

  // 事件处理函数
  const handleOpenCreateModal = () => {
    setShowCreateProjectModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseCreateModal = () => {
    setShowCreateProjectModal(false);
    document.body.style.overflow = 'auto';
    setNewProjectName('');
    setNewProjectType('static');
  };

  const handleOpenDeleteModal = (projectId: string) => {
    setCurrentDeleteProjectId(projectId);
    setShowDeleteConfirmModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirmModal(false);
    document.body.style.overflow = 'auto';
    setCurrentDeleteProjectId(null);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      console.log('创建项目:', { name: newProjectName, type: newProjectType });
      alert('项目创建成功！');
      
      const newProjectId = 'proj_' + Date.now();
      navigate(`/script-info?project_id=${newProjectId}`);
    }
  };

  const handleDeleteProject = () => {
    if (currentDeleteProjectId) {
      console.log('删除项目:', currentDeleteProjectId);
      setProjects(prev => prev.filter(project => project.id !== currentDeleteProjectId));
      handleCloseDeleteModal();
      alert('项目删除成功！');
    }
  };

  const handleProjectCardClick = (projectId: string) => {
    navigate(`/script-info?project_id=${projectId}`);
  };

  const handleEditProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    navigate(`/script-info?project_id=${projectId}`);
  };

  const handlePreviewProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    navigate(`/video-export?project_id=${projectId}&mode=preview`);
  };

  const handleDeleteProjectClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    handleOpenDeleteModal(projectId);
  };

  const handleSwitchWorkspace = () => {
    navigate('/workspace-list');
  };

  const handleWorkspaceSettings = () => {
    const workspaceId = searchParams.get('workspace_id') || 'ws_001';
    navigate(`/workspace-detail?workspace_id=${workspaceId}`);
  };

  const handleProjectNavigation = (path: string) => {
    alert('请先选择一个项目');
  };

  // 辅助函数
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'progress':
        return 'bg-warning/10 text-warning';
      case 'draft':
        return 'bg-info/10 text-info';
      default:
        return 'bg-info/10 text-info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'progress':
        return '进行中';
      case 'draft':
        return '草稿';
      default:
        return '草稿';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    return type === 'static' ? 'bg-primary/10' : 'bg-secondary/10';
  };

  const getTypeText = (type: string) => {
    return type === 'static' ? 'AI静态漫' : 'AI动态漫';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和产品名称 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-magic text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-text-primary">AI漫剧快造</h1>
          </div>
          
          {/* 全局搜索 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
              <input 
                type="text" 
                placeholder="搜索项目、工作空间..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            <button className="relative p-2 text-text-secondary hover:text-primary">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-light">
                <img 
                  src="https://s.coze.cn/image/iTuCeRGXxUc/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full" 
                />
                <span className="text-sm text-text-primary">张小明</span>
                <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-border-light z-40 ${styles.sidebarTransition}`}>
        <nav className="p-4 space-y-2">
          {/* 工作空间 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">工作空间</h3>
            <div className="space-y-1">
              <Link 
                to="/workspace-list" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-layer-group w-4"></i>
                <span>工作空间管理</span>
              </Link>
            </div>
          </div>
          
          {/* 项目管理 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">项目管理</h3>
            <div className="space-y-1">
              <Link 
                to="/project-list" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}
              >
                <i className="fas fa-folder w-4"></i>
                <span>项目列表</span>
              </Link>
            </div>
          </div>
          
          {/* 制作流程 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">制作流程</h3>
            <div className="space-y-1">
              <button 
                onClick={() => handleProjectNavigation('/script-info')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm w-full text-left ${styles.navItemHover}`}
              >
                <i className="fas fa-file-alt w-4"></i>
                <span>剧本信息</span>
              </button>
              <button 
                onClick={() => handleProjectNavigation('/character-generation')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm w-full text-left ${styles.navItemHover}`}
              >
                <i className="fas fa-user-friends w-4"></i>
                <span>角色IP形象</span>
              </button>
              <button 
                onClick={() => handleProjectNavigation('/voice-selection')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm w-full text-left ${styles.navItemHover}`}
              >
                <i className="fas fa-microphone w-4"></i>
                <span>音色选择</span>
              </button>
              <button 
                onClick={() => handleProjectNavigation('/scenario-editor')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm w-full text-left ${styles.navItemHover}`}
              >
                <i className="fas fa-film w-4"></i>
                <span>分镜脚本</span>
              </button>
              <button 
                onClick={() => handleProjectNavigation('/image-generation')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm w-full text-left ${styles.navItemHover}`}
              >
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </button>
              <button 
                onClick={() => handleProjectNavigation('/video-generation')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm w-full text-left ${styles.navItemHover}`}
              >
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </button>
              <button 
                onClick={() => handleProjectNavigation('/video-export')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm w-full text-left ${styles.navItemHover}`}
              >
                <i className="fas fa-download w-4"></i>
                <span>视频导出</span>
              </button>
            </div>
          </div>
          
          {/* 素材库 */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">素材库</h3>
            <div className="space-y-1">
              <Link 
                to="/material-library" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-palette w-4"></i>
                <span>素材库管理</span>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="ml-60 mt-16 p-6 min-h-screen">
        {/* 页面头部 */}
        <div className="mb-6">
          {/* 面包屑导航 */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-text-secondary">
              <li>
                <Link to="/workspace-list" className="hover:text-primary">首页</Link>
              </li>
              <li><i className="fas fa-chevron-right text-xs"></i></li>
              <li><span className="text-text-primary">{workspaceInfo.name}</span></li>
              <li><i className="fas fa-chevron-right text-xs"></i></li>
              <li><span className="text-text-primary">项目管理</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">项目管理</h1>
              <p className="text-text-secondary">管理和创建您的AI漫剧项目</p>
            </div>
            <button 
              onClick={handleOpenCreateModal}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>新建项目
            </button>
          </div>
        </div>

        {/* 工作空间信息栏 */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-layer-group text-white"></i>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">{workspaceInfo.name}</h3>
                <p className="text-sm text-text-secondary">{workspaceInfo.projects}个项目 · {workspaceInfo.members}名成员</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSwitchWorkspace}
                className="text-text-secondary hover:text-primary"
              >
                <i className="fas fa-exchange-alt mr-1"></i>切换工作空间
              </button>
              <button 
                onClick={handleWorkspaceSettings}
                className="text-text-secondary hover:text-primary"
              >
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <input 
                  type="text" 
                  placeholder="搜索项目名称..." 
                  value={projectSearchTerm}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                />
              </div>
            </div>
            
            {/* 筛选和排序 */}
            <div className="flex items-center space-x-3">
              <select 
                value={projectTypeFilter}
                onChange={(e) => setProjectTypeFilter(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm"
              >
                <option value="">所有类型</option>
                <option value="static">AI静态漫</option>
                <option value="dynamic">AI动态漫</option>
              </select>
              
              <select 
                value={projectStatusFilter}
                onChange={(e) => setProjectStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm"
              >
                <option value="">所有状态</option>
                <option value="draft">草稿</option>
                <option value="progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
              
              <select 
                value={projectSort}
                onChange={(e) => setProjectSort(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm"
              >
                <option value="created_desc">创建时间 ↓</option>
                <option value="created_asc">创建时间 ↑</option>
                <option value="name_asc">名称 A-Z</option>
                <option value="name_desc">名称 Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* 项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => handleProjectCardClick(project.id)}
              className={`bg-white rounded-xl shadow-card cursor-pointer ${styles.projectCardHover}`}
            >
              <div className="relative">
                <img 
                  src={project.thumbnail} 
                  alt={`${project.name}项目预览图`} 
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-primary">{project.name}</h3>
                  <span className={`text-xs text-text-secondary px-2 py-1 rounded-full ${getTypeBadgeClass(project.type)}`}>
                    {getTypeText(project.type)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                  <span><i className="fas fa-calendar mr-1"></i>{project.createTime}</span>
                  <span><i className="fas fa-clock mr-1"></i>{project.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => handleEditProject(e, project.id)}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      <i className="fas fa-edit mr-1"></i>编辑
                    </button>
                    <button 
                      onClick={(e) => handlePreviewProject(e, project.id)}
                      className="text-text-secondary hover:text-primary text-sm"
                    >
                      <i className="fas fa-eye mr-1"></i>预览
                    </button>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteProjectClick(e, project.id)}
                    className="text-text-secondary hover:text-danger text-sm"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 新建项目卡片 */}
          <div 
            onClick={handleOpenCreateModal}
            className="border-2 border-dashed border-border-light rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-plus text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">创建新项目</h3>
            <p className="text-sm text-text-secondary">开始您的AI漫剧创作之旅</p>
          </div>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-card p-4">
          <div className="text-sm text-text-secondary">
            显示 1-{sortedProjects.length} 条，共 {sortedProjects.length} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:border-primary hover:text-primary">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:border-primary hover:text-primary">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>

      {/* 新建项目弹窗 */}
      {showCreateProjectModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseCreateModal();
            }
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-xl w-full max-w-md ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">新建项目</h3>
                  <button 
                    onClick={handleCloseCreateModal}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-text-primary mb-2">
                      项目名称
                    </label>
                    <input 
                      type="text" 
                      id="project-name" 
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      placeholder="请输入项目名称" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">项目类型</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="project-type" 
                          value="static" 
                          checked={newProjectType === 'static'}
                          onChange={(e) => setNewProjectType(e.target.value)}
                          className="mr-2 text-primary" 
                        />
                        <span className="text-sm">AI静态漫</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="project-type" 
                          value="dynamic" 
                          checked={newProjectType === 'dynamic'}
                          onChange={(e) => setNewProjectType(e.target.value)}
                          className="mr-2 text-primary"
                        />
                        <span className="text-sm">AI动态漫</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handleCloseCreateModal}
                      className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      创建
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseDeleteModal();
            }
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-xl w-full max-w-md ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
                  <p className="text-sm text-text-secondary">删除后将无法恢复，确定要删除这个项目吗？</p>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={handleCloseDeleteModal}
                    className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                  >
                    取消
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDeleteProject}
                    className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;

