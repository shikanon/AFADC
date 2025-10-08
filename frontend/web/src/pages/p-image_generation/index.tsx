

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface ShotData {
  id: number;
  title: string;
  prompt: string;
  character: string;
  status: 'completed' | 'pending' | 'generating';
  imageUrl?: string;
  altText?: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const ImageGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'default-project';

  // 页面标题设置
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '分镜画面生成与编辑 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  // 分镜数据状态
  const [shotDataList, setShotDataList] = useState<ShotData[]>([
    {
      id: 1,
      title: '樱花飞舞的校园',
      prompt: '樱花飞舞的校园场景，女主角穿着蓝色校服站在樱花树下，背景是教学楼，温暖的春日阳光',
      character: 'character-1',
      status: 'completed',
      imageUrl: 'https://s.coze.cn/image/_ZnXle0u2l4/',
      altText: '樱花飞舞的校园场景，女主角站在樱花树下'
    },
    {
      id: 2,
      title: '教室场景',
      prompt: '明亮的教室内部，学生们正在上课，阳光透过窗户洒在课桌上，黑板上写着数学公式',
      character: 'character-2',
      status: 'completed',
      imageUrl: 'https://s.coze.cn/image/20X6k9zmMyQ/',
      altText: '教室内部场景，学生们在上课'
    },
    {
      id: 3,
      title: '图书馆相遇',
      prompt: '安静的图书馆角落，女主角正在看书，男主角轻轻走过来，两人目光相遇的温馨场景',
      character: 'character-1,character-2',
      status: 'completed',
      imageUrl: 'https://s.coze.cn/image/ghWeUClrO6A/',
      altText: '图书馆安静的阅读角落'
    },
    {
      id: 4,
      title: '黄昏的操场',
      prompt: '黄昏时分的操场，夕阳西下，男女主角并肩走在跑道上，影子被拉得很长',
      character: 'character-1,character-2',
      status: 'pending',
      imageUrl: undefined,
      altText: undefined
    },
    {
      id: 5,
      title: '星空下的约定',
      prompt: '夜晚的校园天台，满天繁星，男女主角坐在栏杆上，许下约定的浪漫场景',
      character: 'character-1,character-2',
      status: 'pending',
      imageUrl: undefined,
      altText: undefined
    }
  ]);

  // 生成进度状态
  const [isGeneratingProgressVisible, setIsGeneratingProgressVisible] = useState(false);
  const [currentGenerationProgress, setCurrentGenerationProgress] = useState(0);
  const [totalGenerationShots] = useState(5);
  const [currentGenerationTask, setCurrentGenerationTask] = useState('正在处理分镜 1...');

  // 独立修改弹窗状态
  const [isEditWorkflowModalVisible, setIsEditWorkflowModalVisible] = useState(false);
  const [currentEditingShotId, setCurrentEditingShotId] = useState<number | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInputValue, setChatInputValue] = useState('');

  // 批量生成分镜画面
  const handleBatchGenerate = () => {
    console.log('开始批量生成分镜画面');
    setIsGeneratingProgressVisible(true);
    setCurrentGenerationProgress(0);
    simulateBatchGeneration();
  };

  // 模拟批量生成过程
  const simulateBatchGeneration = () => {
    const interval = setInterval(() => {
      setCurrentGenerationProgress(prev => {
        const newProgress = prev + 1;
        setCurrentGenerationTask(`正在处理分镜 ${newProgress}...`);
        
        if (newProgress >= totalGenerationShots) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGeneratingProgressVisible(false);
            alert('分镜画面批量生成完成！');
            updateAllShotsToCompleted();
          }, 1000);
        }
        
        return newProgress;
      });
    }, 1000);
  };

  // 更新所有分镜为已完成状态
  const updateAllShotsToCompleted = () => {
    const imageUrls = [
      'https://s.coze.cn/image/hc2qECHShOA/',
      'https://s.coze.cn/image/i-sDduv3eMI/',
      'https://s.coze.cn/image/AyMDv9JkZEU/',
      'https://s.coze.cn/image/POs-JKwIMRs/',
      'https://s.coze.cn/image/r6yCZAxOcBI/'
    ];

    setShotDataList(prev => prev.map((shot, index) => ({
      ...shot,
      status: 'completed' as const,
      imageUrl: imageUrls[index],
      altText: `分镜 ${shot.id} 画面`
    })));
  };

  // 保存修改
  const handleSaveChanges = () => {
    console.log('保存分镜画面修改');
    console.log('保存的数据:', shotDataList);
    
    // 这里可以调用API保存数据
    alert('修改已保存！');
  };

  // 重新生成单个分镜
  const handleRegenerateSingleShot = (shotId: number) => {
    console.log(`重新生成分镜 ${shotId}`);
    
    setShotDataList(prev => prev.map(shot => 
      shot.id === shotId ? { ...shot, status: 'generating' as const } : shot
    ));
    
    // 模拟生成过程
    setTimeout(() => {
      const imageUrls = [
        'https://s.coze.cn/image/Y33CTLcm3lg/',
        'https://s.coze.cn/image/2s9OFljy5nE/',
        'https://s.coze.cn/image/2PlkuKb_6L0/',
        'https://s.coze.cn/image/79E0Jyy9Szk/',
        'https://s.coze.cn/image/LUKKTUUEnwk/'
      ];
      
      const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      
      setShotDataList(prev => prev.map(shot => 
        shot.id === shotId 
          ? { 
              ...shot, 
              status: 'completed' as const, 
              imageUrl: randomImageUrl 
            } 
          : shot
      ));
      
      alert(`分镜 ${shotId} 重新生成完成！`);
    }, 3000);
  };

  // 打开独立修改工作流
  const handleOpenEditWorkflow = (shotId: number) => {
    console.log(`打开分镜 ${shotId} 的独立修改工作流`);
    setCurrentEditingShotId(shotId);
    setIsEditWorkflowModalVisible(true);
    setChatHistory([]);
    setChatInputValue('');
  };

  // 关闭独立修改工作流
  const handleCloseEditWorkflow = () => {
    setIsEditWorkflowModalVisible(false);
    setCurrentEditingShotId(null);
    setChatHistory([]);
    setChatInputValue('');
  };

  // 发送对话消息
  const handleSendChatMessage = () => {
    const message = chatInputValue.trim();
    if (message) {
      const newMessage: ChatMessage = { role: 'user', content: message };
      setChatHistory(prev => [...prev, newMessage]);
      setChatInputValue('');
      
      // 模拟AI回复
      setTimeout(() => {
        const aiReply: ChatMessage = { 
          role: 'ai', 
          content: '我已经理解你的需求，正在为你调整画面...' 
        };
        setChatHistory(prev => [...prev, aiReply]);
      }, 1000);
    }
  };

  // 应用修改
  const handleApplyChanges = () => {
    console.log('应用分镜画面修改');
    // 这里应该调用API应用修改
    alert('修改已应用！');
    handleCloseEditWorkflow();
  };

  // 处理提示词变化
  const handlePromptChange = (shotId: number, newPrompt: string) => {
    setShotDataList(prev => prev.map(shot => 
      shot.id === shotId ? { ...shot, prompt: newPrompt } : shot
    ));
  };

  // 处理角色选择变化
  const handleCharacterChange = (shotId: number, newCharacter: string) => {
    setShotDataList(prev => prev.map(shot => 
      shot.id === shotId ? { ...shot, character: newCharacter } : shot
    ));
  };

  // 上一步按钮
  const handlePreviousStep = () => {
    navigate(`/scenario-editor?projectId=${projectId}`);
  };

  // 下一步按钮
  const handleNextStep = () => {
    // 根据项目类型决定跳转到哪个页面
    // 这里假设当前项目是静态漫，实际应用中应该从项目数据获取
    const projectType: string = 'static'; // 可以从URL参数或项目数据中获取
    if (projectType === 'dynamic') {
      navigate(`/video-generation?projectId=${projectId}`);
    } else {
      navigate(`/video-export?projectId=${projectId}`);
    }
  };

  // 获取分镜状态标签样式
  const getShotStatusBadge = (status: ShotData['status']) => {
    switch (status) {
      case 'completed':
        return { className: 'bg-success/10 text-success', text: '已完成' };
      case 'generating':
        return { 
          className: `bg-warning/10 text-warning ${styles.shotStatusGenerating}`, 
          text: '生成中' 
        };
      case 'pending':
        return { className: 'bg-info/10 text-info', text: '待生成' };
      default:
        return { className: 'bg-info/10 text-info', text: '待生成' };
    }
  };

  // 渲染分镜卡片
  const renderShotCard = (shot: ShotData) => {
    const statusBadge = getShotStatusBadge(shot.status);
    
    return (
      <div key={shot.id} className={`bg-white rounded-xl shadow-card ${styles.shotCardHover}`}>
        <div className="relative">
          {shot.imageUrl ? (
            <img 
              src={shot.imageUrl} 
              alt={shot.altText || `分镜 ${shot.id} 画面`} 
              className="w-full h-48 object-cover rounded-t-xl" 
              data-category="艺术"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-image text-4xl text-text-secondary mb-2"></i>
                <p className="text-sm text-text-secondary">等待生成</p>
              </div>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
              {statusBadge.text}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
              分镜 {shot.id}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-text-primary mb-3">{shot.title}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">生成提示词</label>
            <textarea 
              className="w-full px-3 py-2 border border-border-light rounded-lg text-sm resize-none" 
              rows={3}
              placeholder="描述画面内容..."
              value={shot.prompt}
              onChange={(e) => handlePromptChange(shot.id, e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">关联角色</label>
            <select 
              className="w-full px-3 py-2 border border-border-light rounded-lg text-sm"
              value={shot.character}
              onChange={(e) => handleCharacterChange(shot.id, e.target.value)}
            >
              <option value="">选择角色</option>
              <option value="character-1">女主角 - 小雨</option>
              <option value="character-2">男主角 - 小风</option>
            </select>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <button 
              onClick={() => handleRegenerateSingleShot(shot.id)}
              className="flex-1 bg-warning/10 text-warning px-3 py-2 rounded-lg text-sm hover:bg-warning/20 transition-colors"
            >
              <i className="fas fa-redo mr-1"></i>重新生成
            </button>
            <button 
              onClick={() => handleOpenEditWorkflow(shot.id)}
              className="flex-1 bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm hover:bg-primary/20 transition-colors"
            >
              <i className="fas fa-edit mr-1"></i>独立修改
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和产品名称 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-magic text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-text-primary">AI漫剧快造</h1>
          </div>
          
          {/* 全局搜索 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
              <input 
                type="text" 
                placeholder="搜索项目、工作空间..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            <button className="relative p-2 text-text-secondary hover:text-primary">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-light">
                <img 
                  src="https://s.coze.cn/image/EuFy7laAT1w/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full" 
                  data-category="人物"
                />
                <span className="text-sm text-text-primary">张小明</span>
                <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-border-light z-40 ${styles.sidebarTransition}`}>
        <nav className="p-4 space-y-2">
          {/* 工作空间 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">工作空间</h3>
            <div className="space-y-1">
              <Link 
                to="/workspace-list" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-layer-group w-4"></i>
                <span>工作空间管理</span>
              </Link>
            </div>
          </div>
          
          {/* 项目管理 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">项目管理</h3>
            <div className="space-y-1">
              <Link 
                to="/project-list" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-folder w-4"></i>
                <span>项目列表</span>
              </Link>
            </div>
          </div>
          
          {/* 制作流程 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">制作流程</h3>
            <div className="space-y-1">
              <Link 
                to="/script-info" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-file-alt w-4"></i>
                <span>剧本信息</span>
              </Link>
              <Link 
                to="/character-generation" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-user-friends w-4"></i>
                <span>角色IP形象</span>
              </Link>
              <Link 
                to="/voice-selection" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-microphone w-4"></i>
                <span>音色选择</span>
              </Link>
              <Link 
                to="/scenario-editor" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-film w-4"></i>
                <span>分镜脚本</span>
              </Link>
              <Link 
                to="/image-generation" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}
              >
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </Link>
              <Link 
                to="/video-generation" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </Link>
              <Link 
                to="/video-export" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-download w-4"></i>
                <span>视频导出</span>
              </Link>
            </div>
          </div>
          
          {/* 素材库 */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">素材库</h3>
            <div className="space-y-1">
              <Link 
                to="/material-library" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-palette w-4"></i>
                <span>素材库管理</span>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="ml-60 mt-16 p-6 min-h-screen">
        {/* 页面头部 */}
        <div className="mb-6">
          {/* 面包屑导航 */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-text-secondary">
              <li><Link to="/project-list" className="hover:text-primary">项目管理</Link></li>
              <li><i className="fas fa-chevron-right text-xs"></i></li>
              <li><span className="text-text-primary">樱花之恋</span></li>
              <li><i className="fas fa-chevron-right text-xs"></i></li>
              <li><span className="text-text-primary">分镜画面生成与编辑</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">分镜画面生成与编辑</h1>
              <p className="text-text-secondary">生成和调整分镜画面，打造完美的视觉效果</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBatchGenerate}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="fas fa-magic mr-2"></i>批量生成分镜画面
              </button>
              <button 
                onClick={handleSaveChanges}
                className="bg-white border border-border-light text-text-primary px-6 py-2 rounded-lg hover:bg-bg-light transition-colors"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
            </div>
          </div>
        </div>

        {/* 生成进度条 */}
        {isGeneratingProgressVisible && (
          <div className="bg-white rounded-xl shadow-card p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">正在生成分镜画面</h3>
              <span className="text-sm text-text-secondary">
                {currentGenerationProgress}/{totalGenerationShots}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-primary h-2 rounded-full ${styles.progressBar}`}
                style={{ width: `${(currentGenerationProgress / totalGenerationShots) * 100}%` }}
              ></div>
            </div>
            <div className="mt-3 text-sm text-text-secondary">
              <span>{currentGenerationTask}</span>
            </div>
          </div>
        )}

        {/* 分镜画面列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {shotDataList.map(shot => renderShotCard(shot))}
        </div>

        {/* 底部操作区 */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handlePreviousStep}
                className="px-6 py-2 border border-border-light text-text-primary rounded-lg hover:bg-bg-light transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>上一步
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-6 py-2 border border-border-light text-text-primary rounded-lg hover:bg-bg-light transition-colors"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
            </div>
            <button 
              onClick={handleNextStep}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              下一步<i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </main>

      {/* 独立修改工作流弹窗 */}
      {isEditWorkflowModalVisible && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">独立修改分镜画面</h3>
                  <button 
                    onClick={handleCloseEditWorkflow}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <p className="text-sm text-text-secondary mt-1">与AI对话，精细调整画面效果</p>
              </div>
              
              <div className="flex flex-col h-[calc(90vh-120px)]">
                {/* 当前画面预览 */}
                <div className="p-6 border-b border-border-light">
                  <h4 className="font-medium text-text-primary mb-3">当前画面</h4>
                  {currentEditingShotId && (
                    <img 
                      src={shotDataList.find(s => s.id === currentEditingShotId)?.imageUrl || 'https://s.coze.cn/image/wc9x7ikKG5Q/'} 
                      alt="当前分镜画面" 
                      className="w-full max-w-md rounded-lg" 
                      data-category="艺术"
                    />
                  )}
                </div>
                
                {/* AI对话区域 */}
                <div className="flex-1 flex flex-col">
                  <div className="p-6 border-b border-border-light">
                    <h4 className="font-medium text-text-primary mb-3">AI助手</h4>
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <i className="fas fa-robot text-white text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-text-primary">
                            你好！我可以帮你调整这个分镜画面。你希望做哪些修改呢？比如调整角色表情、改变背景、调整光线效果等。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 对话历史 */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    {chatHistory.map((message, index) => (
                      <div 
                        key={index} 
                        className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                      >
                        <div className={`${message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary'} rounded-lg p-3 max-w-md`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 输入区域 */}
                  <div className="p-6 border-t border-border-light">
                    <div className="flex space-x-3">
                      <textarea 
                        value={chatInputValue}
                        onChange={(e) => setChatInputValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChatMessage();
                          }
                        }}
                        className="flex-1 px-4 py-3 border border-border-light rounded-lg resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        rows={3} 
                        placeholder="描述你希望的画面修改..."
                      />
                      <button 
                        onClick={handleSendChatMessage}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 底部操作 */}
                <div className="p-6 border-t border-border-light">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={handleCloseEditWorkflow}
                      className="px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleApplyChanges}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <i className="fas fa-check mr-2"></i>应用修改
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerationPage;

