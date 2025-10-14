

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import { SearchToolbar, ConfirmDialog } from '../../components/Common';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  organization: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  role: string;
  organization: string;
}

const UserManagePage: React.FC = () => {
  // 状态管理
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [deleteType, setDeleteType] = useState<'single' | 'batch'>('single');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    role: '',
    organization: ''
  });

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

  // 模拟用户数据
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: '张设计师',
      email: 'zhang@company.com',
      avatar: 'https://s.coze.cn/image/VX1tHZTrm4w/',
      organization: '创意设计工作室',
      role: 'admin',
      createdAt: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: '李动画师',
      email: 'li@company.com',
      avatar: 'https://s.coze.cn/image/QTERZ607EgI/',
      organization: '创意设计工作室',
      role: 'editor',
      createdAt: '2024-01-14 09:15'
    },
    {
      id: '3',
      name: '王编剧',
      email: 'wang@company.com',
      avatar: 'https://s.coze.cn/image/tXF3S1JcJhM/',
      organization: '创意设计工作室',
      role: 'editor',
      createdAt: '2024-01-13 16:45'
    },
    {
      id: '4',
      name: '陈策划',
      email: 'chen@company.com',
      avatar: 'https://s.coze.cn/image/0wyORzv6ZV0/',
      organization: '创意设计工作室',
      role: 'editor',
      createdAt: '2024-01-12 11:20'
    },
    {
      id: '5',
      name: '刘导演',
      email: 'liu@company.com',
      avatar: 'https://s.coze.cn/image/27XodjYxybw/',
      organization: '创意设计工作室',
      role: 'editor',
      createdAt: '2024-01-11 13:50'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '用户管理 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  // 单个用户选择
  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 表单输入处理
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 新增用户
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.username,
      email: formData.email,
      avatar: 'https://s.coze.cn/image/hLi1TkHiZ4c/',
      organization: formData.organization === 'creative-studio' ? '创意设计工作室' : 
                    formData.organization === 'animation-team' ? '动画制作团队' : '内容创作团队',
      role: formData.role as 'admin' | 'editor',
      createdAt: new Date().toLocaleString()
    };

    setUsers(prev => [...prev, newUser]);
    setShowAddUserModal(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: '',
      organization: ''
    });

    alert('用户添加成功！');
  };

  // 单个删除
  const handleDeleteUser = (userId: string) => {
    setCurrentUserId(userId);
    setDeleteType('single');
    handleDeleteWithConfirm();
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedUserIds.length > 0) {
      setDeleteType('batch');
      handleDeleteWithConfirm();
    }
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
        setSelectedUserIds([]);
        setCurrentUserId(null);
      }
    });
    setIsConfirmDialogVisible(true);
  };



  // 使用ConfirmDialog的删除处理
  const handleDeleteWithConfirm = () => {
    if (deleteType === 'single' && currentUserId) {
      const message = '确定要删除这个用户吗？';
      showConfirmDialog('删除确认', message, () => {
        setUsers(prev => prev.filter(user => user.id !== currentUserId));
        setSelectedUserIds([]);
        setCurrentUserId(null);
        alert('删除成功！');
      });
    } else if (deleteType === 'batch' && selectedUserIds.length > 0) {
      const message = `确定要删除选中的${selectedUserIds.length}个用户吗？`;
      showConfirmDialog('删除确认', message, () => {
        setUsers(prev => prev.filter(user => !selectedUserIds.includes(user.id)));
        setSelectedUserIds([]);
        setCurrentUserId(null);
        alert('删除成功！');
      });
    }
  };



  // 关闭新增用户弹窗
  const handleCloseAddModal = () => {
    setShowAddUserModal(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: '',
      organization: ''
    });
  };

  // 检查是否全选
  const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;
  const isIndeterminate = selectedUserIds.length > 0 && selectedUserIds.length < filteredUsers.length;

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用Header组件 */}
      <Header 
        isSidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleSidebarToggle}
        searchPlaceholder="搜索项目、资产..."
      />

      {/* 左侧菜单 - 使用Sidebar组件 */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        currentPath="/user-manage"
      />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            title="用户管理"
            breadcrumbs={[
              { label: '首页', path: '/' },
              { label: '用户管理', path: '/user-manage' }
            ]}
            actions={
              <button 
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                新增用户
              </button>
            }
          />

          {/* 工具栏 - 使用SearchToolbar组件 */}
          <SearchToolbar 
            searchValue={userSearchTerm}
            onSearchChange={(e) => setUserSearchTerm(e.target.value)}
            searchPlaceholder="搜索用户名、角色..."
            filters={[
              {
                label: '角色',
                value: roleFilter,
                onChange: (e) => setRoleFilter(e.target.value),
                options: [
                  { value: '', label: '全部角色' },
                  { value: 'admin', label: '管理员' },
                  { value: 'editor', label: '编辑' }
                ]
              }
            ]}
            actions={
              selectedUserIds.length > 0 ? (
                <button 
                  onClick={handleBatchDelete}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  批量删除
                </button>
              ) : undefined
            }
          />

          {/* 用户列表 */}
          <div className="bg-white rounded-lg border border-border-light overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = isIndeterminate;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-border-medium"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">用户名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">所属组织</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">角色</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">创建时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={`border-t border-border-light ${styles.tableRowHover}`}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedUserIds.includes(user.id)}
                          onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                          className="rounded border-border-medium"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={user.avatar} 
                            alt="用户头像" 
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-text-primary">{user.name}</div>
                            <div className="text-sm text-text-secondary">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-primary">{user.organization}</td>
                      <td className="px-4 py-3">
                        <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleEditor}`}>
                          {user.role === 'admin' ? '管理员' : '编辑'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{user.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
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
              共 <span className="font-medium text-text-primary">25</span> 个用户，每页显示
              <select className="mx-2 border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="10">10</option>
                <option value="20" selected>20</option>
                <option value="50">50</option>
              </select> 个
            </div>
            <div className="flex items-center space-x-2">
              <button disabled className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors disabled:opacity-50">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">2</button>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">3</button>
              <span className="px-2 text-text-secondary">...</span>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">5</button>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 新增用户弹窗 */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleCloseAddModal}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-lg shadow-xl w-full max-w-md`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">新增用户</h3>
                  <button onClick={handleCloseAddModal} className="text-text-secondary hover:text-text-primary">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">用户名 *</label>
                    <input 
                      type="text" 
                      id="username" 
                      value={formData.username}
                      onChange={(e) => handleFormChange('username', e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入用户名" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">邮箱 *</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入邮箱地址" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">密码 *</label>
                    <input 
                      type="password" 
                      id="password" 
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入密码" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">角色 *</label>
                    <select 
                      id="role" 
                      value={formData.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      required
                    >
                      <option value="">请选择角色</option>
                      <option value="admin">管理员</option>
                      <option value="editor">编辑</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-text-primary mb-2">所属组织 *</label>
                    <select 
                      id="organization" 
                      value={formData.organization}
                      onChange={(e) => handleFormChange('organization', e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      required
                    >
                      <option value="">请选择组织</option>
                      <option value="creative-studio">创意设计工作室</option>
                      <option value="animation-team">动画制作团队</option>
                      <option value="content-creators">内容创作团队</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handleCloseAddModal}
                      className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      确认添加
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


      
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
    </div>
  );
};

export default UserManagePage;

