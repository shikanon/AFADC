import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // 等待动画完成后调用 onClose
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`${getTypeStyles()} px-4 py-2 rounded-lg shadow-lg flex items-center`}>
        <span className="mr-2">
          {type === 'success' && <i className="fas fa-check-circle"></i>}
          {type === 'error' && <i className="fas fa-exclamation-circle"></i>}
          {type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
          {type === 'info' && <i className="fas fa-info-circle"></i>}
        </span>
        <span>{message}</span>
        <button 
          onClick={handleClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;