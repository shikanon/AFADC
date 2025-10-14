

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import styles from './styles.module.css';

interface CharacterData {
  id: string;
  name: string;
  role: string;
  images: string[];
  voice: string;
  speed: number;
  previewText: string;
  isGenerating: boolean;
}

const StaticCreateStep2: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [characters, setCharacters] = useState<CharacterData[]>([
    {
      id: '1',
      name: '艾莉丝',
      role: '主角',
      images: [
        'https://s.coze.cn/image/IT0dRq5_aSE/',
        'https://s.coze.cn/image/z0Zf2vQjCl4/',
        'https://s.coze.cn/image/V8ibaATU6XQ/'
      ],
      voice: 'voice1',
      speed: 1.0,
      previewText: '你好，我是艾莉丝，很高兴认识你！',
      isGenerating: false
    },
    {
      id: '2',
      name: '魔法师梅林',
      role: '配角',
      images: [
        'https://s.coze.cn/image/w85NtxtWPjg/',
        'https://s.coze.cn/image/koHrRVSxh0s/',
        'https://s.coze.cn/image/yRUuoFz2puI/'
      ],
      voice: 'voice5',
      speed: 0.9,
      previewText: '欢迎来到魔法学院，年轻的学徒。',
      isGenerating: false
    }
  ]);
  const [narratorVoice, setNarratorVoice] = useState('narrator1');
  const [narratorSpeed, setNarratorSpeed] = useState(1.0);
  const [narratorPreviewText, setNarratorPreviewText] = useState('在遥远的魔法王国，有一所古老的魔法学院...');
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI静态漫制作 - 确认角色 - AI漫剧速成工场';
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

  const handleSpeedChange = (characterId: string, newSpeed: number) => {
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, speed: newSpeed } : char
    ));
  };

  const handleVoiceChange = (characterId: string, newVoice: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, voice: newVoice } : char
    ));
  };

  const handlePreviewTextChange = (characterId: string, newText: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, previewText: newText } : char
    ));
  };

  const handlePreviewVoice = (characterId: string) => {
    console.log('需要调用第三方接口实现语音合成和播放功能');
    
    if (playingPreviewId === characterId) {
      setPlayingPreviewId(null);
    } else {
      setPlayingPreviewId(characterId);
      setTimeout(() => {
        setPlayingPreviewId(null);
      }, 2000);
    }
  };

  const handleGenerateCharacter = (characterId: string) => {
    console.log('需要调用AI接口重新生成角色形象');
    
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, isGenerating: true } : char
    ));

    setTimeout(() => {
      setCharacters(prev => prev.map(char => 
        char.id === characterId ? { ...char, isGenerating: false } : char
      ));
    }, 3000);
  };

  const handleSelectCharacter = (characterId: string) => {
    console.log('打开资产选择弹窗选择角色形象');
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (confirm('确定要删除这个角色吗？')) {
      setCharacters(prev => prev.filter(char => char.id !== characterId));
    }
  };

  const handleAddCharacter = () => {
    console.log('添加新角色');
  };

  const handleNarratorPreviewVoice = () => {
    console.log('需要调用第三方接口实现旁白语音合成和播放功能');
  };

  const handlePrevStep = () => {
    navigate(-1);
  };

  const handleNextStep = () => {
    navigate('/static-create-step3');
  };

  const handleSaveDraft = () => {
    console.log('保存草稿');
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
            title="AI静态漫制作 - 确认角色"
            breadcrumb={[
              { label: '首页', href: '/' },
              { label: '项目管理', href: '/project-manage' },
              { label: 'AI静态漫制作', active: true }
            ]}
          />

          {/* 步骤指示器 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <div className="flex items-start space-x-6">
              <div className={`${styles.stepIndicator} flex-1`}>
                <div className={`${styles.stepItem} ${styles.completed} mb-4`}>
                  <div className="ml-8">
                    <h3 className="font-medium text-text-primary">基础信息设置</h3>
                    <p className="text-sm text-text-secondary">设置剧本名称、画风等基础信息</p>
                  </div>
                </div>
                <div className={`${styles.stepItem} ${styles.active} mb-4`}>
                  <div className="ml-8">
                    <h3 className="font-medium text-primary">确认角色</h3>
                    <p className="text-sm text-text-secondary">创建或选择角色IP形象，配置配音</p>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <h3 className="font-medium text-text-secondary">创建章节，生成分镜画面</h3>
                    <p className="text-sm text-text-secondary">拆分剧本为分镜，生成画面</p>
                  </div>
                </div>
                <div className={styles.stepItem}>
                  <div className="ml-8">
                    <h3 className="font-medium text-text-secondary">合成最终视频</h3>
                    <p className="text-sm text-text-secondary">配置背景音乐，生成完整视频</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 角色管理区域 */}
          <div className="space-y-6">
            {/* 角色列表 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">角色设置</h3>
              
              {characters.map((character) => (
                <div key={character.id} className={`${styles.characterCard} bg-white rounded-lg border border-border-light p-6`}>
                  <div className="flex items-start space-x-6">
                    {/* 角色形象区域 */}
                    <div className="flex-1 max-w-md">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-text-primary">{character.role} - {character.name}</h4>
                        <button 
                          onClick={() => handleDeleteCharacter(character.id)}
                          className="text-danger hover:text-red-600 text-sm"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      
                      {/* 角色形象预览 */}
                      <div className="bg-bg-secondary rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-3 gap-3">
                          {character.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`角色${index === 0 ? '正面' : index === 1 ? '侧面' : '背面'}形象`} 
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* 角色操作按钮 */}
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleGenerateCharacter(character.id)}
                          disabled={character.isGenerating}
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
                        >
                          <i className={`fas ${character.isGenerating ? 'fa-spinner fa-spin' : 'fa-magic'} mr-2`}></i>
                          {character.isGenerating ? '生成中...' : '重新生成'}
                        </button>
                        <button 
                          onClick={() => handleSelectCharacter(character.id)}
                          className="flex-1 px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors text-sm"
                        >
                          <i className="fas fa-images mr-2"></i>选择资产
                        </button>
                      </div>
                    </div>
                    
                    {/* 配音配置区域 */}
                    <div className="flex-1">
                      <h5 className="font-medium text-text-primary mb-4">配音配置</h5>
                      
                      {/* 音色选择 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2">音色选择</label>
                        <div className="flex space-x-2">
                          <select 
                            value={character.voice}
                            onChange={(e) => handleVoiceChange(character.id, e.target.value)}
                            className="flex-1 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            {character.id === '1' ? (
                              <>
                                <option value="voice1">甜美少女音</option>
                                <option value="voice2">温柔女声</option>
                                <option value="voice3">活泼少女音</option>
                                <option value="voice4">成熟女声</option>
                                <option value="custom">自定义声音</option>
                              </>
                            ) : (
                              <>
                                <option value="voice5">沉稳男声</option>
                                <option value="voice6">温和男声</option>
                                <option value="voice7">威严男声</option>
                                <option value="voice8">苍老男声</option>
                                <option value="custom">自定义声音</option>
                              </>
                            )}
                          </select>
                          <button 
                            onClick={() => handlePreviewVoice(character.id)}
                            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            <i className={`fas ${playingPreviewId === character.id ? 'fa-pause' : 'fa-play'}`}></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* 音频速率 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2">音频速率</label>
                        <div className={styles.audioControls}>
                          <span className="text-sm text-text-secondary">0.5x</span>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2.0" 
                            step="0.1" 
                            value={character.speed}
                            onChange={(e) => handleSpeedChange(character.id, parseFloat(e.target.value))}
                            className={styles.rangeSlider}
                          />
                          <span className="text-sm text-text-secondary">2.0x</span>
                          <span className="text-sm font-medium text-text-primary">{character.speed}x</span>
                        </div>
                      </div>
                      
                      {/* 试听文本 */}
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">试听文本</label>
                        <textarea 
                          rows={2}
                          value={character.previewText}
                          onChange={(e) => handlePreviewTextChange(character.id, e.target.value)}
                          className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="请输入试听文本..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 新增角色按钮 */}
            <div className="text-center">
              <button 
                onClick={handleAddCharacter}
                className="px-6 py-3 border-2 border-dashed border-border-medium text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>新增角色
              </button>
            </div>
            
            {/* 旁白配置 */}
            <div className="bg-white rounded-lg border border-border-light p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">旁白配置</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 旁白音色选择 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">旁白音色</label>
                  <div className="flex space-x-2">
                    <select 
                      value={narratorVoice}
                      onChange={(e) => setNarratorVoice(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="narrator1">温和旁白</option>
                      <option value="narrator2">庄重旁白</option>
                      <option value="narrator3">亲切旁白</option>
                      <option value="narrator4">神秘旁白</option>
                      <option value="custom">自定义声音</option>
                    </select>
                    <button 
                      onClick={handleNarratorPreviewVoice}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                </div>
                
                {/* 旁白音频速率 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">旁白速率</label>
                  <div className={styles.audioControls}>
                    <span className="text-sm text-text-secondary">0.5x</span>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1" 
                      value={narratorSpeed}
                      onChange={(e) => setNarratorSpeed(parseFloat(e.target.value))}
                      className={styles.rangeSlider}
                    />
                    <span className="text-sm text-text-secondary">2.0x</span>
                    <span className="text-sm font-medium text-text-primary">{narratorSpeed}x</span>
                  </div>
                </div>
              </div>
              
              {/* 旁白试听文本 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">旁白试听文本</label>
                <textarea 
                  rows={2}
                  value={narratorPreviewText}
                  onChange={(e) => setNarratorPreviewText(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="请输入旁白试听文本..."
                />
              </div>
            </div>
          </div>
          
          {/* 操作按钮区 */}
          <div className="flex items-center justify-end space-x-4 mt-8">
            <button 
              onClick={handlePrevStep}
              className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>上一步
            </button>
            <button 
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-save mr-2"></i>保存草稿
            </button>
            <button 
              onClick={handleNextStep}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              下一步<i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </main>

      {/* 音频播放器 */}
      <audio ref={audioPlayerRef} className="hidden"></audio>
    </div>
  );
};

export default StaticCreateStep2;

