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
  children?: SubMenuItem[];
}

interface SubMenuItem {
  key: string;
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
    {
      key: 'asset-manage',
      icon: 'fa-images',
      label: '资产管理',
      path: '/asset-manage',
      children: [
        { key: 'asset-list', label: '资产列表', path: '/asset-manage' },
        { key: 'asset-generate', label: 'AI资产生成', path: '/asset-generate' }
      ]
    },
    { key: 'user-manage', icon: 'fa-users', label: '用户管理', path: '/user-manage' },
    { key: 'plan-manage', icon: 'fa-crown', label: '套餐管理', path: '/plan-manage' },
    { key: 'api-key-setting', icon: 'fa-key', label: 'API密钥设置', path: '/api-key-setting' },
  ];

  // 根据currentPath自动确定激活菜单项
  const computedActiveMenu = activeMenu || 
    menuItems.find(item => currentPath?.includes(item.path))?.key || 
    'asset-manage';

  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);
  
  // 切换子菜单展开/折叠状态
  const toggleSubMenu = (menuKey: string) => {
    setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
  };
  
  // 检查当前路径是否匹配菜单项
  const isActiveMenuItem = (item: MenuItem): boolean => {
    // 对于有子菜单项的父菜单项，只有当没有匹配的子菜单项且路径完全匹配时才激活
    if (item.children) {
      // 如果有任何子菜单项匹配，则父菜单项不显示为激活状态
      if (item.children.some(child => currentPath === child.path)) {
        return false;
      }
      // 如果没有匹配的子菜单项，但路径匹配父菜单项，则激活
      return currentPath === item.path;
    }
    // 对于无子菜单项的菜单项，使用包含匹配
    return currentPath?.includes(item.path) || false;
  };
  
  // 检查菜单项是否应该保持展开状态（当任何子菜单项被选中时）
  const shouldKeepExpanded = (menuKey: string): boolean => {
    const menuItem = menuItems.find(item => item.key === menuKey);
    if (menuItem?.children) {
      return menuItem.children.some(child => currentPath === child.path) || expandedMenu === menuKey;
    }
    return false;
  };

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          // 检查是否有子菜单
          const hasChildren = item.children && item.children.length > 0;
          // 检查是否应该保持展开状态
          const isExpanded = shouldKeepExpanded(item.key);
          
          return (
            <div key={item.key} className="space-y-1">
              <button 
                onClick={() => {
                  if (hasChildren) {
                    // 只有当不处于展开状态时才切换
                    if (!isExpanded) {
                      toggleSubMenu(item.key);
                    }
                  } else {
                    window.location.href = item.path;
                    onMenuClick?.(item.key);
                  }
                }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                  isActiveMenuItem(item)
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i className={`${item.icon} text-lg`}></i>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {hasChildren && !isCollapsed && (
                  <i className={`fas fa-chevron-down transition-transform duration-200 ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}></i>
                )}
              </button>
              
              {/* 子菜单 - 使用isExpanded代替expandedMenu来控制显示 */}
              {hasChildren && isExpanded && !isCollapsed && (
                <div className="pl-9 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.key}
                      to={child.path}
                      onClick={(e) => {
                        // 阻止默认行为，通过编程方式导航
                        e.preventDefault();
                        window.location.href = child.path;
                        onMenuClick?.(child.key);
                        // 确保父菜单保持展开状态
                        if (item.key === 'asset-manage') {
                          setExpandedMenu(item.key);
                        }
                      }}
                      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPath === child.path
                          ? 'bg-primary text-white font-medium shadow-sm'
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;