

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader, StepIndicator } from '../../components/Layout';
import styles from './styles.module.css';

// 在文件顶部添加音乐数据类型定义
interface MusicOption {
  id: string;
  name: string;
  duration: string;
  url: string;
}

const StaticCreateStep4: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'PROJ-001';

  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState('');
  const [subtitleFont, setSubtitleFont] = useState('PingFang SC');
  const [subtitleSize, setSubtitleSize] = useState('18');
  const [subtitleColor, setSubtitleColor] = useState('#FFFFFF');
  const [subtitleOpacity, setSubtitleOpacity] = useState(80);
  const [transitionEffect, setTransitionEffect] = useState('fade');
  const [videoDuration, setVideoDuration] = useState('auto');
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  
  // 添加模态弹窗状态
  const [isBgmModalOpen, setIsBgmModalOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI静态漫制作 - 合成最终视频 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 响应式处理
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

  // 事件处理函数
  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // 打开BGM选择模态弹窗
  const handleOpenBgmModal = () => {
    setIsBgmModalOpen(true);
  };

  // 关闭BGM选择模态弹窗
  const handleCloseBgmModal = () => {
    setIsBgmModalOpen(false);
    setCurrentlyPlaying(null);
  };

  // 选择背景音乐
  const handleSelectMusic = (musicId: string) => {
    setBackgroundMusic(musicId);
    handleCloseBgmModal();
  };

  // 试听背景音乐
  const handlePreviewMusic = (musicId: string) => {
    console.log('试听背景音乐:', musicId);
    setCurrentlyPlaying(musicId);
    // 模拟试听功能
    setTimeout(() => {
      setCurrentlyPlaying(null);
    }, 3000);
  };

  const handleGenerateVideo = () => {
    console.log('开始生成最终视频');
    setIsGeneratingVideo(true);

    // 模拟生成过程
    setTimeout(() => {
      setIsGeneratingVideo(false);
      alert('视频生成完成！');
      
      // 更新视频播放器
      const videoPlayer = document.querySelector('#video-player') as HTMLVideoElement;
      if (videoPlayer) {
        videoPlayer.src = 'https://s.coze.cn/video/generated-video.mp4';
        videoPlayer.load();
      }
    }, 3000);
  };

  const handleDownloadVideo = () => {
    console.log('下载视频');
    const link = document.createElement('a');
    link.href = 'https://s.coze.cn/video/generated-video.mp4';
    link.download = '魔法学院的秘密.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleJumpToClip = () => {
    console.log('跳转到剪映编辑');
    window.open('https://www.capcut.com/', '_blank');
  };

  const handlePrevStep = () => {
    navigate(-1);
  };

  const handleSaveDraft = () => {
    console.log('保存草稿');
    alert('草稿已保存');
    navigate('/project-manage');
  };

  const handleCompleteProject = () => {
    console.log('完成项目');
    alert('项目已完成！');
    navigate('/project-manage');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar isCollapsed={isSidebarCollapsed} activeMenu="project-manage" />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            title="AI静态漫制作 - 合成最终视频"
            breadcrumb={[
              { label: '首页', href: '/' },
              { label: '项目管理', href: '/project-manage' },
              { label: 'AI静态漫制作', active: true }
            ]}
          />

          {/* 步骤指示器 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <StepIndicator
              currentStep={4}
              steps={[
                { id: 1, title: '基础信息设置', description: '已完成' },
                { id: 2, title: '确认角色', description: '已完成' },
                { id: 3, title: '创建章节，生成分镜画面', description: '已完成' },
                { id: 4, title: '合成最终视频', description: '当前步骤' }
              ]}
              direction="horizontal"
            />
          </div>

          {/* 视频合成配置区 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">视频合成配置</h3>
            
            {/* 背景音乐选择 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="background-music">背景音乐</label>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleOpenBgmModal}
                  className={`${styles.formControl} flex-1 text-left`}
                >
                  {backgroundMusic 
                    ? musicOptions.find(music => music.id === backgroundMusic)?.name 
                    : "无背景音乐"}
                </button>
                <button 
                  onClick={() => backgroundMusic && handlePreviewMusic(backgroundMusic)}
                  disabled={!backgroundMusic}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-play mr-2"></i>试听
                </button>
              </div>
            </div>

            {/* 字幕样式设置 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>字幕样式</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">字体</label>
                  <select 
                    value={subtitleFont}
                    onChange={(e) => setSubtitleFont(e.target.value)}
                    className={styles.formControl}
                  >
                    <option value="PingFang SC">苹方</option>
                    <option value="Microsoft YaHei">微软雅黑</option>
                    <option value="SimHei">黑体</option>
                    <option value="KaiTi">楷体</option>
                    <option value="Arial">Arial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">字号</label>
                  <select 
                    value={subtitleSize}
                    onChange={(e) => setSubtitleSize(e.target.value)}
                    className={styles.formControl}
                  >
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                    <option value="22">22px</option>
                    <option value="24">24px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">颜色</label>
                  <input 
                    type="color" 
                    value={subtitleColor}
                    onChange={(e) => setSubtitleColor(e.target.value)}
                    className={styles.colorPicker}
                  />
                </div>
              </div>
            </div>

            {/* 视频配置设置 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>视频效果</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">转场效果</label>
                  <select 
                    value={transitionEffect}
                    onChange={(e) => setTransitionEffect(e.target.value)}
                    className={styles.formControl}
                  >
                    <option value="fade">AI智能转场</option>
                    <option value="none">无转场</option>
                    <option value="slide">滑动</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">输出格式</label>
                  <select 
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className={styles.formControl}
                  >
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* 视频预览区 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">视频预览</h3>
            
            {/* 视频操作按钮 */}
            <div className={styles.videoActions}>
              <button 
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                {isGeneratingVideo ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>生成中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>生成最终视频
                  </>
                )}
              </button>
              <button 
                onClick={handleDownloadVideo}
                className="px-6 py-3 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors flex items-center"
              >
                <i className="fas fa-download mr-2"></i>下载视频
              </button>
              <button 
                onClick={handleJumpToClip}
                className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
              >
                <i className="fas fa-external-link-alt mr-2"></i>一键跳转剪映编辑
              </button>
            </div>

            {/* 视频播放器 */}
            <div className={`${styles.videoContainer} mb-4`}>
              <video 
                id="video-player" 
                className={styles.videoPlayer} 
                controls 
                poster="https://s.coze.cn/image/2weePJwPwjA/"
              >
                <source src="https://s.coze.cn/image/p7vjigJCE0A/" type="video/mp4" />
                您的浏览器不支持视频播放。
              </video>
            </div>

            {/* 视频信息 */}
            <div className="bg-bg-secondary rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">项目名称：</span>
                  <span className="font-medium text-text-primary">魔法学院的秘密</span>
                </div>
                <div>
                  <span className="text-text-secondary">分辨率：</span>
                  <span className="font-medium text-text-primary">1920x1080</span>
                </div>
                <div>
                  <span className="text-text-secondary">预计时长：</span>
                  <span className="font-medium text-text-primary">2分30秒</span>
                </div>
                <div>
                  <span className="text-text-secondary">文件大小：</span>
                  <span className="font-medium text-text-primary">约 150MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePrevStep}
              className="px-6 py-3 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>上一步
            </button>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleSaveDraft}
                className="px-6 py-3 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors flex items-center"
              >
                <i className="fas fa-save mr-2"></i>保存草稿
              </button>
              <button 
                onClick={handleCompleteProject}
                className="px-6 py-3 bg-success text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <i className="fas fa-check mr-2"></i>完成项目
              </button>
            </div>
          </div>
          
          {/* BGM选择模态弹窗 */}
          {isBgmModalOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleCloseBgmModal}
            >
              <div 
                className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 弹窗头部 */}
                <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">选择BGM</h3>
                  <button 
                    onClick={handleCloseBgmModal}
                    className="p-1 rounded-lg hover:bg-bg-secondary transition-colors"
                  >
                    <i className="fas fa-times text-text-secondary"></i>
                  </button>
                </div>
                
                {/* 弹窗内容 - 音乐列表 */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                  {musicOptions.map((music) => (
                    <div 
                      key={music.id}
                      className="px-6 py-4 border-b border-border-light hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                      onClick={() => handleSelectMusic(music.id)}
                    >
                      <div>
                        <div className="font-medium text-text-primary">{music.name}</div>
                        <div className="text-sm text-text-secondary">{music.duration}</div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewMusic(music.id);
                        }}
                        className="px-3 py-1 text-primary hover:text-blue-600 transition-colors"
                      >
                        {currentlyPlaying === music.id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-play"></i>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* 弹窗底部 */}
                <div className="px-6 py-4 border-t border-border-light flex justify-end">
                  <button 
                    onClick={handleCloseBgmModal}
                    className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StaticCreateStep4;


// 音乐选项数据
const musicOptions: MusicOption[] = [
  { id: 'bgm-001', name: '轻松愉快 - 青春校园', duration: '2:30', url: 'https://s.coze.cn/music/bgm-001.mp3' },
  { id: 'bgm-002', name: '神秘悬疑 - 魔法世界', duration: '3:15', url: 'https://s.coze.cn/music/bgm-002.mp3' },
  { id: 'bgm-003', name: '温馨治愈 - 日常故事', duration: '2:45', url: 'https://s.coze.cn/music/bgm-003.mp3' },
  { id: 'bgm-004', name: '紧张刺激 - 冒险动作', duration: '3:00', url: 'https://s.coze.cn/music/bgm-004.mp3' },
  { id: 'bgm-005', name: '浪漫唯美 - 爱情故事', duration: '2:50', url: 'https://s.coze.cn/music/bgm-005.mp3' }
];


// 添加模态弹窗状态
// ...
// ...

