

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface ProjectData {
  name: string;
  type: 'static' | 'dynamic';
  duration: string;
  resolution: string;
}

interface VideoConfig {
  bgm: string;
  subtitleStyle: string;
  transitionEffect: string;
}

const VideoExportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'default';

  // 状态管理
  const [selectedBgm, setSelectedBgm] = useState<string>('bgm-1');
  const [selectedSubtitleStyle, setSelectedSubtitleStyle] = useState<string>('subtitle-1');
  const [selectedTransitionEffect, setSelectedTransitionEffect] = useState<string>('transition-1');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [showProgressSection, setShowProgressSection] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('正在处理分镜画面...');
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '樱花之恋',
    type: 'static',
    duration: '3分25秒',
    resolution: '1920x1080'
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '视频合成与导出 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟项目数据
  const mockProjects: Record<string, ProjectData> = {
    'project1': { name: '樱花之恋', type: 'static', duration: '3分25秒', resolution: '1920x1080' },
    'project2': { name: '星际冒险', type: 'dynamic', duration: '5分12秒', resolution: '1920x1080' },
    'project3': { name: '魔法学院', type: 'static', duration: '8分45秒', resolution: '1920x1080' },
    'default': { name: '樱花之恋', type: 'static', duration: '3分25秒', resolution: '1920x1080' }
  };

  // 加载项目信息
  useEffect(() => {
    const project = mockProjects[projectId] || mockProjects['default'];
    setProjectData(project);
  }, [projectId]);

  // 处理背景音乐试听
  const handlePreviewBgm = () => {
    if (selectedBgm) {
      console.log('试听背景音乐:', selectedBgm);
      // 这里应该调用音频播放API
    } else {
      alert('请先选择背景音乐');
    }
  };

  // 处理字幕样式选择
  const handleSubtitleStyleSelect = (style: string) => {
    setSelectedSubtitleStyle(style);
    console.log('选择字幕样式:', style);
  };

  // 处理转场效果选择
  const handleTransitionEffectSelect = (effect: string) => {
    setSelectedTransitionEffect(effect);
    console.log('选择转场效果:', effect);
  };

  // 处理视频生成
  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setShowProgressSection(true);
    setGenerationProgress(0);
    
    const statusMessages = [
      '正在处理分镜画面...',
      '正在合成音频轨道...',
      '正在添加字幕...',
      '正在应用转场效果...',
      '正在渲染最终视频...',
      '视频合成完成！'
    ];
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 15 + 5; // 随机增加5-20%
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          
          setTimeout(() => {
            setProgressStatus(statusMessages[5]);
            setIsGeneratingVideo(false);
            
            alert('视频合成完成！');
            
            setTimeout(() => {
              setShowProgressSection(false);
            }, 2000);
          }, 500);
          
          return 100;
        }
        
        const statusIndex = Math.min(Math.floor(newProgress / 20), statusMessages.length - 2);
        setProgressStatus(statusMessages[statusIndex]);
        
        return newProgress;
      });
    }, 800);
  };

  // 处理视频下载
  const handleDownloadVideo = () => {
    console.log('下载视频:', projectId);
    // 这里应该调用文件下载API
    alert('视频下载开始！');
  };

  // 处理导出到剪映
  const handleExportToJianying = () => {
    console.log('导出到剪映:', projectId);
    // 这里应该调用剪映导出API
    alert('正在导出到剪映...');
  };

  // 处理保存配置
  const handleSaveConfig = () => {
    const config: VideoConfig = {
      bgm: selectedBgm,
      subtitleStyle: selectedSubtitleStyle,
      transitionEffect: selectedTransitionEffect
    };
    
    console.log('保存配置:', config);
    alert('配置保存成功！');
  };

  // 处理完成按钮
  const handleComplete = () => {
    navigate('/project-list');
  };

  // 处理上一步按钮
  const handlePrevStep = () => {
    if (projectData.type === 'dynamic') {
      navigate(`/video-generation?projectId=${projectId}`);
    } else {
      navigate(`/image-generation?projectId=${projectId}`);
    }
  };

  // 处理全局搜索
  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('全局搜索:', e.target.value);
  };

  // 处理通知按钮
  const handleNotificationClick = () => {
    console.log('查看通知');
  };

  // 处理用户菜单
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
                  src="https://s.coze.cn/image/YHnpY-QwN-U/" 
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
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </Link>
              <Link 
                to="/video-export" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}
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
              <li><span className="text-text-primary">{projectData.name}</span></li>
              <li><i className="fas fa-chevron-right text-xs"></i></li>
              <li><span className="text-text-primary">视频合成与导出</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">视频合成与导出</h1>
              <p className="text-text-secondary">配置最终视频样式并导出您的AI漫剧作品</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                className={`bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors ${isGeneratingVideo ? styles.btnDisabled : ''}`}
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
              >
                {isGeneratingVideo ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>生成中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>一键生成合成视频
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 视频配置区 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">视频配置</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 背景音乐选择 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">背景音乐</label>
              <select 
                className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                value={selectedBgm}
                onChange={(e) => setSelectedBgm(e.target.value)}
              >
                <option value="">无背景音乐</option>
                <option value="bgm-1">温馨钢琴曲</option>
                <option value="bgm-2">轻快流行乐</option>
                <option value="bgm-3">古典交响乐</option>
                <option value="bgm-4">现代电子乐</option>
                <option value="bgm-5">自然环境音</option>
              </select>
              <button 
                className="mt-2 px-3 py-1 text-sm text-primary hover:text-primary/80"
                onClick={handlePreviewBgm}
              >
                <i className="fas fa-play mr-1"></i>试听
              </button>
            </div>

            {/* 字幕样式选择 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">字幕样式</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`${styles.stylePreview} ${selectedSubtitleStyle === 'subtitle-1' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleSubtitleStyleSelect('subtitle-1')}
                >
                  <div className="text-center">
                    <div className="bg-black text-white px-2 py-1 rounded text-xs mb-2">标准样式</div>
                    <span className="text-xs text-text-secondary">白色文字，黑色边框</span>
                  </div>
                </div>
                <div 
                  className={`${styles.stylePreview} ${selectedSubtitleStyle === 'subtitle-2' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleSubtitleStyleSelect('subtitle-2')}
                >
                  <div className="text-center">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs mb-2">蓝色主题</div>
                    <span className="text-xs text-text-secondary">蓝色文字，白色边框</span>
                  </div>
                </div>
                <div 
                  className={`${styles.stylePreview} ${selectedSubtitleStyle === 'subtitle-3' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleSubtitleStyleSelect('subtitle-3')}
                >
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-xs mb-2">渐变样式</div>
                    <span className="text-xs text-text-secondary">紫色渐变文字</span>
                  </div>
                </div>
                <div 
                  className={`${styles.stylePreview} ${selectedSubtitleStyle === 'subtitle-4' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleSubtitleStyleSelect('subtitle-4')}
                >
                  <div className="text-center">
                    <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs mb-2">醒目样式</div>
                    <span className="text-xs text-text-secondary">黄色文字，黑色边框</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 转场效果选择 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">转场效果</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`${styles.stylePreview} ${selectedTransitionEffect === 'transition-1' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleTransitionEffectSelect('transition-1')}
                >
                  <div className="text-center">
                    <i className="fas fa-fade text-primary text-lg mb-2"></i>
                    <div className="text-xs font-medium text-text-primary">淡入淡出</div>
                    <span className="text-xs text-text-secondary">平滑过渡</span>
                  </div>
                </div>
                <div 
                  className={`${styles.stylePreview} ${selectedTransitionEffect === 'transition-2' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleTransitionEffectSelect('transition-2')}
                >
                  <div className="text-center">
                    <i className="fas fa-arrows-alt-h text-primary text-lg mb-2"></i>
                    <div className="text-xs font-medium text-text-primary">滑动切换</div>
                    <span className="text-xs text-text-secondary">左右滑动</span>
                  </div>
                </div>
                <div 
                  className={`${styles.stylePreview} ${selectedTransitionEffect === 'transition-3' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleTransitionEffectSelect('transition-3')}
                >
                  <div className="text-center">
                    <i className="fas fa-expand-arrows-alt text-primary text-lg mb-2"></i>
                    <div className="text-xs font-medium text-text-primary">缩放效果</div>
                    <span className="text-xs text-text-secondary">放大缩小</span>
                  </div>
                </div>
                <div 
                  className={`${styles.stylePreview} ${selectedTransitionEffect === 'transition-4' ? 'selected' : ''} p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleTransitionEffectSelect('transition-4')}
                >
                  <div className="text-center">
                    <i className="fas fa-sync-alt text-primary text-lg mb-2"></i>
                    <div className="text-xs font-medium text-text-primary">旋转效果</div>
                    <span className="text-xs text-text-secondary">旋转切换</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 视频预览区 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">视频预览</h2>
          
          <div className="relative">
            {/* 视频播放器 */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video className="w-full h-full object-cover" controls>
                <source src="https://s.coze.cn/video/sample-video.mp4" type="video/mp4" />
                您的浏览器不支持视频播放。
              </video>
            </div>
            
            {/* 视频信息 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span><i className="fas fa-clock mr-1"></i>时长: <span>{projectData.duration}</span></span>
                <span><i className="fas fa-video mr-1"></i>分辨率: <span>{projectData.resolution}</span></span>
                <span><i className="fas fa-file-video mr-1"></i>格式: MP4</span>
              </div>
              
              {/* 导出操作区 */}
              <div className="flex items-center space-x-3">
                <button 
                  className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition-colors"
                  onClick={handleDownloadVideo}
                >
                  <i className="fas fa-download mr-2"></i>下载视频
                </button>
                <button 
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
                  onClick={handleExportToJianying}
                >
                  <i className="fas fa-external-link-alt mr-2"></i>一键转剪映
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 生成进度区 */}
        {showProgressSection && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">视频合成进度</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">正在合成视频...</span>
                <span className="text-sm text-primary font-medium">{Math.round(generationProgress)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-primary h-2 rounded-full ${styles.videoProgress}`}
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <i className="fas fa-spinner fa-spin text-primary"></i>
                <span>{progressStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* 底部操作区 */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors"
              onClick={handlePrevStep}
            >
              <i className="fas fa-arrow-left mr-2"></i>上一步
            </button>
            <button 
              className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info/90 transition-colors"
              onClick={handleSaveConfig}
            >
              <i className="fas fa-save mr-2"></i>保存配置
            </button>
          </div>
          
          <button 
            className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
            onClick={handleComplete}
          >
            <i className="fas fa-check mr-2"></i>完成
          </button>
        </div>
      </main>
    </div>
  );
};

export default VideoExportPage;

