import React from 'react';

interface PaginationProps {
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 每页显示数量 */
  pageSize: number;
  /** 总记录数 */
  totalCount: number;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;
  /** 每页数量变化回调 */
  onPageSizeChange?: (size: number) => void;
  /** 每页数量选项 */
  pageSizeOptions?: number[];
  /** 是否显示总记录数 */
  showTotal?: boolean;
  /** 是否显示每页数量选择器 */
  showSizeChanger?: boolean;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
}

/**
 * 分页组件
 * 用于数据列表的分页显示，支持页码切换、每页数量调整和快速跳转
 * 这是一个高度可复用的组件，避免重复编写分页逻辑
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showTotal = true,
  showSizeChanger = true,
  showQuickJumper = false
}) => {
  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数较少，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 显示当前页附近的页码
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // 处理页码跳转
  const handlePageJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt((e.target as HTMLInputElement).value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      {/* 左侧：总记录数和每页数量选择器 */}
      <div className="flex items-center space-x-4">
        {showTotal && (
          <div className="text-sm text-text-secondary">
            共 <span className="font-medium text-text-primary">{totalCount}</span> 条记录
          </div>
        )}
        
        {showSizeChanger && onPageSizeChange && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>每页显示</span>
            <select 
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>条</span>
          </div>
        )}
      </div>

      {/* 右侧：分页控件 */}
      <div className="flex items-center space-x-2">
        {/* 上一页按钮 */}
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors disabled:opacity-50"
          title="上一页"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {/* 页码按钮 */}
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded text-sm transition-colors ${
              page === currentPage 
                ? 'bg-primary text-white border-primary' 
                : 'border-border-light hover:bg-bg-secondary'
            }`}
          >
            {page}
          </button>
        ))}

        {/* 下一页按钮 */}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors disabled:opacity-50"
          title="下一页"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* 快速跳转 */}
        {showQuickJumper && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>跳至</span>
            <input 
              type="number" 
              min="1" 
              max={totalPages}
              onKeyDown={handlePageJump}
              className="w-16 px-2 py-1 border border-border-light rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="页码"
            />
            <span>页</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;