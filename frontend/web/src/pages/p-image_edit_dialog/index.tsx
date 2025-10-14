

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

const ImageEditDialog: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [editPrompt, setEditPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboardId, setStoryboardId] = useState('SB-001');
  const [previewImageSrc, setPreviewImageSrc] = useState('https://s.coze.cn/image/yk-fkA8dPwI/');
  
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '图片编辑 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 解析URL参数
  useEffect(() => {
    const storyboardIdParam = searchParams.get('storyboardId');
    if (storyboardIdParam) {
      setStoryboardId(storyboardIdParam);
    }
  }, [searchParams]);

  // 滚动聊天历史到底部
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // ESC键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 关闭弹窗
  const handleCloseModal = () => {
    navigate(-1);
  };

  // 点击背景关闭弹窗
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 添加消息到对话历史
  const addMessageToChat = (content: string, sender: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender
    };
    
    setChatHistory(prev => [...prev, newMessage]);
  };

  // 发送指令
  const handleSendPrompt = () => {
    const promptText = editPrompt.trim();
    
    if (!promptText) {
      alert('请输入编辑指令');
      return;
    }

    // 添加用户消息
    addMessageToChat(promptText, 'user');
    
    // 清空输入框
    setEditPrompt('');
    
    // 显示生成状态
    setIsGenerating(true);
    
    // 模拟AI处理
    setTimeout(() => {
      const aiResponse = '已收到您的指令，正在为您生成新的图片...';
      addMessageToChat(aiResponse, 'ai');
      
      // 模拟图片更新
      setTimeout(() => {
        updatePreviewImage();
        setIsGenerating(false);
        
        const completionMessage = '图片已更新完成！您可以继续提出修改意见，或者点击"完成编辑"确认更改。';
        addMessageToChat(completionMessage, 'ai');
      }, 2000);
    }, 1000);
  };

  // 输入框回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  // 快捷指令
  const handleQuickCommand = (command: string) => {
    setEditPrompt(command);
    handleSendPrompt();
  };

  // 重新生成
  const handleRegenerate = () => {
    const command = '请重新生成这张图片，保持相同的风格和内容';
    setEditPrompt(command);
    handleSendPrompt();
  };

  // 完成编辑
  const handleCompleteEdit = () => {
    alert('图片编辑已完成！');
    
    const fromParam = searchParams.get('from') || '/static-create-step3';
    navigate(`${fromParam}?updatedStoryboardId=${storyboardId}`);
  };

  // 更新预览图片
  const updatePreviewImage = () => {
    const images = [
      'https://s.coze.cn/image/gxeIMLuExKY/',
      'https://s.coze.cn/image/wmNDbHUS2_Q/',
      'https://s.coze.cn/image/KPSQ_WIngMY/',
      'https://s.coze.cn/image/LhBCjahW-Ks/'
    ];
    
    const currentIndex = images.findIndex(img => previewImageSrc.includes(img.split('/').pop()!));
    const nextIndex = (currentIndex + 1) % images.length;
    
    setPreviewImageSrc(images[nextIndex]);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗背景 */}
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} flex items-center justify-center z-50 p-4`}
        onClick={handleBackdropClick}
      >
        {/* 模态弹窗内容 */}
        <div className={`bg-white rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] ${styles.modalEnter}`}>
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-edit text-white text-sm"></i>
              </div>
              <h2 className="text-xl font-semibold text-text-primary">图片编辑</h2>
            </div>
            <button 
              onClick={handleCloseModal}
              className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>

          {/* 弹窗内容 */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左侧：图片预览区 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">图片预览</h3>
                <div className="bg-bg-secondary rounded-lg p-4 flex items-center justify-center">
                  <img 
                    src={previewImageSrc}
                    alt="分镜画面预览" 
                    className={`${styles.imagePreview} rounded-lg shadow-card`}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>分镜 ID: <span className="font-medium text-text-primary">{storyboardId}</span></span>
                  <span>尺寸: 1920x1080</span>
                </div>
              </div>

              {/* 右侧：对话编辑区 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">AI 对话编辑</h3>
                
                {/* 历史对话区 */}
                <div 
                  ref={chatHistoryRef}
                  className={`${styles.chatContainer} bg-bg-secondary rounded-lg p-4 space-y-4`}
                >
                  {/* 初始提示 */}
                  <div className={styles.chatMessage}>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-robot text-white text-xs"></i>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-3 shadow-card">
                          <p className="text-sm text-text-primary">你好！我是AI助手，可以帮你编辑这张图片。请告诉我你想要什么样的修改，比如：</p>
                          <ul className="mt-2 text-sm text-text-secondary space-y-1">
                            <li>• 调整角色表情</li>
                            <li>• 修改背景场景</li>
                            <li>• 改变画风风格</li>
                            <li>• 调整光线效果</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 动态对话内容 */}
                  {chatHistory.map((message) => (
                    <div key={message.id} className={styles.chatMessage}>
                      {message.sender === 'user' ? (
                        <div className="flex items-start space-x-2 justify-end">
                          <div className="flex-1 max-w-xs">
                            <div className="bg-primary text-white rounded-lg p-3 shadow-card">
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-user text-white text-xs"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-robot text-white text-xs"></i>
                          </div>
                          <div className="flex-1">
                            <div className="bg-white rounded-lg p-3 shadow-card">
                              <p className="text-sm text-text-primary">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 输入区 */}
                <div className="space-y-3">
                  <div className="relative">
                    <textarea 
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="请输入你的编辑指令..." 
                      className="w-full pl-4 pr-12 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={3}
                    />
                    <button 
                      onClick={handleSendPrompt}
                      className="absolute right-3 bottom-3 w-8 h-8 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      <i className="fas fa-paper-plane text-sm"></i>
                    </button>
                  </div>
                  
                  {/* 快捷指令 */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleQuickCommand('让角色微笑')}
                      className="px-3 py-1 bg-white border border-border-light rounded-lg text-sm hover:bg-bg-secondary transition-colors"
                    >
                      <i className="fas fa-smile mr-1"></i>让角色微笑
                    </button>
                    <button 
                      onClick={() => handleQuickCommand('调整光线更明亮')}
                      className="px-3 py-1 bg-white border border-border-light rounded-lg text-sm hover:bg-bg-secondary transition-colors"
                    >
                      <i className="fas fa-sun mr-1"></i>调整光线更明亮
                    </button>
                    <button 
                      onClick={() => handleQuickCommand('更换背景为森林')}
                      className="px-3 py-1 bg-white border border-border-light rounded-lg text-sm hover:bg-bg-secondary transition-colors"
                    >
                      <i className="fas fa-tree mr-1"></i>更换背景为森林
                    </button>
                    <button 
                      onClick={() => handleQuickCommand('提高画质清晰度')}
                      className="px-3 py-1 bg-white border border-border-light rounded-lg text-sm hover:bg-bg-secondary transition-colors"
                    >
                      <i className="fas fa-magic mr-1"></i>提高画质清晰度
                    </button>
                  </div>
                </div>

                {/* 生成状态 */}
                {isGenerating && (
                  <div className="bg-bg-secondary rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="text-sm text-text-primary">
                        AI正在处理您的请求<span className={styles.loadingDots}></span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 弹窗底部 */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-bg-secondary">
            <button 
              onClick={handleRegenerate}
              className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-white transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>重新生成
            </button>
            <button 
              onClick={handleCompleteEdit}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i className="fas fa-check mr-2"></i>完成编辑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditDialog;

