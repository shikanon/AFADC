

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface VideoClip {
  id: string;
  scenarioId: string;
  title: string;
  status: 'completed' | 'pending';
  subject: string;
  action: string;
  camera: string;
  duration: string;
  resolution: string;
  videoUrl?: string;
  posterUrl?: string;
  isEditing: boolean;
  tempSubject: string;
  tempAction: string;
  tempCamera: string;
}

const VideoGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'default-project';

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [videoClips, setVideoClips] = useState<VideoClip[]>([
    {
      id: 'video-1',
      scenarioId: 'scenario-1',
      title: '分镜 001',
      status: 'completed',
      subject: '樱花树下的少女',
      action: '缓慢行走，欣赏樱花',
      camera: '跟随镜头，缓慢推进',
      duration: '00:03',
      resolution: '1080P',
      videoUrl: 'https://s.coze.cn/image/zXHEeb4pfXc/',
      posterUrl: 'https://s.coze.cn/image/7lYE846io78/',
      isEditing: false,
      tempSubject: '',
      tempAction: '',
      tempCamera: ''
    },
    {
      id: 'video-2',
      scenarioId: 'scenario-2',
      title: '分镜 002',
      status: 'completed',
      subject: '少女与男主角相遇',
      action: '两人对视，微笑',
      camera: '特写镜头，缓慢拉远',
      duration: '00:05',
      resolution: '1080P',
      videoUrl: 'https://s.coze.cn/image/rZAaWq4sdMc/',
      posterUrl: 'https://s.coze.cn/image/EeIRyjqWFuM/',
      isEditing: false,
      tempSubject: '',
      tempAction: '',
      tempCamera: ''
    },
    {
      id: 'video-3',
      scenarioId: 'scenario-3',
      title: '分镜 003',
      status: 'pending',
      subject: '两人在樱花树下交谈',
      action: '轻松交谈，樱花飘落',
      camera: '全景镜头，轻微晃动',
      duration: '00:04',
      resolution: '1080P',
      isEditing: false,
      tempSubject: '',
      tempAction: '',
      tempCamera: ''
    }
  ]);

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const playButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '分镜视频生成与编辑 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  const handleBatchGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsGenerating(false);
            alert('分镜视频批量生成完成！');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  const handleNext = () => {
    navigate(`/video-export?projectId=${projectId}`);
  };

  const handlePrevious = () => {
    navigate(`/image-generation?projectId=${projectId}`);
  };

  const handleEditVideo = (videoId: string) => {
    setVideoClips(prev => prev.map(clip => 
      clip.id === videoId 
        ? { 
            ...clip, 
            isEditing: true,
            tempSubject: clip.subject,
            tempAction: clip.action,
            tempCamera: clip.camera
          }
        : clip
    ));
  };

  const handleApplyEdit = (videoId: string) => {
    setVideoClips(prev => prev.map(clip => 
      clip.id === videoId 
        ? { 
            ...clip, 
            isEditing: false,
            subject: clip.tempSubject,
            action: clip.tempAction,
            camera: clip.tempCamera
          }
        : clip
    ));
    alert('分镜视频设置已更新！');
  };

  const handleCancelEdit = (videoId: string) => {
    setVideoClips(prev => prev.map(clip => 
      clip.id === videoId 
        ? { 
            ...clip, 
            isEditing: false,
            tempSubject: clip.subject,
            tempAction: clip.action,
            tempCamera: clip.camera
          }
        : clip
    ));
  };

  const handleRegenerate = (videoId: string) => {
    if (confirm('确定要重新生成这个分镜视频吗？')) {
      // 模拟重新生成过程
      setTimeout(() => {
        alert('分镜视频重新生成完成！');
      }, 3000);
    }
  };

  const handlePlayVideo = (videoId: string) => {
    const video = videoRefs.current[videoId];
    const playButton = playButtonRefs.current[videoId];
    
    if (video && playButton) {
      if (video.paused) {
        video.play();
        playButton.innerHTML = '<i class="fas fa-pause mr-2"></i>暂停';
      } else {
        video.pause();
        playButton.innerHTML = '<i class="fas fa-play mr-2"></i>播放视频';
      }
    }
  };

  const handleVideoEnded = (videoId: string) => {
    const playButton = playButtonRefs.current[videoId];
    if (playButton) {
      playButton.innerHTML = '<i class="fas fa-play mr-2"></i>播放视频';
    }
  };

  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('全局搜索:', e.target.value);
  };

  const handleNotificationClick = () => {
    console.log('打开通知中心');
  };

  const handleUserMenuClick = () => {
    console.log('打开用户菜单');
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
                onChange={handleGlobalSearch}
              />
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            <button 
              className="relative p-2 text-text-secondary hover:text-primary"
              onClick={handleNotificationClick}
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-light"
                onClick={handleUserMenuClick}
              >
                <img 
                  src="https://s.coze.cn/image/eqTRly2g7iE/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full" 
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
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </Link>
              <Link 
                to="/video-generation" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}
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
              <li><span className="text-text-primary">分镜视频生成与编辑</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">分镜视频生成与编辑</h1>
              <p className="text-text-secondary">生成和编辑分镜视频，调整视频效果</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                onClick={handleBatchGenerate}
              >
                <i className="fas fa-play mr-2"></i>批量生成分镜视频
              </button>
              <button 
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isSaving 
                    ? 'bg-success text-white' 
                    : 'bg-white border border-border-light text-text-primary hover:bg-bg-light'
                }`}
                onClick={handleSave}
              >
                <i className={`${isSaving ? 'fas fa-check' : 'fas fa-save'} mr-2`}></i>
                {isSaving ? '已保存' : '保存'}
              </button>
              <button 
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
                onClick={handleNext}
              >
                <i className="fas fa-arrow-right mr-2"></i>下一步
              </button>
            </div>
          </div>
        </div>

        {/* 生成状态显示 */}
        {isGenerating && (
          <div className="bg-white rounded-xl shadow-card p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <i className="fas fa-cog fa-spin text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">正在生成分镜视频</h3>
                  <p className="text-sm text-text-secondary">预计还需要 2 分钟</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={styles.videoProgress}
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-text-secondary">{Math.round(generationProgress)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* 分镜视频列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {videoClips.map((clip) => (
            <div key={clip.id} className={`bg-white rounded-xl shadow-card ${styles.videoCardHover}`}>
              <div className="relative">
                {clip.status === 'completed' ? (
                  <>
                    <video 
                      ref={el => videoRefs.current[clip.id] = el}
                      className="w-full h-48 object-cover rounded-t-xl" 
                      controls 
                      poster={clip.posterUrl}
                      onEnded={() => handleVideoEnded(clip.id)}
                    >
                      <source src={clip.videoUrl} type="video/mp4" />
                      您的浏览器不支持视频播放。
                    </video>
                    <div className="absolute top-3 right-3">
                      <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">已完成</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <button 
                        ref={el => playButtonRefs.current[clip.id] = el}
                        className="w-full bg-black/50 text-white py-2 rounded-lg hover:bg-black/70 transition-colors"
                        onClick={() => handlePlayVideo(clip.id)}
                      >
                        <i className="fas fa-play mr-2"></i>播放视频
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                      <div className="text-center">
                        <i className="fas fa-video text-4xl text-text-secondary mb-2"></i>
                        <p className="text-sm text-text-secondary">等待生成</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-info/10 text-info px-2 py-1 rounded-full text-xs font-medium">待生成</span>
                    </div>
                  </>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-primary">{clip.title}</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-primary hover:text-primary/80 text-sm"
                      onClick={() => handleEditVideo(clip.id)}
                    >
                      <i className={`fas ${clip.isEditing ? 'fa-check' : 'fa-edit'} mr-1`}></i>
                      {clip.isEditing ? '完成' : '编辑'}
                    </button>
                    <button 
                      className="text-warning hover:text-warning/80 text-sm"
                      onClick={() => handleRegenerate(clip.id)}
                    >
                      <i className={`fas ${clip.status === 'completed' ? 'fa-redo' : 'fa-play'} mr-1`}></i>
                      {clip.status === 'completed' ? '重新生成' : '生成'}
                    </button>
                  </div>
                </div>
                
                {/* 编辑模式 */}
                {clip.isEditing && (
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">主体</label>
                      <input 
                        type="text" 
                        value={clip.tempSubject}
                        onChange={(e) => setVideoClips(prev => prev.map(c => 
                          c.id === clip.id ? { ...c, tempSubject: e.target.value } : c
                        ))}
                        className={`w-full px-3 py-2 border border-border-light rounded-lg text-sm ${styles.searchFocus}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">动作</label>
                      <input 
                        type="text" 
                        value={clip.tempAction}
                        onChange={(e) => setVideoClips(prev => prev.map(c => 
                          c.id === clip.id ? { ...c, tempAction: e.target.value } : c
                        ))}
                        className={`w-full px-3 py-2 border border-border-light rounded-lg text-sm ${styles.searchFocus}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">运镜</label>
                      <input 
                        type="text" 
                        value={clip.tempCamera}
                        onChange={(e) => setVideoClips(prev => prev.map(c => 
                          c.id === clip.id ? { ...c, tempCamera: e.target.value } : c
                        ))}
                        className={`w-full px-3 py-2 border border-border-light rounded-lg text-sm ${styles.searchFocus}`}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 text-sm"
                        onClick={() => handleApplyEdit(clip.id)}
                      >
                        <i className="fas fa-check mr-1"></i>应用
                      </button>
                      <button 
                        className="flex-1 bg-gray-200 text-text-secondary py-2 rounded-lg hover:bg-gray-300 text-sm"
                        onClick={() => handleCancelEdit(clip.id)}
                      >
                        <i className="fas fa-times mr-1"></i>取消
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 预览模式 */}
                {!clip.isEditing && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-text-secondary w-16">主体：</span>
                      <span className="text-text-primary">{clip.subject}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-text-secondary w-16">动作：</span>
                      <span className="text-text-primary">{clip.action}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-text-secondary w-16">运镜：</span>
                      <span className="text-text-primary">{clip.camera}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span><i className="fas fa-clock mr-1"></i>{clip.duration}</span>
                  <span><i className="fas fa-file-video mr-1"></i>{clip.resolution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部操作区 */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center space-x-2 px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors"
              onClick={handlePrevious}
            >
              <i className="fas fa-arrow-left"></i>
              <span>上一步</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button 
                className="px-6 py-2 bg-white border border-border-light text-text-primary rounded-lg hover:bg-bg-light transition-colors"
                onClick={handleSave}
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
              <button 
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                onClick={handleNext}
              >
                <span>下一步</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoGenerationPage;

