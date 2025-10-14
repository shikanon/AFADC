import React from 'react';

interface ConfirmDialogProps {
  /** 对话框是否可见 */
  isVisible: boolean;
  /** 对话框标题 */
  title: string;
  /** 对话框内容 */
  message: string;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认按钮类型（danger表示危险操作） */
  confirmType?: 'default' | 'danger';
  /** 确认回调函数 */
  onConfirm: () => void;
  /** 取消回调函数 */
  onCancel: () => void;
  /** 是否显示加载状态 */
  isLoading?: boolean;
}

/**
 * 确认对话框组件
 * 用于删除、批量操作等需要用户确认的场景
 * 这是一个高度可复用的组件，避免重复编写确认对话框逻辑
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isVisible,
  title,
  message,
  confirmText = "确认",
  cancelText = "取消",
  confirmType = 'default',
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isVisible) return null;

  // 确认按钮样式类
  const confirmButtonClass = confirmType === 'danger' 
    ? "bg-danger text-white hover:bg-red-600" 
    : "bg-primary text-white hover:bg-blue-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full mx-4">
        {/* 对话框头部 */}
        <div className="px-6 py-4 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        
        {/* 对话框内容 */}
        <div className="px-6 py-4">
          <p className="text-text-secondary">{message}</p>
        </div>
        
        {/* 对话框底部 */}
        <div className="px-6 py-4 border-t border-border-light flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${confirmButtonClass}`}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                处理中...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;