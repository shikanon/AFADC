import { useState, useEffect, createRef, useCallback } from 'react';

// 消息类型定义
type MessageType = 'success' | 'error' | 'info' | 'warning';

// 消息配置接口
interface MessageConfig {
  duration?: number; // 消息显示时长，默认3秒
}

// 消息实例接口
interface MessageInstance {
  close: () => void;
}

// 消息项接口
interface MessageItem {
  id: string;
  content: string;
  type: MessageType;
  duration: number;
}

// 为window对象添加扩展接口
declare global {
  interface Window {
    __addMessage?: (content: string, type: MessageType, config?: MessageConfig) => MessageInstance;
  }
}

// 消息容器组件
const MessageContainer = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const messagesEndRef = createRef<HTMLDivElement>();

  // 使用useCallback包装addMessage以避免每次渲染都重新创建
  const addMessage = useCallback((content: string, type: MessageType, config: MessageConfig = {}): MessageInstance => {
    const id = `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duration = config.duration || 3000;
    
    const newMessage: MessageItem = { id, content, type, duration };
    
    setMessages(prev => [...prev, newMessage]);
    
    // 消息实例关闭函数
    const close = () => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    };
    
    // 自动关闭
    setTimeout(close, duration);
    
    return { close };
  }, [setMessages]);

  // 滚动到最新消息
  useEffect(() => {
    // createRef创建的ref对象在组件生命周期内不会改变，因此可以安全地排除在依赖数组外
    messagesEndRef.current?.scrollIntoView();
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  // 存储addMessage方法到window对象，供外部使用
  useEffect(() => {
    window.__addMessage = addMessage;
    return () => {
      if (window.__addMessage) {
        delete window.__addMessage;
      }
    };
  }, [addMessage]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
      {messages.map(message => (
        <div
          key={message.id}
          className={`px-4 py-2 rounded-md shadow-lg flex items-center transition-opacity duration-300 ease-in-out ${getTypeClass(message.type)}`}
        >
          <span className="mr-2">{getTypeIcon(message.type)}</span>
          <span className="text-sm">{message.content}</span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

// 根据消息类型返回对应的Tailwind类
function getTypeClass(type: MessageType): string {
  switch (type) {
  case 'success':
    return 'bg-green-100 text-green-800 border-l-4 border-green-500';
  case 'error':
    return 'bg-red-100 text-red-800 border-l-4 border-red-500';
  case 'info':
    return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
  case 'warning':
    return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
  default:
    return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
  }
}

// 根据消息类型返回对应的图标
function getTypeIcon(type: MessageType): string {
  switch (type) {
  case 'success':
    return '✓';
  case 'error':
    return '✗';
  case 'info':
    return 'ℹ';
  case 'warning':
    return '⚠';
  default:
    return '•';
  }
}

// 消息工具函数定义
const message = {
  success: (content: string, config?: MessageConfig): MessageInstance => {
    if (!window.__addMessage) {
      console.warn('MessageContainer is not mounted');
      return { close: () => {} };
    }
    return window.__addMessage(content, 'success', config);
  },
  error: (content: string, config?: MessageConfig): MessageInstance => {
    if (!window.__addMessage) {
      console.warn('MessageContainer is not mounted');
      return { close: () => {} };
    }
    return window.__addMessage(content, 'error', config);
  },
  info: (content: string, config?: MessageConfig): MessageInstance => {
    if (!window.__addMessage) {
      console.warn('MessageContainer is not mounted');
      return { close: () => {} };
    }
    return window.__addMessage(content, 'info', config);
  },
  warning: (content: string, config?: MessageConfig): MessageInstance => {
    if (!window.__addMessage) {
      console.warn('MessageContainer is not mounted');
      return { close: () => {} };
    }
    return window.__addMessage(content, 'warning', config);
  }
};

// 同时导出组件和消息工具函数
export { MessageContainer, message };

// 注意：为了避免热更新警告，在生产环境中可能需要单独拆分为两个文件