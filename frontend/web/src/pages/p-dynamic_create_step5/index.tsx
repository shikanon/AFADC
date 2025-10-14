

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import styles from './styles.module.css';

interface VideoConfig {
  backgroundMusic: string;
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
}

const DynamicCreateStep5: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'PROJ-001';
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://s.coze.cn/image/SBag16H8k8g/');
  
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({
    backgroundMusic: '',
    fontFamily: 'PingFang SC',
    fontSize: '16',
    fontColor: '#FFFFFF',
    backgroundColor: '#000000'
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI动态漫制作 - 生成分镜视频 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024 && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handlePreviewMusic = () => {
    if (videoConfig.backgroundMusic) {
      console.log('试听背景音乐:', videoConfig.backgroundMusic);
      alert('正在试听背景音乐...');
    } else {
      alert('请先选择背景音乐');
    }
  };

  const handleGenerateVideo = () => {
    setIsVideoLoading(true);
    setIsGeneratingVideo(true);
    
    setTimeout(() => {
      setIsVideoLoading(false);
      setIsGeneratingVideo(false);
      
      const newVideoUrl = 'https://s.coze.cn/video/generated-video.mp4';
      setVideoUrl(newVideoUrl);
      
      if (videoPlayerRef.current) {
        videoPlayerRef.current.src = newVideoUrl;
        videoPlayerRef.current.load();
      }
      
      alert('视频生成完成！');
      
      setTimeout(() => {
        navigate(`/project-manage?projectId=${projectId}`);
      }, 1000);
    }, 5000);
  };

  const handleDownloadVideo = () => {
    if (videoUrl) {
      console.log('下载视频:', videoUrl);
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `dynamic-comic-${projectId}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('请先生成视频');
    }
  };

  const handleJumpToClip = () => {
    if (videoUrl) {
      console.log('跳转到剪映编辑:', videoUrl);
      window.open('https://www.capcut.cn/', '_blank');
    } else {
      alert('请先生成视频');
    }
  };

  const handlePrevStep = () => {
    navigate(-1);
  };

  const handleSaveDraft = () => {
    console.log('保存草稿配置:', videoConfig);
    alert('草稿已保存');
    navigate(`/project-manage?projectId=${projectId}`);
  };

  const handleNextStep = () => {
    console.log('已完成所有制作步骤');
  };

  const handleConfigChange = (field: keyof VideoConfig, value: string) => {
    setVideoConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={styles.pageWrapper}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar isCollapsed={isSidebarCollapsed} activeMenu="项目管理" />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 */}
          <PageHeader title="AI动态漫制作 - 生成分镜视频" breadcrumb={[
            { label: '首页', href: '/' },
            { label: '项目管理', href: '/project-manage' },
            { label: 'AI动态漫制作', active: true }
          ]} />

          {/* 步骤指示器 */}
          <div className="flex items-start space-x-6 mb-8">
            <div className={`${styles.stepIndicator} flex-1`}>
              <div className={`${styles.stepItem} completed mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">基础信息设置</div>
                  <div className="text-sm text-text-secondary">设置剧本名称、画风等</div>
                </div>
              </div>
              <div className={`${styles.stepItem} completed mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">确认角色</div>
                  <div className="text-sm text-text-secondary">生成或选择角色形象</div>
                </div>
              </div>
              <div className={`${styles.stepItem} completed mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">章节管理</div>
                  <div className="text-sm text-text-secondary">创建和编辑章节内容</div>
                </div>
              </div>
              <div className={`${styles.stepItem} completed mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">分镜脚本与画面生成</div>
                  <div className="text-sm text-text-secondary">AI拆分剧本，生成画面</div>
                </div>
              </div>
              <div className={`${styles.stepItem} active mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-primary">生成分镜视频</div>
                  <div className="text-sm text-text-secondary">基于画面生成动态视频</div>
                </div>
              </div>
              <div className={`${styles.stepItem} mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-secondary">合成最终视频</div>
                  <div className="text-sm text-text-secondary">添加音乐、字幕，合成视频</div>
                </div>
              </div>
            </div>
          </div>

          {/* 视频合成配置区 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">视频合成配置</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 背景音乐选择 */}
              <div className="space-y-2">
                <label htmlFor="background-music" className="block text-sm font-medium text-text-primary">背景音乐</label>
                <select 
                  id="background-music" 
                  value={videoConfig.backgroundMusic}
                  onChange={(e) => handleConfigChange('backgroundMusic', e.target.value)}
                  className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                >
                  <option value="">无背景音乐</option>
                  <option value="bgm-001">轻松愉快 - 春日序曲</option>
                  <option value="bgm-002">神秘悬疑 - 暗夜追踪</option>
                  <option value="bgm-003">温馨治愈 - 午后阳光</option>
                  <option value="bgm-004">激昂热血 - 战斗进行曲</option>
                  <option value="bgm-005">科幻未来 - 星际迷航</option>
                </select>
                <button 
                  onClick={handlePreviewMusic}
                  className="mt-2 px-3 py-1 text-sm text-primary border border-primary rounded hover:bg-blue-50 transition-colors"
                >
                  <i className="fas fa-play mr-1"></i>试听
                </button>
              </div>

              {/* 字幕样式设置 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-text-primary">字幕样式</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="font-family" className="block text-sm text-text-secondary">字体</label>
                    <select 
                      id="font-family" 
                      value={videoConfig.fontFamily}
                      onChange={(e) => handleConfigChange('fontFamily', e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    >
                      <option value="PingFang SC">苹方</option>
                      <option value="Microsoft YaHei">微软雅黑</option>
                      <option value="SimHei">黑体</option>
                      <option value="SimSun">宋体</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="font-size" className="block text-sm text-text-secondary">字号</label>
                    <select 
                      id="font-size" 
                      value={videoConfig.fontSize}
                      onChange={(e) => handleConfigChange('fontSize', e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    >
                      <option value="14">14px</option>
                      <option value="16">16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="font-color" className="block text-sm text-text-secondary">颜色</label>
                    <input 
                      type="color" 
                      id="font-color" 
                      value={videoConfig.fontColor}
                      onChange={(e) => handleConfigChange('fontColor', e.target.value)}
                      className="w-full h-8 border border-border-light rounded-lg cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="background-color" className="block text-sm text-text-secondary">背景色</label>
                    <input 
                      type="color" 
                      id="background-color" 
                      value={videoConfig.backgroundColor}
                      onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                      className="w-full h-8 border border-border-light rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 视频预览区 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">视频预览</h3>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              {/* 视频播放器 */}
              <div className="flex-1">
                <div className="relative">
                  <video 
                    ref={videoPlayerRef}
                    className={styles.videoPlayer} 
                    controls 
                    poster="https://s.coze.cn/image/Hj28FkwFykM/"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    您的浏览器不支持视频播放。
                  </video>
                  {isVideoLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <i className={`fas fa-spinner ${styles.loadingSpinner} text-2xl mb-2`}></i>
                        <div>视频生成中...</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 视频信息 */}
                <div className="mt-4 p-4 bg-bg-secondary rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-text-secondary">分辨率</div>
                      <div className="text-text-primary font-medium">1920x1080</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">时长</div>
                      <div className="text-text-primary font-medium">02:35</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">格式</div>
                      <div className="text-text-primary font-medium">MP4</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">大小</div>
                      <div className="text-text-primary font-medium">15.2 MB</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 视频状态和操作 */}
              <div className="w-full lg:w-64 space-y-4">
                <div className="p-4 bg-bg-secondary rounded-lg">
                  <h4 className="font-medium text-text-primary mb-3">视频状态</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">分镜视频</span>
                      <span className="text-sm text-success font-medium">已完成</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">背景音乐</span>
                      <span className="text-sm text-success font-medium">已添加</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">字幕</span>
                      <span className="text-sm text-success font-medium">已生成</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <i className={`fas fa-spinner ${styles.loadingSpinner} mr-2`}></i>生成中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>生成最终视频
                      </>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleDownloadVideo}
                      className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      <i className="fas fa-download mr-1"></i>下载
                    </button>
                    <button 
                      onClick={handleJumpToClip}
                      className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <i className="fas fa-external-link-alt mr-1"></i>剪映
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePrevStep}
              className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>上一步
            </button>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveDraft}
                className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <i className="fas fa-save mr-2"></i>保存草稿
              </button>
              <button 
                onClick={handleNextStep}
                disabled
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                下一步<i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DynamicCreateStep5;

