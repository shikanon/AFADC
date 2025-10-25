

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader, StepIndicator } from '../../components/Layout';
import CharacterSelectDialog from './CharacterSelectDialog';
import SceneSelectDialog from './SceneSelectDialog';
import styles from './styles.module.css';

interface StoryboardItem {
  id: string;
  number: number;
  characters: string[];
  scene: string; // 新增场景字段
  script: string;
  subtitle: string; // 新增字幕字段
  previewImages: string[]; // 改为数组，支持多张预览图
  prompt: string;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
}

interface Scene {
  id: string;
  name: string;
  image: string;
}

const StaticCreateStep3: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('第一章：魔法学院的第一天');
  const [chapterContent, setChapterContent] = useState('在一个阳光明媚的早晨，莉莉亚怀着激动的心情来到了魔法学院。这是她梦寐以求的地方，传说中这里培养了无数优秀的魔法师。学院的建筑宏伟壮观，充满了神秘的气息。莉莉亚遇到了她的第一个朋友艾米，两人很快就成为了好朋友。她们一起参观了学院的各个角落，对未来的学习生活充满了期待。');
  
  // 角色选择弹窗状态
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false);
  
  // 场景选择弹窗状态
  const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
  const [currentStoryboardId, setCurrentStoryboardId] = useState<string | null>(null);
  
  // 图片放大模态框状态
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string>('');
  
  // 预览图选中状态 - 为每个分镜单独管理
  const [selectedPreviewIndices, setSelectedPreviewIndices] = useState<{[key: string]: number}>({});
  
  // 可用角色数据
  const [availableCharacters] = useState<Character[]>([
    { id: 'char-001', name: '莉莉亚', avatar: 'https://s.coze.cn/image/hXT9hwKARBE/' },
    { id: 'char-002', name: '艾米', avatar: 'https://s.coze.cn/image/TwWQkCHpzu0/' },
    { id: 'char-003', name: '老师', avatar: 'https://s.coze.cn/image/5xjn0yDZY4Q/' },
    { id: 'char-004', name: '校长', avatar: 'https://s.coze.cn/image/dDJ1MTK9Gr0/' },
    { id: 'char-005', name: '同学甲', avatar: 'https://s.coze.cn/image/hXT9hwKARBE/' },
    { id: 'char-006', name: '同学乙', avatar: 'https://s.coze.cn/image/TwWQkCHpzu0/' },
  ]);
  
  // 可用场景数据
  const [availableScenes] = useState<Scene[]>([
    { id: 'scene-001', name: '魔法学院', image: 'https://s.coze.cn/image/hXT9hwKARBE/' },
    { id: 'scene-002', name: '图书馆', image: 'https://s.coze.cn/image/TwWQkCHpzu0/' },
    { id: 'scene-003', name: '花园', image: 'https://s.coze.cn/image/5xjn0yDZY4Q/' },
    { id: 'scene-004', name: '教室', image: 'https://s.coze.cn/image/dDJ1MTK9Gr0/' },
    { id: 'scene-005', name: '走廊', image: 'https://s.coze.cn/image/hXT9hwKARBE/' },
    { id: 'scene-006', name: '餐厅', image: 'https://s.coze.cn/image/TwWQkCHpzu0/' },
  ]);
  
  const [storyboardItems, setStoryboardItems] = useState<StoryboardItem[]>([
    {
      id: 'sb-001',
      number: 1,
      characters: ['莉莉亚'],
      scene: '魔法学院', // 新增场景字段
      script: '阳光明媚的早晨，莉莉亚站在魔法学院的大门前，眼中闪烁着激动的光芒。学院的建筑宏伟壮观，充满了神秘的气息。',
      subtitle: '', // 新增字幕字段，初始为空
      previewImages: [
        'https://s.coze.cn/image/hXT9hwKARBE/',
        'https://s.coze.cn/image/TwWQkCHpzu0/',
        'https://s.coze.cn/image/5xjn0yDZY4Q/'
      ], // 每个分镜3张预览图
      prompt: '阳光明媚的早晨，魔法学院大门前，一个年轻的女孩站在那里，眼中充满期待，建筑宏伟壮观，神秘的魔法氛围'
    },
    {
      id: 'sb-002',
      number: 2,
      characters: ['莉莉亚', '艾米'],
      scene: '走廊', // 新增场景字段
      script: '莉莉亚走进学院，遇到了同样新的艾米。两个女孩很快就聊了起来，发现彼此有很多共同的兴趣爱好。',
      subtitle: '', // 新增字幕字段，初始为空
      previewImages: [
        'https://s.coze.cn/image/TwWQkCHpzu0/',
        'https://s.coze.cn/image/5xjn0yDZY4Q/',
        'https://s.coze.cn/image/dDJ1MTK9Gr0/'
      ], // 每个分镜3张预览图
      prompt: '学院走廊里，两个年轻女孩在交谈，表情友好，背景是魔法学院的内部装饰'
    },
    {
      id: 'sb-003',
      number: 3,
      characters: ['莉莉亚', '艾米'],
      scene: '图书馆', // 新增场景字段
      script: '艾米热情地带着莉莉亚参观学院的各个设施，包括图书馆、魔法练习室和餐厅。莉莉亚对这里的一切都感到新奇。',
      subtitle: '', // 新增字幕字段，初始为空
      previewImages: [
        'https://s.coze.cn/image/5xjn0yDZY4Q/',
        'https://s.coze.cn/image/dDJ1MTK9Gr0/',
        'https://s.coze.cn/image/hXT9hwKARBE/'
      ], // 每个分镜3张预览图
      prompt: '两个女孩在魔法学院的走廊里行走，背景是图书馆的大门，充满知识的氛围'
    },
    {
      id: 'sb-004',
      number: 4,
      characters: ['莉莉亚', '艾米'],
      scene: '花园', // 新增场景字段
      script: '参观结束后，莉莉亚和艾米坐在学院的花园里，畅谈着未来的梦想和期望。夕阳的余晖洒在她们身上，为这美好的第一天画上了完美的句号。',
      subtitle: '', // 新增字幕字段，初始为空
      previewImages: [
        'https://s.coze.cn/image/dDJ1MTK9Gr0/',
        'https://s.coze.cn/image/hXT9hwKARBE/',
        'https://s.coze.cn/image/TwWQkCHpzu0/'
      ], // 每个分镜3张预览图
      prompt: '学院花园里，两个女孩坐在长椅上交谈，夕阳西下，温暖的光线洒在她们身上，充满希望氛围'
    }
  ]);

  const draggedItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI静态漫制作 - 创建章节，生成分镜画面 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化每个分镜的选中状态
  useEffect(() => {
    const initialStates: {[key: string]: number} = {};
    storyboardItems.forEach(item => {
      if (!(item.id in selectedPreviewIndices)) {
        initialStates[item.id] = 0; // 默认选中第一张预览图
      }
    });
    
    if (Object.keys(initialStates).length > 0) {
      setSelectedPreviewIndices(prev => ({
        ...prev,
        ...initialStates
      }));
    }
  }, [storyboardItems]);

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

  const handleAiSplit = () => {
    console.log('调用AI拆书功能');
    alert('AI拆书功能正在处理中...');
  };

  const handleBatchGenerate = () => {
    console.log('批量生成分镜画面');
    alert('正在批量生成分镜画面，请稍候...');
  };

  // 新增：处理单个图片生成
  const handleGenerateImage = (storyboardId: string) => {
    console.log('生成单个分镜图片，分镜ID:', storyboardId);
    alert('正在生成分镜图片，请稍候...');
  };

  const handleAddCharacter = (storyboardId: string) => {
    setCurrentStoryboardId(storyboardId);
    setIsCharacterDialogOpen(true);
  };

  // 处理角色选择确认
  const handleCharacterSelectionConfirm = (selectedCharacterIds: string[]) => {
    if (!currentStoryboardId) return;
    
    // 将选中的角色ID转换为角色名称
    const selectedCharacterNames = selectedCharacterIds.map(id => {
      const character = availableCharacters.find(char => char.id === id);
      return character ? character.name : '';
    }).filter(name => name !== '');
    
    // 更新分镜项的角色列表
    setStoryboardItems(prevItems =>
      prevItems.map(item =>
        item.id === currentStoryboardId 
          ? { ...item, characters: selectedCharacterNames } 
          : item
      )
    );
    
    // 重置状态
    setCurrentStoryboardId(null);
  };

  // 关闭角色选择弹窗
  const handleCloseCharacterDialog = () => {
    setIsCharacterDialogOpen(false);
    setCurrentStoryboardId(null);
  };

  // 处理场景选择
  const handleAddScene = (storyboardId: string) => {
    setCurrentStoryboardId(storyboardId);
    setIsSceneDialogOpen(true);
  };

  // 处理场景选择确认
  const handleSceneSelectionConfirm = (selectedSceneId: string, storyboardId: string) => {
    if (!currentStoryboardId) return;
    
    // 将选中的场景ID转换为场景名称
    const selectedSceneName = availableScenes.find(scene => scene.id === selectedSceneId)?.name || '';
    
    // 更新分镜项的场景
    setStoryboardItems(prevItems =>
      prevItems.map(item =>
        item.id === currentStoryboardId 
          ? { ...item, scene: selectedSceneName } 
          : item
      )
    );
    
    // 重置状态
    setCurrentStoryboardId(null);
  };

  // 关闭场景选择弹窗
  const handleCloseSceneDialog = () => {
    setIsSceneDialogOpen(false);
    setCurrentStoryboardId(null);
  };

  // 处理预览图选中
  const handlePreviewSelect = (storyboardId: string, index: number) => {
    setSelectedPreviewIndices(prev => ({
      ...prev,
      [storyboardId]: index
    }));
  };

  // 处理存入资产库
  const handleSaveToAssetLibrary = () => {
    // 显示成功提示
    alert('成功存入资产库');
  };

  // 打开图片放大模态框
  const handleOpenImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  // 关闭图片放大模态框
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageUrl('');
  };

  const handleDeleteStoryboard = (storyboardId: string) => {
    console.log('删除分镜，分镜ID:', storyboardId);
    if (confirm('确定要删除这个分镜吗？')) {
      setStoryboardItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.id !== storyboardId);
        return updatedItems.map((item, index) => ({ ...item, number: index + 1 }));
      });
    }
  };

  const handleReplaceImage = (storyboardId: string) => {
    console.log('替换分镜图片，分镜ID:', storyboardId);
    alert('打开资产选择弹窗');
  };

  const handleStoryboardScriptChange = (storyboardId: string, newScript: string) => {
    setStoryboardItems(prevItems =>
      prevItems.map(item =>
        item.id === storyboardId ? { ...item, script: newScript } : item
      )
    );
  };

  // 新增：处理分镜字幕变化
  const handleStoryboardSubtitleChange = (storyboardId: string, newSubtitle: string) => {
    setStoryboardItems(prevItems =>
      prevItems.map(item =>
        item.id === storyboardId ? { ...item, subtitle: newSubtitle } : item
      )
    );
  };

  const handleStoryboardPromptChange = (storyboardId: string, newPrompt: string) => {
    setStoryboardItems(prevItems =>
      prevItems.map(item =>
        item.id === storyboardId ? { ...item, prompt: newPrompt } : item
      )
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: StoryboardItem) => {
    draggedItemRef.current = e.currentTarget;
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    draggedItemRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#3B82F6';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = '#E2E8F0';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetItem: StoryboardItem) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#E2E8F0';
    
    if (draggedItemRef.current) {
      const draggedId = draggedItemRef.current.dataset.storyboardId;
      if (draggedId && draggedId !== targetItem.id) {
        setStoryboardItems(prevItems => {
          const newItems = [...prevItems];
          const draggedIndex = newItems.findIndex(item => item.id === draggedId);
          const targetIndex = newItems.findIndex(item => item.id === targetItem.id);
          
          [newItems[draggedIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[draggedIndex]];
          
          return newItems.map((item, index) => ({ ...item, number: index + 1 }));
        });
      }
    }
  };

  const handlePrevStep = () => {
    const projectId = searchParams.get('projectId') || 'default';
    navigate(`/static-create-step2?projectId=${projectId}`);
  };

  const handleSaveDraft = () => {
    const projectId = searchParams.get('projectId') || 'default';
    navigate(`/project-manage?projectId=${projectId}`);
  };

  const handleNextStep = () => {
    const projectId = searchParams.get('projectId') || 'default';
    navigate(`/static-create-step4?projectId=${projectId}`);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar isCollapsed={isSidebarCollapsed} activeMenu="project-manage" />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            title="AI静态漫制作 - 创建章节，生成分镜画面"
            breadcrumb={[
              { label: '首页', href: '/' },
              { label: '项目管理', href: '/project-manage' },
              { label: 'AI静态漫制作', active: true }
            ]}
          />

          {/* 步骤指示器 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <StepIndicator
              currentStep={3}
              steps={[
                { id: 1, title: '基础信息设置', description: '设置剧本名称、画风等' },
                { id: 2, title: '确认角色', description: '创建或选择角色IP' },
                { id: 3, title: '创建章节，生成分镜画面', description: '拆分剧本，生成画面' },
                { id: 4, title: '合成最终视频', description: '配置并生成视频' }
              ]}
              direction="horizontal"
            />
          </div>

          {/* 章节输入区 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">章节内容</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="chapter-title" className="block text-sm font-medium text-text-primary mb-2">章节标题</label>
                <input 
                  type="text" 
                  id="chapter-title" 
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="chapter-content" className="block text-sm font-medium text-text-primary mb-2">章节内容</label>
                <textarea 
                  id="chapter-content" 
                  rows={6}
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="请输入章节的详细内容..."
                />
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleAiSplit}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <i className="fas fa-magic mr-2"></i>AI拆书
                </button>
              </div>
            </div>
          </div>

          {/* 分镜列表 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">分镜列表</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-secondary">共 <span>{storyboardItems.length}</span> 个分镜</span>
                <button 
                  onClick={handleBatchGenerate}
                  className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <i className="fas fa-play mr-2"></i>批量生成分镜画面
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {storyboardItems.map((item) => (
                <div 
                  key={item.id}
                  data-storyboard-id={item.id}
                  className={`${styles.storyboardCard} bg-bg-secondary rounded-lg p-4 border border-border-light`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item)}
                >
                  <div className="flex items-start space-x-4">
                    {/* 拖拽手柄 */}
                    <div className={`${styles.dragHandle} flex flex-col justify-center space-y-1`}>
                      <i className="fas fa-grip-vertical text-text-secondary"></i>
                    </div>
                    
                    {/* 分镜信息 - 左右分栏布局 */}
                    <div className={`flex-1 ${styles.storyboardLayout}`}>
                      {/* 左列：关联角色、关联场景、分镜脚本、分镜字幕 */}
                      <div className={styles.leftColumn}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-text-primary">分镜 #{item.number}</span>
                            <span className="text-xs text-text-secondary">ID: {item.id.toUpperCase()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleAddCharacter(item.id)}
                              className="text-primary hover:text-blue-600 text-sm" 
                              title="添加角色"
                            >
                              <i className="fas fa-user-plus"></i>
                            </button>
                            <button 
                              onClick={() => handleAddScene(item.id)}
                              className="text-primary hover:text-blue-600 text-sm" 
                              title="添加场景"
                            >
                              <i className="fas fa-image"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteStoryboard(item.id)}
                              className="text-danger hover:text-red-600 text-sm" 
                              title="删除"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        
                        {/* 关联角色和关联场景 - 同一行显示 */}
                        <div className="flex space-x-4">
                          {/* 关联角色 */}
                          <div className="flex-1">
                            <label className={styles.unifiedLabel}>关联角色</label>
                            <div className="flex flex-wrap gap-1">
                              {item.characters.map((character, index) => (
                                <span key={index} className={styles.characterTag}>{character}</span>
                              ))}
                            </div>
                          </div>
                          
                          {/* 关联场景 */}
                          <div className="flex-1">
                            <label className={styles.unifiedLabel}>关联场景</label>
                            <div className="flex flex-wrap gap-1">
                              {item.scene && (
                                <span className={styles.sceneTag}>{item.scene}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* 分镜脚本 */}
                        <div>
                          <label className={styles.unifiedLabel}>分镜脚本</label>
                          <textarea 
                            value={item.script}
                            onChange={(e) => handleStoryboardScriptChange(item.id, e.target.value)}
                            className={`${styles.fixedHeightTextarea} ${styles.scriptTextarea}`}
                          />
                        </div>
                        
                        {/* 分镜字幕 */}
                        <div>
                          <label className={styles.unifiedLabel}>分镜字幕</label>
                          <textarea 
                            value={item.subtitle}
                            onChange={(e) => handleStoryboardSubtitleChange(item.id, e.target.value)}
                            className={`${styles.fixedHeightTextarea} ${styles.subtitleTextarea}`}
                            placeholder="请输入分镜字幕内容..."
                          />
                        </div>
                      </div>
                      
                      {/* 右列：生成提示词、画面预览 */}
                      <div className={styles.rightColumn}>
                        {/* 生成提示词 */}
                        <div>
                          <label className={styles.unifiedLabel}>生成提示词</label>
                          <textarea 
                            value={item.prompt}
                            onChange={(e) => handleStoryboardPromptChange(item.id, e.target.value)}
                            className={`${styles.fixedHeightTextarea} ${styles.scriptTextarea}`}
                          />
                        </div>
                        
                        {/* 画面预览 */}
                        <div>
                          <label className={styles.unifiedLabel}>画面预览</label>
                          <div className={styles.previewContainer}>
                            {/* 预览图横向排列 */}
                            <div className={styles.previewImagesContainer}>
                              {item.previewImages.map((previewImage, index) => (
                                <div 
                                  key={index}
                                  className={`${styles.previewImageWrapper} ${selectedPreviewIndices[item.id] === index ? styles.selected : ''}`}
                                  onClick={() => handlePreviewSelect(item.id, index)}
                                >
                                  <img 
                                    src={previewImage}
                                    alt={`预览图 ${index + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                            {/* 按钮区域 - 图片生成、图片放大和存入资产库 */}
                            <div className={styles.buttonContainer}>
                              <button 
                                onClick={() => handleGenerateImage(item.id)}
                                className={styles.generateImageButton}
                                title="生成图片"
                              >
                                <i className="fas fa-image mr-2"></i>图片生成
                              </button>
                              <button 
                                onClick={() => handleOpenImageModal(item.previewImages[selectedPreviewIndices[item.id]])}
                                className={styles.enlargeImageButton}
                                title="放大图片"
                              >
                                <i className="fas fa-search-plus mr-2"></i>图片放大
                              </button>
                              <button 
                                onClick={handleSaveToAssetLibrary}
                                className={styles.saveToAssetButton}
                              >
                                <i className="fas fa-save mr-2"></i>存入资产库
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              <i className="fas fa-info-circle mr-1"></i>
              提示：您可以拖拽分镜卡片调整顺序，点击编辑按钮进行详细编辑
            </div>
            <div className="flex items-center space-x-3">
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
        </div>
      </main>
      
      {/* 角色选择弹窗 */}
      <CharacterSelectDialog
        isOpen={isCharacterDialogOpen}
        onClose={handleCloseCharacterDialog}
        onConfirm={handleCharacterSelectionConfirm}
        availableCharacters={availableCharacters}
        initiallySelected={
          currentStoryboardId 
            ? storyboardItems.find(item => item.id === currentStoryboardId)?.characters.map(name => {
                const character = availableCharacters.find(char => char.name === name);
                return character ? character.id : '';
              }).filter(id => id !== '') || []
            : []
        }
        storyboardId={currentStoryboardId || ''}
      />
      
      {/* 场景选择弹窗 */}
      <SceneSelectDialog
        isOpen={isSceneDialogOpen}
        onClose={handleCloseSceneDialog}
        onConfirm={handleSceneSelectionConfirm}
        availableScenes={availableScenes}
        initiallySelected={
          currentStoryboardId 
            ? storyboardItems.find(item => item.id === currentStoryboardId)?.scene || ''
            : ''
        }
        storyboardId={currentStoryboardId || ''}
      />
      
      {/* 图片放大模态框 */}
      {isImageModalOpen && (
        <div className={styles.imageModalOverlay} onClick={handleCloseImageModal}>
          <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.imageModalCloseButton}
              onClick={handleCloseImageModal}
              title="关闭"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className={styles.imageModalImageContainer}>
              <img 
                src={modalImageUrl} 
                alt="放大图片" 
                className={styles.imageModalImage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticCreateStep3;

