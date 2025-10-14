

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const VideoEditDialog: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storyboardId = searchParams.get('storyboardId') || 'default';

  // 视频相关状态
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // 表单状态
  const [videoSubject, setVideoSubject] = useState('魔法学院的学生们在图书馆学习');
  const [videoAction, setVideoAction] = useState('翻书、讨论、思考');
  const [videoCamera, setVideoCamera] = useState('缓慢推镜，聚焦人物表情');

  // 对话状态
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'user',
      content: '请让视频中的角色表情更加生动一些',
      timestamp: '刚刚'
    },
    {
      id: '2',
      sender: 'ai',
      content: '已调整角色表情参数，增加了面部微表情动画。',
      timestamp: '刚刚'
    },
    {
      id: '3',
      sender: 'user',
      content: '背景可以更明亮一点吗？',
      timestamp: '2分钟前'
    },
    {
      id: '4',
      sender: 'ai',
      content: '已提升整体亮度和对比度，使场景更加明亮清晰。',
      timestamp: '2分钟前'
    }
  ]);

  // AI处理状态
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiProcessingText, setAiProcessingText] = useState('AI正在处理您的请求...');

  // 完成按钮状态
  const [isCompleting, setIsCompleting] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '视频编辑 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化时滚动到对话历史底部
  useEffect(() => {
    const chatHistoryElement = document.getElementById('chat-history');
    if (chatHistoryElement) {
      chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
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

  // 视频控制函数
  const handlePlayVideo = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handlePauseVideo = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // 发送消息函数
  const handleSendMessage = () => {
    const message = chatInput.trim();
    if (!message) return;

    // 添加用户消息到历史记录
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: '刚刚'
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    
    // 清空输入框
    setChatInput('');
    
    // 显示AI处理状态
    setIsAiProcessing(true);
    setAiProcessingText('AI正在处理您的请求...');
    
    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: '刚刚'
      };
      setChatHistory(prev => [...prev, newAiMessage]);
      setIsAiProcessing(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      '已根据您的要求调整视频效果，主要优化了角色动作的流畅性。',
      '已修改背景场景，增加了更多细节元素。',
      '已调整视频色调，使整体画面更加协调。',
      '已优化角色表情动画，增加了更多生动的面部细节。',
      '已调整运镜方式，使镜头转换更加自然流畅。',
      '已增强视频的视觉效果，提升了整体质感。'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // 处理输入框键盘事件
  const handleChatInputKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 重新生成视频
  const handleRegenerateVideo = () => {
    if (!videoSubject || !videoAction || !videoCamera) {
      alert('请填写完整的视频生成参数');
      return;
    }
    
    // 显示处理状态
    setIsAiProcessing(true);
    setAiProcessingText('AI正在重新生成视频...');
    
    // 模拟视频重新生成
    setTimeout(() => {
      setIsAiProcessing(false);
      alert('视频重新生成完成！');
      
      // 更新视频源
      if (videoPlayerRef.current) {
        videoPlayerRef.current.src = `https://s.coze.cn/video/sample-video-${Date.now()}.mp4`;
        videoPlayerRef.current.load();
      }
    }, 5000);
  };

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

  // 完成编辑
  const handleCompleteEdit = () => {
    // 收集所有编辑信息
    const finalData = {
      storyboardId: storyboardId,
      videoSubject: videoSubject,
      videoAction: videoAction,
      videoCamera: videoCamera,
      chatHistory: chatHistory.map(msg => ({
        sender: msg.sender,
        content: msg.content
      }))
    };
    
    // 显示保存状态
    setIsCompleting(true);
    
    // 模拟保存过程
    setTimeout(() => {
      // 跳转到动态漫制作第五步
      navigate(`/dynamic-create-step5?storyboardId=${storyboardId}&updated=true`);
    }, 1500);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗背景 */}
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} z-50 flex items-center justify-center p-4`}
        onClick={handleBackdropClick}
      >
        {/* 模态弹窗内容 */}
        <div className={`bg-white rounded-xl shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden ${styles.modalEnter}`}>
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-video text-white text-sm"></i>
              </div>
              <h2 className="text-xl font-semibold text-text-primary">视频编辑</h2>
            </div>
            <button 
              onClick={handleCloseModal}
              className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>

          {/* 弹窗内容 */}
          <div className="flex-1 overflow-y-auto">
            {/* 视频预览区 */}
            <div className="p-6 border-b border-border-light">
              <h3 className="text-lg font-medium text-text-primary mb-4">视频预览</h3>
              <div className={styles.videoContainer}>
                <video 
                  ref={videoPlayerRef}
                  className={styles.videoPlayer}
                  controls
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src="https://s.coze.cn/video/sample-video.mp4" type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <button 
                  onClick={handlePlayVideo}
                  disabled={isVideoPlaying}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <i className="fas fa-play mr-2"></i>播放视频
                </button>
                <button 
                  onClick={handlePauseVideo}
                  disabled={!isVideoPlaying}
                  className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors disabled:opacity-50"
                >
                  <i className="fas fa-pause mr-2"></i>暂停
                </button>
              </div>
            </div>

            {/* 视频提示词配置 */}
            <div className="p-6 border-b border-border-light">
              <h3 className="text-lg font-medium text-text-primary mb-4">视频生成参数</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="video-subject" className="block text-sm font-medium text-text-secondary mb-2">主体</label>
                  <input 
                    type="text" 
                    id="video-subject" 
                    value={videoSubject}
                    onChange={(e) => setVideoSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="video-action" className="block text-sm font-medium text-text-secondary mb-2">动作</label>
                  <input 
                    type="text" 
                    id="video-action" 
                    value={videoAction}
                    onChange={(e) => setVideoAction(e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="video-camera" className="block text-sm font-medium text-text-secondary mb-2">运镜</label>
                  <input 
                    type="text" 
                    id="video-camera" 
                    value={videoCamera}
                    onChange={(e) => setVideoCamera(e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <button 
                onClick={handleRegenerateVideo}
                className="mt-4 px-4 py-2 bg-warning text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <i className="fas fa-redo mr-2"></i>重新生成视频
              </button>
            </div>

            {/* 对话编辑区 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">AI对话编辑</h3>
              
              {/* 历史对话区 */}
              <div 
                id="chat-history"
                className="h-64 overflow-y-auto space-y-4 mb-4 p-4 bg-bg-secondary rounded-lg"
              >
                {chatHistory.map((message) => (
                  <div 
                    key={message.id}
                    className={`${styles.chatMessage} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage} p-3`}
                  >
                    {message.sender === 'user' ? (
                      <p className="text-sm">{message.content}</p>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <i className="fas fa-robot text-text-secondary text-sm mt-1"></i>
                        <div>
                          <p className="text-sm">{message.content}</p>
                          <div className="mt-2 text-xs text-text-secondary">
                            <i className="fas fa-clock mr-1"></i>{message.timestamp}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 对话输入区 */}
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleChatInputKeyPress}
                    placeholder="输入您的编辑指令，例如：调整角色动作、修改背景、优化画面效果等..." 
                    className="w-full px-4 py-3 pr-12 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" 
                    rows={3}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-paper-plane text-sm"></i>
                  </button>
                </div>
              </div>

              {/* AI处理状态 */}
              {isAiProcessing && (
                <div className="mt-4 p-4 bg-info bg-opacity-10 border border-info border-opacity-20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className={`fas fa-spinner ${styles.loadingSpinner} text-info`}></i>
                    <span className="text-info font-medium">{aiProcessingText}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 弹窗底部操作按钮 */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-bg-secondary">
            <button 
              onClick={handleCloseModal}
              className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-white transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleCompleteEdit}
              disabled={isCompleting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isCompleting ? (
                <>
                  <i className={`fas fa-spinner ${styles.loadingSpinner} mr-2`}></i>保存中...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>完成编辑
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditDialog;

