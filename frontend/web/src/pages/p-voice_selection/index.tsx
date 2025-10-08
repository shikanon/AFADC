

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface VoiceOption {
  id: string;
  title: string;
  description: string;
}

interface AudioSettings {
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  speechPause: number;
}

const VoiceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'default';

  // 状态管理
  const [selectedCharacterVoice, setSelectedCharacterVoice] = useState<string>('character-voice-1');
  const [selectedNarratorVoice, setSelectedNarratorVoice] = useState<string>('narrator-voice-1');
  const [showCharacterPreview, setShowCharacterPreview] = useState<boolean>(false);
  const [showNarratorPreview, setShowNarratorPreview] = useState<boolean>(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [cloneProgress, setCloneProgress] = useState<number>(0);
  const [showUploadProgress, setShowUploadProgress] = useState<boolean>(false);
  const [showCloneProgress, setShowCloneProgress] = useState<boolean>(false);
  const [showCloneResult, setShowCloneResult] = useState<boolean>(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speechRate: 1.0,
    speechPitch: 1.0,
    speechVolume: 100,
    speechPause: 0.5
  });

  // 音色选项数据
  const characterVoices: VoiceOption[] = [
    { id: 'character-voice-1', title: '甜美少女', description: '温柔甜美的少女声线，适合青春校园题材' },
    { id: 'character-voice-2', title: '活泼少女', description: '充满活力的少女声线，适合开朗角色' },
    { id: 'character-voice-3', title: '成熟女性', description: '优雅成熟的女性声线，适合知性角色' },
    { id: 'character-voice-4', title: '阳光少年', description: '清爽阳光的少年声线，适合青春角色' },
    { id: 'character-voice-5', title: '沉稳青年', description: '稳重成熟的青年声线，适合领导角色' },
    { id: 'character-voice-6', title: '可爱萝莉', description: '天真可爱的萝莉声线，适合年幼角色' }
  ];

  const narratorVoices: VoiceOption[] = [
    { id: 'narrator-voice-1', title: '温和男声', description: '温和稳重的男性旁白，适合温馨故事' },
    { id: 'narrator-voice-2', title: '优雅女声', description: '优雅知性的女性旁白，适合文艺作品' },
    { id: 'narrator-voice-3', title: '深沉男声', description: '深沉有力的男性旁白，适合史诗故事' },
    { id: 'narrator-voice-4', title: '活泼女声', description: '活泼轻快的女性旁白，适合轻松故事' },
    { id: 'narrator-voice-5', title: '磁性男声', description: '富有磁性的男性旁白，适合情感故事' },
    { id: 'narrator-voice-6', title: '甜美女声', description: '甜美温柔的女性旁白，适合浪漫故事' }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '音色选择与克隆 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  // 事件处理函数
  const handleCharacterVoiceSelect = (voiceId: string) => {
    setSelectedCharacterVoice(voiceId);
    console.log(`选择角色音色: ${voiceId}`);
  };

  const handleNarratorVoiceSelect = (voiceId: string) => {
    setSelectedNarratorVoice(voiceId);
    console.log(`选择旁白音色: ${voiceId}`);
  };

  const handleCharacterPreview = () => {
    setShowCharacterPreview(true);
    console.log('显示角色音色预览');
  };

  const handleNarratorPreview = () => {
    setShowNarratorPreview(true);
    console.log('显示旁白音色预览');
  };

  const playAudioSample = (audioId: string) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(audioId);
      console.log(`播放音频样本: ${audioId}`);
      
      // 模拟音频播放时长
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('选择音频文件:', file.name);
      startFileUpload();
    }
  };

  const startFileUpload = () => {
    setShowUploadProgress(true);
    setUploadProgress(0);
    
    // 模拟上传进度
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          setShowUploadProgress(false);
          startVoiceCloning();
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const startVoiceCloning = () => {
    setShowCloneProgress(true);
    setCloneProgress(0);
    
    // 模拟克隆进度
    const cloneInterval = setInterval(() => {
      setCloneProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(cloneInterval);
          setShowCloneProgress(false);
          setShowCloneResult(true);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleUseCloneCharacter = () => {
    console.log('将克隆音色用作角色音色');
    alert('克隆音色已添加到角色音色列表');
  };

  const handleUseCloneNarrator = () => {
    console.log('将克隆音色用作旁白音色');
    alert('克隆音色已添加到旁白音色列表');
  };

  const handleSaveSettings = () => {
    const settings = {
      selectedCharacterVoice,
      selectedNarratorVoice,
      ...audioSettings,
      clonedVoiceUsed: showCloneResult
    };
    
    console.log('保存音色设置:', settings);
    showSaveSuccess();
  };

  const showSaveSuccess = () => {
    // 创建临时提示元素
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-6 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.innerHTML = '<i class="fas fa-check mr-2"></i>设置已保存';
    document.body.appendChild(toast);
    
    // 3秒后移除提示
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const handleAudioSettingsChange = (key: keyof AudioSettings, value: number) => {
    setAudioSettings(prev => ({
      ...prev,
      [key]: value
    }));
    console.log(`${key} 设置为:`, value);
  };

  const handleGlobalSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setGlobalSearchTerm(searchTerm);
    console.log('全局搜索:', searchTerm);
  };

  const handleNotificationClick = () => {
    console.log('打开通知中心');
  };

  const handleUserMenuClick = () => {
    console.log('打开用户菜单');
  };

  const getCurrentCharacterVoice = () => {
    return characterVoices.find(voice => voice.id === selectedCharacterVoice) || characterVoices[0];
  };

  const getCurrentNarratorVoice = () => {
    return narratorVoices.find(voice => voice.id === selectedNarratorVoice) || narratorVoices[0];
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
                value={globalSearchTerm}
                onChange={handleGlobalSearch}
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-text-secondary hover:text-primary"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button 
                onClick={handleUserMenuClick}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-light"
              >
                <img 
                  src="https://s.coze.cn/image/E99AUeuz7R4/" 
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
                to={`/script-info?projectId=${projectId}`} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-file-alt w-4"></i>
                <span>剧本信息</span>
              </Link>
              <Link 
                to={`/character-generation?projectId=${projectId}`} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-user-friends w-4"></i>
                <span>角色IP形象</span>
              </Link>
              <Link 
                to={`/voice-selection?projectId=${projectId}`} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}
              >
                <i className="fas fa-microphone w-4"></i>
                <span>音色选择</span>
              </Link>
              <Link 
                to={`/scenario-editor?projectId=${projectId}`} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-film w-4"></i>
                <span>分镜脚本</span>
              </Link>
              <Link 
                to={`/image-generation?projectId=${projectId}`} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </Link>
              <Link 
                to={`/video-generation?projectId=${projectId}`} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}
              >
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </Link>
              <Link 
                to={`/video-export?projectId=${projectId}`} 
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
              <li><span className="text-text-primary">音色选择与克隆</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">音色选择与克隆</h1>
              <p className="text-text-secondary">选择角色和旁白的音色，或克隆自定义音色</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveSettings}
                className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
              <Link 
                to={`/scenario-editor?projectId=${projectId}`}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="fas fa-arrow-right mr-2"></i>下一步
              </Link>
            </div>
          </div>
        </div>

        {/* 角色音色选择区 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            <i className="fas fa-user-friends text-primary mr-2"></i>角色音色
          </h2>
          <p className="text-text-secondary mb-6">为您的角色选择合适的音色</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="character-voice-select" className="block text-sm font-medium text-text-primary mb-2">选择音色</label>
              <div className="relative">
                <select 
                  id="character-voice-select"
                  value={selectedCharacterVoice}
                  onChange={(e) => handleCharacterVoiceSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-border-light rounded-lg appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {characterVoices.map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {voice.title} - {voice.description}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-secondary">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleCharacterPreview}
                className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center"
              >
                <i className="fas fa-play mr-2"></i>试听
              </button>
            </div>
          </div>
          
          {/* 音色预览区域 */}
          {showCharacterPreview && (
            <div className="mt-4 p-4 border border-border-light rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">{getCurrentCharacterVoice().title}</h3>
                  <p className="text-sm text-text-secondary">{getCurrentCharacterVoice().description}</p>
                </div>
                <button 
                  onClick={() => playAudioSample('character-preview')}
                  className={`text-primary hover:text-primary/80 ${playingAudioId === 'character-preview' ? styles.audioPlaying : ''}`}
                >
                  <i className={`fas ${playingAudioId === 'character-preview' ? 'fa-pause' : 'fa-play'} text-sm ${styles.faPlay} ${styles.faPause}`}></i>
                  <div className={`${styles.audioVisualizer} ml-2`}></div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 旁白音色选择区 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            <i className="fas fa-comment-dots text-secondary mr-2"></i>旁白音色
          </h2>
          <p className="text-text-secondary mb-6">选择适合的旁白音色来讲述故事</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="narrator-voice-select" className="block text-sm font-medium text-text-primary mb-2">选择音色</label>
              <div className="relative">
                <select 
                  id="narrator-voice-select"
                  value={selectedNarratorVoice}
                  onChange={(e) => handleNarratorVoiceSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-border-light rounded-lg appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {narratorVoices.map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {voice.title} - {voice.description}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-secondary">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleNarratorPreview}
                className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center"
              >
                <i className="fas fa-play mr-2"></i>试听
              </button>
            </div>
          </div>
          
          {/* 音色预览区域 */}
          {showNarratorPreview && (
            <div className="mt-4 p-4 border border-border-light rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-primary">{getCurrentNarratorVoice().title}</h3>
                  <p className="text-sm text-text-secondary">{getCurrentNarratorVoice().description}</p>
                </div>
                <button 
                  onClick={() => playAudioSample('narrator-preview')}
                  className={`text-primary hover:text-primary/80 ${playingAudioId === 'narrator-preview' ? styles.audioPlaying : ''}`}
                >
                  <i className={`fas ${playingAudioId === 'narrator-preview' ? 'fa-pause' : 'fa-play'} text-sm ${styles.faPlay} ${styles.faPause}`}></i>
                  <div className={`${styles.audioVisualizer} ml-2`}></div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 音色克隆区 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            <i className="fas fa-clone text-tertiary mr-2"></i>音色克隆
          </h2>
          <p className="text-text-secondary mb-6">上传音频文件，克隆独特的自定义音色</p>
          
          <div className="space-y-4">
            {/* 音频文件上传 */}
            <div className="border-2 border-dashed border-border-light rounded-lg p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <div 
                onClick={() => document.getElementById('audio-file-input')?.click()}
                className="cursor-pointer"
              >
                <i className="fas fa-cloud-upload-alt text-3xl text-text-secondary mb-3"></i>
                <p className="text-text-primary font-medium mb-2">点击上传音频文件</p>
                <p className="text-sm text-text-secondary">支持 MP3、WAV 格式，建议时长 30 秒以上</p>
                <input 
                  type="file" 
                  id="audio-file-input" 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              {/* 上传进度 */}
              {showUploadProgress && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">上传中...</span>
                    <span className="text-sm text-primary">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-border-light rounded-full h-2">
                    <div 
                      className={`bg-primary h-2 rounded-full ${styles.progressBar}`}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 克隆进度 */}
            {showCloneProgress && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">AI 克隆中...</span>
                  <span className="text-sm text-primary">{Math.round(cloneProgress)}%</span>
                </div>
                <div className="w-full bg-border-light rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r from-primary to-secondary h-2 rounded-full ${styles.progressBar}`}
                    style={{ width: `${cloneProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* 克隆结果 */}
            {showCloneResult && (
              <div>
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-success mb-1">音色克隆完成</h3>
                      <p className="text-sm text-text-secondary">您的自定义音色已准备就绪</p>
                    </div>
                    <button 
                      onClick={() => playAudioSample('cloned-voice')}
                      className={`text-success hover:text-success/80 ${playingAudioId === 'cloned-voice' ? styles.audioPlaying : ''}`}
                    >
                      <i className={`fas ${playingAudioId === 'cloned-voice' ? 'fa-pause' : 'fa-play'} text-lg ${styles.faPlay} ${styles.faPause}`}></i>
                      <div className={`${styles.audioVisualizer} ml-2`}></div>
                    </button>
                  </div>
                  <div className="mt-3 flex items-center space-x-3">
                    <button 
                      onClick={handleUseCloneCharacter}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
                    >
                      <i className="fas fa-user-friends mr-1"></i>用作角色音色
                    </button>
                    <button 
                      onClick={handleUseCloneNarrator}
                      className="px-4 py-2 border border-border-light text-text-secondary rounded-lg text-sm hover:border-primary hover:text-primary"
                    >
                      <i className="fas fa-comment-dots mr-1"></i>用作旁白音色
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 音频参数设置区 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            <i className="fas fa-sliders-h text-info mr-2"></i>音频参数设置
          </h2>
          <p className="text-text-secondary mb-6">调整语音合成的参数以获得最佳效果</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 语速设置 */}
            <div>
              <label htmlFor="speech-rate" className="block text-sm font-medium text-text-primary mb-3">
                语速 <span className="text-primary">{audioSettings.speechRate}x</span>
              </label>
              <input 
                type="range" 
                id="speech-rate" 
                min="0.5" 
                max="2.0" 
                step="0.1" 
                value={audioSettings.speechRate}
                onChange={(e) => handleAudioSettingsChange('speechRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-border-light rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>慢速</span>
                <span>快速</span>
              </div>
            </div>
            
            {/* 音调设置 */}
            <div>
              <label htmlFor="speech-pitch" className="block text-sm font-medium text-text-primary mb-3">
                音调 <span className="text-primary">{audioSettings.speechPitch}x</span>
              </label>
              <input 
                type="range" 
                id="speech-pitch" 
                min="0.5" 
                max="2.0" 
                step="0.1" 
                value={audioSettings.speechPitch}
                onChange={(e) => handleAudioSettingsChange('speechPitch', parseFloat(e.target.value))}
                className="w-full h-2 bg-border-light rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>低沉</span>
                <span>高亢</span>
              </div>
            </div>
            
            {/* 音量设置 */}
            <div>
              <label htmlFor="speech-volume" className="block text-sm font-medium text-text-primary mb-3">
                音量 <span className="text-primary">{audioSettings.speechVolume}%</span>
              </label>
              <input 
                type="range" 
                id="speech-volume" 
                min="0" 
                max="100" 
                step="5" 
                value={audioSettings.speechVolume}
                onChange={(e) => handleAudioSettingsChange('speechVolume', parseInt(e.target.value))}
                className="w-full h-2 bg-border-light rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>静音</span>
                <span>最大</span>
              </div>
            </div>
            
            {/* 停顿设置 */}
            <div>
              <label htmlFor="speech-pause" className="block text-sm font-medium text-text-primary mb-3">
                句末停顿 <span className="text-primary">{audioSettings.speechPause}秒</span>
              </label>
              <input 
                type="range" 
                id="speech-pause" 
                min="0.1" 
                max="2.0" 
                step="0.1" 
                value={audioSettings.speechPause}
                onChange={(e) => handleAudioSettingsChange('speechPause', parseFloat(e.target.value))}
                className="w-full h-2 bg-border-light rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>短</span>
                <span>长</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-card p-4">
          <Link 
            to={`/character-generation?projectId=${projectId}`}
            className="px-6 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
          >
            <i className="fas fa-arrow-left mr-2"></i>上一步
          </Link>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSaveSettings}
              className="px-6 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
            >
              <i className="fas fa-save mr-2"></i>保存
            </button>
            <Link 
              to={`/scenario-editor?projectId=${projectId}`}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <i className="fas fa-arrow-right mr-2"></i>下一步
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoiceSelectionPage;

