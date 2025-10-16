

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader, StepIndicator } from '../../components/Layout';
import styles from './styles.module.css';

interface StoryboardItem {
  id: string;
  number: number;
  characters: string[];
  script: string;
  subtitle: string; // 新增字幕字段
  imageUrl: string;
  prompt: string;
}

const StaticCreateStep3: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('第一章：魔法学院的第一天');
  const [chapterContent, setChapterContent] = useState('在一个阳光明媚的早晨，莉莉亚怀着激动的心情来到了魔法学院。这是她梦寐以求的地方，传说中这里培养了无数优秀的魔法师。学院的建筑宏伟壮观，充满了神秘的气息。莉莉亚遇到了她的第一个朋友艾米，两人很快就成为了好朋友。她们一起参观了学院的各个角落，对未来的学习生活充满了期待。');
  const [storyboardItems, setStoryboardItems] = useState<StoryboardItem[]>([
    {
      id: 'sb-001',
      number: 1,
      characters: ['莉莉亚'],
      script: '阳光明媚的早晨，莉莉亚站在魔法学院的大门前，眼中闪烁着激动的光芒。学院的建筑宏伟壮观，充满了神秘的气息。',
      subtitle: '', // 新增字幕字段，初始为空
      imageUrl: 'https://s.coze.cn/image/hXT9hwKARBE/',
      prompt: '阳光明媚的早晨，魔法学院大门前，一个年轻的女孩站在那里，眼中充满期待，建筑宏伟壮观，神秘的魔法氛围'
    },
    {
      id: 'sb-002',
      number: 2,
      characters: ['莉莉亚', '艾米'],
      script: '莉莉亚走进学院，遇到了同样新的艾米。两个女孩很快就聊了起来，发现彼此有很多共同的兴趣爱好。',
      subtitle: '', // 新增字幕字段，初始为空
      imageUrl: 'https://s.coze.cn/image/TwWQkCHpzu0/',
      prompt: '学院走廊里，两个年轻女孩在交谈，表情友好，背景是魔法学院的内部装饰'
    },
    {
      id: 'sb-003',
      number: 3,
      characters: ['莉莉亚', '艾米'],
      script: '艾米热情地带着莉莉亚参观学院的各个设施，包括图书馆、魔法练习室和餐厅。莉莉亚对这里的一切都感到新奇。',
      subtitle: '', // 新增字幕字段，初始为空
      imageUrl: 'https://s.coze.cn/image/5xjn0yDZY4Q/',
      prompt: '两个女孩在魔法学院的走廊里行走，背景是图书馆的大门，充满知识的氛围'
    },
    {
      id: 'sb-004',
      number: 4,
      characters: ['莉莉亚', '艾米'],
      script: '参观结束后，莉莉亚和艾米坐在学院的花园里，畅谈着未来的梦想和期望。夕阳的余晖洒在她们身上，为这美好的第一天画上了完美的句号。',
      subtitle: '', // 新增字幕字段，初始为空
      imageUrl: 'https://s.coze.cn/image/dDJ1MTK9Gr0/',
      prompt: '学院花园里，两个女孩坐在长椅上交谈，夕阳西下，温暖的光线洒在她们身上，充满希望氛围'
    }
  ]);

  const draggedItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI静态漫制作 - 创建章节，生成分镜画面 - AI漫剧速成工场';
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

  const handleEditStoryboard = (storyboardId: string) => {
    console.log('打开分镜编辑弹窗，分镜ID:', storyboardId);
    alert('打开分镜编辑弹窗');
  };

  const handleAddCharacter = (storyboardId: string) => {
    console.log('添加角色到分镜，分镜ID:', storyboardId);
    alert('打开角色选择弹窗');
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
                    
                    {/* 分镜信息 */}
                    <div className="flex-1">
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
                            onClick={() => handleEditStoryboard(item.id)}
                            className="text-text-secondary hover:text-text-primary text-sm" 
                            title="编辑"
                          >
                            <i className="fas fa-edit"></i>
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
                      
                      {/* 关联角色 */}
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-text-primary">关联角色:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.characters.map((character, index) => (
                              <span key={index} className={styles.characterTag}>{character}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* 分镜脚本 */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-text-primary mb-2">分镜脚本</label>
                        <textarea 
                          value={item.script}
                          onChange={(e) => handleStoryboardScriptChange(item.id, e.target.value)}
                          className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm" 
                          rows={3}
                        />
                      </div>
                      
                      {/* 新增：分镜字幕 */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-text-primary mb-2">分镜字幕</label>
                        <textarea 
                          value={item.subtitle}
                          onChange={(e) => handleStoryboardSubtitleChange(item.id, e.target.value)}
                          className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm" 
                          rows={2}
                          placeholder="请输入分镜字幕内容..."
                        />
                      </div>
                      
                      {/* 布局调整：生成提示词在左，画面预览在右 */}
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-text-primary mb-2">生成提示词</label>
                          <div className="flex items-start space-x-2">
                            <textarea 
                              value={item.prompt}
                              onChange={(e) => handleStoryboardPromptChange(item.id, e.target.value)}
                              className="flex-1 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm" 
                              rows={3}
                            />
                            {/* 新增：图片生成按钮 */}
                            <button 
                              onClick={() => handleGenerateImage(item.id)}
                              className="px-3 py-2 bg-tertiary text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                              title="生成图片"
                            >
                              <i className="fas fa-image mr-1"></i>图片生成
                            </button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-text-primary mb-2">画面预览</label>
                          <div className="relative">
                            <img 
                              src={item.imageUrl}
                              alt="分镜画面预览" 
                              className="w-32 h-20 rounded-lg object-cover border border-border-light"
                            />
                            <div className="absolute top-1 right-1">
                              <button 
                                onClick={() => handleReplaceImage(item.id)}
                                className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                              >
                                <i className="fas fa-exchange-alt text-xs text-text-secondary"></i>
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
    </div>
  );
};

export default StaticCreateStep3;

