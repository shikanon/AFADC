

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface DialogConfig {
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  confirmText: string;
  cancelText: string;
  items?: Array<{
    name?: string;
    title?: string;
    id?: string;
  }>;
}

const ConfirmDialogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    title: '确认操作',
    message: '确定要执行此操作吗？',
    type: 'warning',
    confirmText: '确定',
    cancelText: '取消'
  });
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '确认操作 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    configureDialog();
  }, [searchParams]);

  useEffect(() => {
    const handleKeyboardEvents = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleConfirm();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyboardEvents);
    return () => {
      document.removeEventListener('keydown', handleKeyboardEvents);
    };
  }, []);

  const configureDialog = () => {
    const action = searchParams.get('action');
    const message = searchParams.get('message');
    const title = searchParams.get('title');
    const confirmText = searchParams.get('confirmText');
    const cancelText = searchParams.get('cancelText');
    const itemsParam = searchParams.get('items');
    const count = searchParams.get('count');

    let config: DialogConfig = {
      title: '确认操作',
      message: '确定要执行此操作吗？',
      type: 'warning',
      confirmText: '确定',
      cancelText: '取消'
    };

    if (action) {
      switch (action) {
        case 'delete_project':
          config = {
            title: '确认删除项目',
            message: '确定要删除选中的项目吗？删除后将无法恢复，请谨慎操作。',
            type: 'danger',
            confirmText: '确定删除',
            cancelText: '取消',
            items: itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : undefined
          };
          break;
        case 'batch_delete_projects':
          config = {
            title: '批量删除项目',
            message: `确定要删除选中的 ${count || '多个'} 个项目吗？删除后将无法恢复，请谨慎操作。`,
            type: 'danger',
            confirmText: '批量删除',
            cancelText: '取消',
            items: itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : undefined
          };
          break;
        case 'delete_asset':
          config = {
            title: '确认删除资产',
            message: '确定要删除选中的资产吗？删除后将无法恢复，请谨慎操作。',
            type: 'danger',
            confirmText: '确定删除',
            cancelText: '取消',
            items: itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : undefined
          };
          break;
        case 'batch_delete_assets':
          config = {
            title: '批量删除资产',
            message: `确定要删除选中的 ${count || '多个'} 个资产吗？删除后将无法恢复，请谨慎操作。`,
            type: 'danger',
            confirmText: '批量删除',
            cancelText: '取消',
            items: itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : undefined
          };
          break;
        case 'delete_user':
          config = {
            title: '确认删除用户',
            message: '确定要删除选中的用户吗？删除后将无法恢复，请谨慎操作。',
            type: 'danger',
            confirmText: '确定删除',
            cancelText: '取消',
            items: itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : undefined
          };
          break;
        case 'batch_delete_users':
          config = {
            title: '批量删除用户',
            message: `确定要删除选中的 ${count || '多个'} 个用户吗？删除后将无法恢复，请谨慎操作。`,
            type: 'danger',
            confirmText: '批量删除',
            cancelText: '取消',
            items: itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : undefined
          };
          break;
        case 'delete_storyboard':
          config = {
            title: '确认删除分镜',
            message: '确定要删除这个分镜吗？删除后将无法恢复，请谨慎操作。',
            type: 'danger',
            confirmText: '确定删除',
            cancelText: '取消',
            items: itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : undefined
          };
          break;
        case 'warning':
          config = {
            title: '警告',
            message: message || '此操作可能产生不可预期的后果，确定要继续吗？',
            type: 'warning',
            confirmText: '继续',
            cancelText: '取消'
          };
          break;
        case 'info':
          config = {
            title: '信息确认',
            message: message || '请确认以下信息',
            type: 'info',
            confirmText: '确认',
            cancelText: '取消'
          };
          break;
      }
    }

    if (message) {
      config.message = decodeURIComponent(message);
    }

    if (title) {
      config.title = decodeURIComponent(title);
    }

    if (confirmText) {
      config.confirmText = decodeURIComponent(confirmText);
    }

    if (cancelText) {
      config.cancelText = decodeURIComponent(cancelText);
    }

    setDialogConfig(config);
  };

  const getIconConfig = () => {
    switch (dialogConfig.type) {
      case 'danger':
        return {
          iconClass: 'fas fa-exclamation-triangle text-danger text-lg',
          bgClass: 'w-10 h-10 bg-danger bg-opacity-10 rounded-full flex items-center justify-center',
          buttonClass: 'px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2'
        };
      case 'warning':
        return {
          iconClass: 'fas fa-exclamation-circle text-warning text-lg',
          bgClass: 'w-10 h-10 bg-warning bg-opacity-10 rounded-full flex items-center justify-center',
          buttonClass: 'px-4 py-2 bg-warning text-white rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2'
        };
      case 'info':
        return {
          iconClass: 'fas fa-info-circle text-info text-lg',
          bgClass: 'w-10 h-10 bg-info bg-opacity-10 rounded-full flex items-center justify-center',
          buttonClass: 'px-4 py-2 bg-info text-white rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2'
        };
      case 'success':
        return {
          iconClass: 'fas fa-check-circle text-success text-lg',
          bgClass: 'w-10 h-10 bg-success bg-opacity-10 rounded-full flex items-center justify-center',
          buttonClass: 'px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2'
        };
      default:
        return {
          iconClass: 'fas fa-exclamation-triangle text-danger text-lg',
          bgClass: 'w-10 h-10 bg-danger bg-opacity-10 rounded-full flex items-center justify-center',
          buttonClass: 'px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2'
        };
    }
  };

  const showSuccessMessage = () => {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-60 transform translate-x-full transition-transform duration-300';
    successMessage.innerHTML = '<i class="fas fa-check mr-2"></i>操作成功';

    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
      successMessage.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 300);
    }, 2000);
  };

  const handleConfirm = () => {
    setIsConfirmLoading(true);

    setTimeout(() => {
      console.log('确认操作:', searchParams.get('action'));

      const returnPage = searchParams.get('returnPage') || '/project-manage';
      const returnParams = searchParams.get('returnParams') ? `?${searchParams.get('returnParams')}` : '';

      showSuccessMessage();

      setTimeout(() => {
        navigate(`${returnPage}${returnParams}`);
      }, 1000);
    }, 500);
  };

  const handleCancel = () => {
    const returnPage = searchParams.get('returnPage') || '/project-manage';
    const returnParams = searchParams.get('returnParams') ? `?${searchParams.get('returnParams')}` : '';
    navigate(`${returnPage}${returnParams}`);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const iconConfig = getIconConfig();

  return (
    <div className="bg-bg-primary text-text-primary">
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} ${styles.modalBackdropEnter} z-50 flex items-center justify-center p-4`}
        onClick={handleBackdropClick}
      >
        <div className={`bg-white rounded-lg shadow-modal w-full max-w-md ${styles.modalEnter}`}>
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div className="flex items-center space-x-3">
              <div className={iconConfig.bgClass}>
                <i className={iconConfig.iconClass}></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">{dialogConfig.title}</h3>
            </div>
            <button 
              className="p-1 rounded-lg hover:bg-bg-secondary transition-colors"
              onClick={handleCancel}
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-text-secondary leading-relaxed">
              {dialogConfig.message}
            </p>
            
            {dialogConfig.items && dialogConfig.items.length > 0 && (
              <div className="mt-4 p-3 bg-bg-secondary rounded-lg">
                <div className="text-sm text-text-secondary">
                  <div className="font-medium text-text-primary mb-1">将要删除的项目：</div>
                  <ul className="space-y-1">
                    {dialogConfig.items.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <i className="fas fa-circle text-xs text-text-secondary"></i>
                        <span>{item.name || item.title || item.id}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-bg-secondary bg-opacity-50">
            <button 
              className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={handleCancel}
            >
              <i className="fas fa-times mr-2"></i>{dialogConfig.cancelText}
            </button>
            <button 
              className={iconConfig.buttonClass}
              onClick={handleConfirm}
              disabled={isConfirmLoading}
            >
              {isConfirmLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>处理中...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>{dialogConfig.confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialogPage;

