import React from 'react';

interface HeaderProps {
  /** 侧边栏切换回调函数 */
  onSidebarToggle: () => void;
  /** 侧边栏折叠状态 */
  isSidebarCollapsed: boolean;
  /** 搜索框占位符文本 */
  searchPlaceholder?: string;
  /** 用户信息 */
  userInfo?: {
    avatar: string;
    name: string;
  };
}

/**
 * 顶部导航栏组件
 * 包含Logo、菜单切换按钮、搜索框、通知和用户信息
 * 这是一个高度可复用的组件，用于所有页面的顶部导航
 */
const Header: React.FC<HeaderProps> = ({ 
  onSidebarToggle, 
  isSidebarCollapsed,
  searchPlaceholder = "搜索项目、资产...",
  userInfo = {
    avatar: "https://s.coze.cn/image/Kaylvq1U0II/",
    name: "张设计师"
  }
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* 左侧：Logo和菜单切换 */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onSidebarToggle}
            className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            aria-label={isSidebarCollapsed ? "打开侧边栏" : "收起侧边栏"}
          >
            <i className={`fas ${isSidebarCollapsed ? 'fa-bars' : 'fa-times'} text-text-secondary`}></i>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-magic text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-semibold text-text-primary">AI漫剧速成工场</h1>
          </div>
        </div>
        
        {/* 中间：搜索框 */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
          </div>
        </div>
        
        {/* 右侧：通知和用户 */}
        <div className="flex items-center space-x-4">
          <button 
            className="relative p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            aria-label="查看通知"
          >
            <i className="fas fa-bell text-text-secondary"></i>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <img 
              src={userInfo.avatar} 
              alt="用户头像" 
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-text-primary">{userInfo.name}</span>
            <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;