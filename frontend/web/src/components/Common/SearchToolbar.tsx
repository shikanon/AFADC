import React, { ReactNode } from 'react';

interface SearchToolbarProps {
  /** 搜索关键词 */
  searchTerm: string;
  /** 搜索关键词变化回调 */
  onSearchChange: (value: string) => void;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 筛选器选项 */
  filterOptions?: Array<{
    value: string;
    label: string;
  }>;
  /** 当前筛选值 */
  filterValue?: string;
  /** 筛选值变化回调 */
  onFilterChange?: (value: string) => void;
  /** 右侧操作区域 */
  actions?: ReactNode;
  /** 是否显示批量操作按钮 */
  showBatchActions?: boolean;
  /** 批量删除回调 */
  onBatchDelete?: () => void;
  /** 选中项目数量 */
  selectedCount?: number;
}

/**
 * 搜索工具栏组件
 * 包含搜索框、筛选器和批量操作按钮
 * 这是一个高度可复用的组件，用于数据列表页面的搜索和筛选功能
 */
const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "搜索...",
  filterOptions,
  filterValue,
  onFilterChange,
  actions,
  showBatchActions = false,
  onBatchDelete,
  selectedCount = 0
}) => {
  return (
    <div className="bg-white rounded-lg border border-border-light p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="relative">
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
          </div>
          
          {/* 筛选器 */}
          {filterOptions && onFilterChange && (
            <select 
              value={filterValue || ''}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 批量操作按钮 */}
          {showBatchActions && onBatchDelete && (
            <button 
              onClick={onBatchDelete}
              disabled={selectedCount === 0}
              className="px-4 py-2 text-danger border border-danger rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-trash mr-2"></i>
              批量删除 ({selectedCount})
            </button>
          )}
          
          {/* 自定义操作区域 */}
          {actions}
        </div>
      </div>
    </div>
  );
};

export default SearchToolbar;