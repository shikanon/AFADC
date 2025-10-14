import React, { ReactNode } from 'react';

interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 面包屑导航项 */
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
  /** 右侧操作区域 */
  actions?: ReactNode;
  /** 页面描述 */
  description?: string;
}

/**
 * 页面头部组件
 * 包含面包屑导航、页面标题和操作按钮
 * 这是一个高度可复用的组件，用于所有页面的头部区域
 */
const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  breadcrumbs = [{ label: '首页' }],
  actions,
  description 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {/* 面包屑导航 */}
        <nav className="text-sm text-text-secondary mb-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={index}>
              {breadcrumb.path ? (
                <a 
                  href={breadcrumb.path} 
                  className="hover:text-text-primary transition-colors"
                >
                  {breadcrumb.label}
                </a>
              ) : (
                <span className="text-text-primary">{breadcrumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <i className="fas fa-chevron-right mx-2"></i>
              )}
            </span>
          ))}
        </nav>
        
        {/* 页面标题 */}
        <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
        
        {/* 页面描述 */}
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
      
      {/* 右侧操作区域 */}
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;