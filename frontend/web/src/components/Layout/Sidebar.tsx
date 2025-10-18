import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  /** 侧边栏是否折叠 */
  isCollapsed: boolean;
  /** 当前激活的菜单项 */
  activeMenu?: string;
  /** 当前路径（用于自动匹配激活菜单项） */
  currentPath?: string;
  /** 菜单项点击回调 */
  onMenuClick?: (menuKey: string) => void;
}

interface MenuItem {
  key: string;
  icon: string;
  label: string;
  path: string;
}

/**
 * 侧边栏组件
 * 包含系统导航菜单，支持折叠状态
 * 这是一个高度可复用的组件，用于所有页面的侧边导航
 */
const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  activeMenu,
  currentPath,
  onMenuClick 
}) => {
  // 菜单项配置
  const menuItems: MenuItem[] = [
    { key: 'project-manage', icon: 'fa-folder', label: '项目管理', path: '/project-manage' },
    { key: 'asset-manage', icon: 'fa-images', label: '资产管理', path: '/asset-manage' },
    { key: 'user-manage', icon: 'fa-users', label: '用户管理', path: '/user-manage' },
    { key: 'plan-manage', icon: 'fa-crown', label: '套餐管理', path: '/plan-manage' },
    { key: 'api-key-setting', icon: 'fa-key', label: 'API密钥设置', path: '/api-key-setting' },
  ];

  // 根据currentPath自动确定激活菜单项
  const computedActiveMenu = activeMenu || 
    menuItems.find(item => currentPath?.includes(item.path))?.key || 
    'asset-manage';

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.key}
            to={item.path}
            onClick={() => onMenuClick?.(item.key)}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              computedActiveMenu === item.key 
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
            }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;