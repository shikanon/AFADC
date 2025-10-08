

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface WorkspaceData {
  id: string;
  name: string;
  description: string;
  role: 'owner' | 'member';
  projectCount: number;
  memberCount: number;
  createDate: string;
  thumbnail: string;
}

const WorkspaceListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showLeaveWorkspaceModal, setShowLeaveWorkspaceModal] = useState(false);
  const [workspaceToLeave, setWorkspaceToLeave] = useState<WorkspaceData | null>(null);
  const [workspaceSearchTerm, setWorkspaceSearchTerm] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [workspaceSortBy, setWorkspaceSortBy] = useState('created_desc');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');

  // 工作空间数据
  const [workspacesData, setWorkspacesData] = useState<WorkspaceData[]>([
    {
      id: 'workspace-1',
      name: '我的工作室',
      description: '个人创作空间，用于制作个人项目和练习作品',
      role: 'owner',
      projectCount: 5,
      memberCount: 3,
      createDate: '2024-01-15',
      thumbnail: 'https://s.coze.cn/image/_ey5IzGbt6Y/'
    },
    {
      id: 'workspace-2',
      name: '创意团队',
      description: '与朋友一起创作的团队空间，专注于商业项目开发',
      role: 'member',
      projectCount: 12,
      memberCount: 8,
      createDate: '2024-01-10',
      thumbnail: 'https://s.coze.cn/image/aB1mNxqFw2o/'
    },
    {
      id: 'workspace-3',
      name: '影视工作室',
      description: '专业影视制作公司的内部创作空间',
      role: 'member',
      projectCount: 25,
      memberCount: 15,
      createDate: '2024-01-05',
      thumbnail: 'https://s.coze.cn/image/ObZekgVipzc/'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '工作空间管理 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  // 过滤工作空间
  const filteredWorkspaces = workspacesData.filter(workspace =>
    workspace.name.toLowerCase().includes(workspaceSearchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(workspaceSearchTerm.toLowerCase())
  );

  // 处理创建工作空间
  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      console.log('创建工作空间:', { name: workspaceName, description: workspaceDescription });
      alert('工作空间创建成功！');
      setShowCreateWorkspaceModal(false);
      setWorkspaceName('');
      setWorkspaceDescription('');
      // 刷新页面或添加新的工作空间卡片
      window.location.reload();
    }
  };

  // 进入工作空间
  const handleEnterWorkspace = (workspaceId: string) => {
    localStorage.setItem('currentWorkspaceId', workspaceId);
    navigate(`/project-list?workspaceId=${workspaceId}`);
  };

  // 工作空间设置
  const handleWorkspaceSettings = (workspaceId: string) => {
    console.log('打开工作空间设置:', workspaceId);
    alert('工作空间设置功能');
  };

  // 退出工作空间
  const handleLeaveWorkspace = (workspace: WorkspaceData) => {
    setWorkspaceToLeave(workspace);
    setShowLeaveWorkspaceModal(true);
  };

  // 确认退出工作空间
  const handleConfirmLeaveWorkspace = () => {
    if (workspaceToLeave) {
      console.log('确认退出工作空间:', workspaceToLeave.id);
      alert('已退出工作空间');
      setShowLeaveWorkspaceModal(false);
      setWorkspaceToLeave(null);
      // 刷新页面或移除工作空间卡片
      window.location.reload();
    }
  };

  // 工作空间卡片组件
  const WorkspaceCard: React.FC<{ workspace: WorkspaceData }> = ({ workspace }) => (
    <div 
      className={`bg-white rounded-xl shadow-card ${styles.workspaceCardHover} cursor-pointer`}
      onClick={() => handleEnterWorkspace(workspace.id)}
    >
      <div className="relative">
        <img 
          src={workspace.thumbnail}
          alt="工作空间预览图" 
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            workspace.role === 'owner' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-info/10 text-info'
          }`}>
            {workspace.role === 'owner' ? '所有者' : '成员'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary">{workspace.name}</h3>
          <div className="flex items-center space-x-1">
            <i className={`text-sm ${
              workspace.role === 'owner' ? 'fas fa-crown text-warning' : 'fas fa-user text-info'
            }`}></i>
            <span className="text-xs text-text-secondary">{workspace.role === 'owner' ? '所有者' : '成员'}</span>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">{workspace.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary">{workspace.projectCount}</div>
            <div className="text-xs text-text-secondary">项目</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary">{workspace.memberCount}</div>
            <div className="text-xs text-text-secondary">成员</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
          <span><i className="fas fa-calendar mr-1"></i>{workspace.createDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              className="text-primary hover:text-primary/80 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEnterWorkspace(workspace.id);
              }}
            >
              <i className="fas fa-arrow-right mr-1"></i>进入
            </button>
            {workspace.role === 'owner' && (
              <button 
                className="text-text-secondary hover:text-primary text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkspaceSettings(workspace.id);
                }}
              >
                <i className="fas fa-cog mr-1"></i>设置
              </button>
            )}
          </div>
          <button 
            className="text-text-secondary hover:text-danger text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleLeaveWorkspace(workspace);
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );

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
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
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
                  src="https://s.coze.cn/image/dR3v8xLZa8U/" 
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
      <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-border-light ${styles.sidebarTransition} z-40`}>
        <nav className="p-4 space-y-2">
          {/* 工作空间 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">工作空间</h3>
            <div className="space-y-1">
              <Link 
                to="/workspace-list" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}
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
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
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
              <Link 
                to="/script-info" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-file-alt w-4"></i>
                <span>剧本信息</span>
              </Link>
              <Link 
                to="/character-generation" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-user-friends w-4"></i>
                <span>角色IP形象</span>
              </Link>
              <Link 
                to="/voice-selection" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-microphone w-4"></i>
                <span>音色选择</span>
              </Link>
              <Link 
                to="/scenario-editor" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-film w-4"></i>
                <span>分镜脚本</span>
              </Link>
              <Link 
                to="/image-generation" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </Link>
              <Link 
                to="/video-generation" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </Link>
              <Link 
                to="/video-export" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-download w-4"></i>
                <span>视频导出</span>
              </Link>
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
              <li><span className="text-text-primary">首页</span></li>
              <li><i className="fas fa-chevron-right text-xs"></i></li>
              <li><span className="text-text-primary">工作空间管理</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">工作空间管理</h1>
              <p className="text-text-secondary">管理和创建您的工作空间</p>
            </div>
            <button 
              onClick={() => setShowCreateWorkspaceModal(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>创建工作空间
            </button>
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
                  placeholder="搜索工作空间名称..." 
                  value={workspaceSearchTerm}
                  onChange={(e) => setWorkspaceSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                />
              </div>
            </div>
            
            {/* 排序选项 */}
            <div className="flex items-center space-x-3">
              <select 
                value={workspaceSortBy}
                onChange={(e) => setWorkspaceSortBy(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm"
              >
                <option value="created_desc">创建时间 ↓</option>
                <option value="created_asc">创建时间 ↑</option>
                <option value="name_asc">名称 A-Z</option>
                <option value="name_desc">名称 Z-A</option>
                <option value="projects_desc">项目数量 ↓</option>
                <option value="projects_asc">项目数量 ↑</option>
              </select>
            </div>
          </div>
        </div>

        {/* 工作空间列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredWorkspaces.map(workspace => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}

          {/* 创建新工作空间卡片 */}
          <div 
            onClick={() => setShowCreateWorkspaceModal(true)}
            className="border-2 border-dashed border-border-light rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-plus text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">创建新工作空间</h3>
            <p className="text-sm text-text-secondary">开始您的团队协作之旅</p>
          </div>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-card p-4">
          <div className="text-sm text-text-secondary">
            显示 1-{filteredWorkspaces.length} 条，共 {filteredWorkspaces.length} 条记录
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

      {/* 创建工作空间弹窗 */}
      {showCreateWorkspaceModal && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">创建工作空间</h3>
                  <button 
                    onClick={() => setShowCreateWorkspaceModal(false)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div>
                    <label htmlFor="workspace-name" className="block text-sm font-medium text-text-primary mb-2">工作空间名称</label>
                    <input 
                      type="text" 
                      id="workspace-name" 
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      placeholder="请输入工作空间名称" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="workspace-description" className="block text-sm font-medium text-text-primary mb-2">工作空间描述</label>
                    <textarea 
                      id="workspace-description" 
                      rows={3}
                      value={workspaceDescription}
                      onChange={(e) => setWorkspaceDescription(e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} resize-none`}
                      placeholder="请输入工作空间描述"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateWorkspaceModal(false)}
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

      {/* 确认退出工作空间弹窗 */}
      {showLeaveWorkspaceModal && workspaceToLeave && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">确认退出</h3>
                  <button 
                    onClick={() => setShowLeaveWorkspaceModal(false)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-sign-out-alt text-danger text-2xl"></i>
                  </div>
                  <p className="text-text-secondary mb-2">
                    您确定要退出工作空间 "<span className="font-medium text-text-primary">{workspaceToLeave.name}</span>" 吗？
                  </p>
                  <p className="text-sm text-text-secondary">退出后您将无法访问该工作空间中的项目</p>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowLeaveWorkspaceModal(false)}
                    className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                  >
                    取消
                  </button>
                  <button 
                    type="button" 
                    onClick={handleConfirmLeaveWorkspace}
                    className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                  >
                    确认退出
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

export default WorkspaceListPage;

