

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import styles from './styles.module.css';

interface CharacterData {
  id: string;
  name: string;
  imageUrl: string;
  voiceType: string;
  audioRate: number;
  isPlaying: boolean;
}

const DynamicCreateStep2: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [characters, setCharacters] = useState<CharacterData[]>([
    {
      id: '1',
      name: '艾莉丝',
      imageUrl: 'https://s.coze.cn/image/B5XsbbAbw8A/',
      voiceType: '',
      audioRate: 1.0,
      isPlaying: false
    },
    {
      id: '2',
      name: '雷克斯',
      imageUrl: 'https://s.coze.cn/image/zti5SoFmNd4/',
      voiceType: '',
      audioRate: 1.0,
      isPlaying: false
    }
  ]);
  const [narratorVoiceType, setNarratorVoiceType] = useState('');
  const [narratorAudioRate, setNarratorAudioRate] = useState(1.0);
  const [isNarratorPlaying, setIsNarratorPlaying] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI动态漫制作 - 确认角色 - AI漫剧速成工场';
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

  const handleAudioRateChange = (characterId: string | 'narrator', value: number) => {
    if (characterId === 'narrator') {
      setNarratorAudioRate(value);
    } else {
      setCharacters(prev => prev.map(char => 
        char.id === characterId ? { ...char, audioRate: value } : char
      ));
    }
  };

  const handleVoicePreview = (characterId: string | 'narrator') => {
    console.log('需要调用第三方接口实现音频试听功能');
    
    if (characterId === 'narrator') {
      setIsNarratorPlaying(true);
      setTimeout(() => setIsNarratorPlaying(false), 3000);
    } else {
      setCharacters(prev => prev.map(char => 
        char.id === characterId ? { ...char, isPlaying: true } : char
      ));
      setTimeout(() => {
        setCharacters(prev => prev.map(char => 
          char.id === characterId ? { ...char, isPlaying: false } : char
        ));
      }, 3000);
    }
  };

  const handleRegenerateCharacter = (characterId: string) => {
    console.log('需要调用AI接口重新生成角色形象');
    // 这里可以添加重新生成逻辑
  };

  const handleSelectAsset = (characterId: string) => {
    console.log('打开资产选择弹窗');
    // 实际实现中会打开 P-ASSET_SELECT_DIALOG
  };

  const handleCloneVoice = () => {
    console.log('需要调用第三方接口实现声音克隆功能');
    alert('声音克隆功能需要上传音频文件，在实际应用中会打开文件选择器');
  };

  const handleAddCharacter = () => {
    console.log('添加新角色');
    alert('在实际应用中会添加新的角色编辑卡片');
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (confirm('确定要删除这个角色吗？')) {
      console.log('删除角色');
      setCharacters(prev => prev.filter(char => char.id !== characterId));
    }
  };

  const handleViewToggle = (characterId: string, viewType: string) => {
    console.log('切换角色视图');
    // 实际实现中会切换显示不同角度的角色图片
  };

  const handleVoiceTypeChange = (characterId: string | 'narrator', voiceType: string) => {
    if (characterId === 'narrator') {
      setNarratorVoiceType(voiceType);
    } else {
      setCharacters(prev => prev.map(char => 
        char.id === characterId ? { ...char, voiceType } : char
      ));
    }
  };

  const handlePrevStep = () => {
    navigate(-1);
  };

  const handleNextStep = () => {
    navigate('/dynamic-create-step3');
  };

  const handleSaveDraft = () => {
    navigate('/project-manage');
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
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            title="AI动态漫制作 - 确认角色"
            breadcrumb={[
              { label: '首页', href: '/' },
              { label: '项目管理', href: '/project-manage' },
              { label: 'AI动态漫制作', active: true }
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
                    <p className="text-sm text-text-secondary">创建或选择角色形象，配置配音</p>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <h3 className="font-medium text-text-secondary">章节管理</h3>
                    <p className="text-sm text-text-secondary">创建和管理剧本章节</p>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <h3 className="font-medium text-text-secondary">分镜脚本与画面生成</h3>
                    <p className="text-sm text-text-secondary">AI拆分剧本，生成画面</p>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <h3 className="font-medium text-text-secondary">生成分镜视频</h3>
                    <p className="text-sm text-text-secondary">将静态画面转换为动态视频</p>
                  </div>
                </div>
                <div className={styles.stepItem}>
                  <div className="ml-8">
                    <h3 className="font-medium text-text-secondary">合成最终视频</h3>
                    <p className="text-sm text-text-secondary">添加背景音乐，生成完整视频</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 角色管理区域 */}
          <div className="space-y-6">
            {/* 角色列表 */}
            <div className="bg-white rounded-lg border border-border-light p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">角色设置</h3>
                <button 
                  onClick={handleAddCharacter}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>新增角色
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <div key={character.id} className={`${styles.characterCard} bg-white border border-border-light rounded-lg p-4 shadow-card`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-text-primary">{character.name}</h4>
                      <button 
                        onClick={() => handleDeleteCharacter(character.id)}
                        className="text-danger hover:text-red-600 text-sm" 
                        title="删除角色"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    
                    {/* 角色形象 */}
                    <div className="mb-4">
                      <div className="relative mb-3">
                        <img 
                          src={character.imageUrl} 
                          alt={`${character.name}角色形象`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button 
                            onClick={() => handleViewToggle(character.id, 'front')}
                            className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm" 
                            title="正面"
                          >
                            <i className="fas fa-eye text-xs text-text-secondary"></i>
                          </button>
                          <button 
                            onClick={() => handleViewToggle(character.id, 'side')}
                            className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm" 
                            title="侧面"
                          >
                            <i className="fas fa-eye text-xs text-text-secondary"></i>
                          </button>
                          <button 
                            onClick={() => handleViewToggle(character.id, 'back')}
                            className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm" 
                            title="背面"
                          >
                            <i className="fas fa-eye text-xs text-text-secondary"></i>
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleRegenerateCharacter(character.id)}
                          className="flex-1 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          <i className="fas fa-magic mr-1"></i>重新生成
                        </button>
                        <button 
                          onClick={() => handleSelectAsset(character.id)}
                          className="flex-1 px-3 py-1 border border-border-medium text-text-primary text-sm rounded hover:bg-bg-secondary transition-colors"
                        >
                          <i className="fas fa-images mr-1"></i>选择资产
                        </button>
                      </div>
                    </div>
                    
                    {/* 配音配置 */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">选择音色</label>
                        <select 
                          value={character.voiceType}
                          onChange={(e) => handleVoiceTypeChange(character.id, e.target.value)}
                          className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">请选择音色</option>
                          {character.name === '艾莉丝' ? (
                            <>
                              <option value="female-1">甜美女声</option>
                              <option value="female-2">温柔女声</option>
                              <option value="female-3">成熟女声</option>
                              <option value="custom">自定义声音</option>
                            </>
                          ) : (
                            <>
                              <option value="male-1">阳光男声</option>
                              <option value="male-2">沉稳男声</option>
                              <option value="male-3">磁性男声</option>
                              <option value="custom">自定义声音</option>
                            </>
                          )}
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleVoicePreview(character.id)}
                          className={`flex-1 px-3 py-2 text-sm rounded ${
                            character.isPlaying 
                              ? `${styles.voicePreviewBtn} ${styles.playing}` 
                              : `${styles.voicePreviewBtn} bg-bg-secondary text-text-primary`
                          }`}
                        >
                          <i className={`fas ${character.isPlaying ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                          {character.isPlaying ? '播放中...' : '试听'}
                        </button>
                        <button 
                          onClick={handleCloneVoice}
                          className="px-3 py-2 border border-border-medium text-text-primary text-sm rounded hover:bg-bg-secondary transition-colors"
                        >
                          <i className="fas fa-microphone mr-1"></i>克隆声音
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">音频速率</label>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="range" 
                            className={`flex-1 ${styles.audioRateSlider}`}
                            min="0.5" 
                            max="2.0" 
                            step="0.1" 
                            value={character.audioRate}
                            onChange={(e) => handleAudioRateChange(character.id, parseFloat(e.target.value))}
                          />
                          <span className="text-sm text-text-primary w-12">{character.audioRate}x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 新增角色卡片 */}
                <div 
                  onClick={handleAddCharacter}
                  className={`${styles.characterCard} bg-bg-secondary border-2 border-dashed border-border-medium rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer`}
                >
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <i className="fas fa-user-plus text-3xl text-text-secondary mb-3"></i>
                    <p className="text-text-secondary">点击添加新角色</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 旁白配置 */}
            <div className="bg-white rounded-lg border border-border-light p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">旁白配置</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">选择旁白音色</label>
                    <select 
                      value={narratorVoiceType}
                      onChange={(e) => handleVoiceTypeChange('narrator', e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">请选择音色</option>
                      <option value="narrator-1">温和旁白</option>
                      <option value="narrator-2">庄重旁白</option>
                      <option value="narrator-3">活泼旁白</option>
                      <option value="custom">自定义声音</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleVoicePreview('narrator')}
                      className={`flex-1 px-3 py-2 text-sm rounded ${
                        isNarratorPlaying 
                          ? `${styles.voicePreviewBtn} ${styles.playing}` 
                          : `${styles.voicePreviewBtn} bg-bg-secondary text-text-primary`
                      }`}
                    >
                      <i className={`fas ${isNarratorPlaying ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                      {isNarratorPlaying ? '播放中...' : '试听旁白'}
                    </button>
                    <button 
                      onClick={handleCloneVoice}
                      className="px-3 py-2 border border-border-medium text-text-primary text-sm rounded hover:bg-bg-secondary transition-colors"
                    >
                      <i className="fas fa-microphone mr-1"></i>克隆声音
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">旁白速率</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="range" 
                        className={`flex-1 ${styles.audioRateSlider}`}
                        min="0.5" 
                        max="2.0" 
                        step="0.1" 
                        value={narratorAudioRate}
                        onChange={(e) => handleAudioRateChange('narrator', parseFloat(e.target.value))}
                      />
                      <span className="text-sm text-text-primary w-12">{narratorAudioRate}x</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-bg-secondary rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-3">旁白示例</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      "在一个遥远的魔法王国里，有一位勇敢的公主和一位英俊的骑士。他们将踏上一段充满冒险的旅程，去寻找传说中的神秘宝藏..."
                    </p>
                  </div>
                </div>
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
    </div>
  );
};

export default DynamicCreateStep2;

