

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import styles from './styles.module.css';

interface StoryboardItem {
  id: string;
  script: string;
  character: string;
  frameImage: string;
  hasFrame: boolean;
  hasVideo: boolean;
  videoUrl: string;
  videoPrompts: {
    subject: string;
    action: string;
    camera: string;
  };
}

const DynamicCreateStep4: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapterTitle, setChapterTitle] = useState('第一章：魔法学院的第一天');
  const [chapterContent, setChapterContent] = useState('阳光透过古老的城堡窗户，洒在艾莉丝的脸上。今天是她第一天来到魔法学院，心中充满了期待和紧张。她整理了一下自己的魔法袍，深吸一口气，推开了那扇巨大的橡木大门...');
  const [isAiSplitting, setIsAiSplitting] = useState(false);
  const [storyboardItems, setStoryboardItems] = useState<StoryboardItem[]>([
    {
      id: 'sb001',
      script: '阳光透过古老的城堡窗户，洒在艾莉丝的脸上。她站在魔法学院的大门前，眼中闪烁着期待的光芒。',
      character: '艾莉丝',
      frameImage: 'https://s.coze.cn/image/hNfiJps49OM/',
      hasFrame: true,
      hasVideo: true,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      videoPrompts: {
        subject: '艾莉丝站在魔法学院大门前',
        action: '推开大门，环顾四周',
        camera: '缓慢推镜，展现城堡宏伟'
      }
    },
    {
      id: 'sb002',
      script: '导师麦格教授出现在走廊尽头，她严肃而慈祥的目光扫过艾莉丝，微微点头示意。',
      character: '麦格教授',
      frameImage: 'https://s.coze.cn/image/ZvZHCVtCaME/',
      hasFrame: true,
      hasVideo: false,
      videoUrl: '',
      videoPrompts: {
        subject: '麦格教授站在走廊尽头',
        action: '目光扫过，微微点头',
        camera: '远景到中景，突出人物'
      }
    }
  ]);

  const draggedItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI动态漫制作 - 分镜脚本与画面生成 - AI漫剧速成工场';
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

  const handleChapterSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChapter(e.target.value);
  };

  const handleAiSplit = () => {
    setIsAiSplitting(true);
    
    setTimeout(() => {
      setIsAiSplitting(false);
      alert('AI拆书完成！已生成新的分镜脚本。');
    }, 3000);
  };

  const handleBatchGenerateFrames = () => {
    alert('开始批量生成分镜首帧，完成后将通知您。');
  };

  const handleBatchGenerateVideos = () => {
    alert('开始批量生成分镜视频，完成后将通知您。');
  };

  const handleEditStoryboard = (storyboardId: string) => {
    // 编辑分镜逻辑
  };

  const handleDeleteStoryboard = (storyboardId: string) => {
    if (confirm('确定要删除这个分镜吗？')) {
      setStoryboardItems(prev => prev.filter(item => item.id !== storyboardId));
    }
  };

  const handleEditFrame = (storyboardId: string) => {
    // 编辑分镜画面逻辑
  };

  const handleReplaceFrame = (storyboardId: string) => {
    // 替换分镜画面逻辑
  };

  const handleEditVideo = (storyboardId: string) => {
    // 编辑分镜视频逻辑
  };

  const handleGenerateVideo = (storyboardId: string) => {
    // 模拟视频生成过程
    setStoryboardItems(prev => prev.map(item => 
      item.id === storyboardId ? { ...item, hasVideo: true, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' } : item
    ));
    
    alert('分镜视频生成完成！');
  };

  const handleAddCharacter = (storyboardId: string) => {
    // 为分镜添加角色逻辑
  };

  const handleAddStoryboard = () => {
    const newStoryboard: StoryboardItem = {
      id: `sb${Date.now()}`,
      script: '',
      character: '艾莉丝',
      frameImage: '',
      hasFrame: false,
      hasVideo: false,
      videoUrl: '',
      videoPrompts: {
        subject: '',
        action: '',
        camera: ''
      }
    };
    setStoryboardItems(prev => [...prev, newStoryboard]);
    alert('新分镜已添加，请填写分镜内容。');
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: StoryboardItem) => {
    draggedItemRef.current = e.currentTarget;
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.style.opacity = '0.5';
      }
    }, 0);
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
        setStoryboardItems(prev => {
          const newItems = [...prev];
          const draggedIndex = newItems.findIndex(item => item.id === draggedId);
          const targetIndex = newItems.findIndex(item => item.id === targetItem.id);
          
          if (draggedIndex !== -1 && targetIndex !== -1) {
            const [dragged] = newItems.splice(draggedIndex, 1);
            newItems.splice(targetIndex, 0, dragged);
          }
          
          return newItems;
        });
      }
    }
  };

  const handlePrevStep = () => {
    navigate(-1);
  };

  const handleSaveDraft = () => {
    alert('草稿已保存！');
    navigate('/project-manage');
  };

  const handleNextStep = () => {
    navigate('/dynamic-create-step5');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar isCollapsed={isSidebarCollapsed} activeMenu="项目管理" />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            title="AI动态漫制作 - 分镜脚本与画面生成"
            breadcrumb={[
              { label: '首页', href: '/' },
              { label: '项目管理', href: '/project-manage' },
              { label: 'AI动态漫制作', active: true }
            ]}
          />

          {/* 步骤指示器 */}
          <div className="flex items-start space-x-6 mb-8">
            <div className={`${styles.stepIndicator} flex-1`}>
              <div className={`${styles.stepItem} ${styles.completed} mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">基础信息设置</div>
                  <div className="text-sm text-text-secondary">设置剧本基本信息</div>
                </div>
              </div>
              <div className={`${styles.stepItem} ${styles.completed} mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">确认角色</div>
                  <div className="text-sm text-text-secondary">设置角色形象和配音</div>
                </div>
              </div>
              <div className={`${styles.stepItem} ${styles.completed} mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">章节管理</div>
                  <div className="text-sm text-text-secondary">创建和管理章节内容</div>
                </div>
              </div>
              <div className={`${styles.stepItem} active mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-primary">分镜脚本与画面生成</div>
                  <div className="text-sm text-text-secondary">AI拆分剧本，生成画面</div>
                </div>
              </div>
              <div className={`${styles.stepItem} mb-4`}>
                <div className="ml-8">
                  <div className="font-medium text-text-secondary">生成分镜视频</div>
                  <div className="text-sm text-text-secondary">将画面转换为动态视频</div>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className="ml-8">
                  <div className="font-medium text-text-secondary">合成最终视频</div>
                  <div className="text-sm text-text-secondary">配置并生成最终视频</div>
                </div>
              </div>
            </div>
          </div>

          {/* 章节选择区 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">选择章节</h3>
              <button className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors">
                <i className="fas fa-sync-alt mr-1"></i>刷新章节
              </button>
            </div>
            <select 
              value={selectedChapter}
              onChange={handleChapterSelectChange}
              className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">请选择章节</option>
              <option value="chapter1">第一章：魔法学院的第一天</option>
              <option value="chapter2">第二章：神秘的图书馆</option>
              <option value="chapter3">第三章：第一次魔法测试</option>
            </select>
          </div>

          {/* 章节内容和AI拆书 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">章节内容</h3>
              <button 
                onClick={handleAiSplit}
                disabled={isAiSplitting}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isAiSplitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>拆书中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>AI拆书
                  </>
                )}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="chapter-title" className="block text-sm font-medium text-text-primary mb-2">章节标题</label>
                <input 
                  type="text" 
                  id="chapter-title" 
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="chapter-content" className="block text-sm font-medium text-text-primary mb-2">章节内容</label>
                <textarea 
                  id="chapter-content" 
                  rows={8}
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="请输入章节内容..."
                />
              </div>
            </div>
          </div>

          {/* 分镜脚本列表 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">分镜脚本</h3>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleBatchGenerateFrames}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <i className="fas fa-image mr-2"></i>批量生成分镜首帧
                </button>
                <button 
                  onClick={handleBatchGenerateVideos}
                  className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <i className="fas fa-video mr-2"></i>批量生成分镜视频
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {storyboardItems.map((item, index) => (
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
                    <div className={`${styles.dragHandle} flex flex-col justify-center`}>
                      <i className="fas fa-grip-vertical text-text-secondary"></i>
                    </div>
                    
                    {/* 分镜信息 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-text-primary">分镜 #{index + 1}</span>
                          {item.hasFrame && (
                            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">已生成画面</span>
                          )}
                          {item.hasVideo ? (
                            <span className="text-xs bg-success text-white px-2 py-1 rounded-full">已生成视频</span>
                          ) : (
                            <span className="text-xs bg-warning text-white px-2 py-1 rounded-full">待生成视频</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditStoryboard(item.id)}
                            className="text-primary hover:text-blue-600 text-sm" 
                            title="编辑分镜"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteStoryboard(item.id)}
                            className="text-danger hover:text-red-600 text-sm" 
                            title="删除分镜"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* 分镜脚本内容 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">分镜脚本</label>
                        <textarea 
                          value={item.script}
                          onChange={(e) => setStoryboardItems(prev => prev.map(i => i.id === item.id ? { ...i, script: e.target.value } : i))}
                          className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
                          rows={3}
                        />
                      </div>
                      
                      {/* 关联角色 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">关联角色</label>
                        <div className="flex items-center space-x-2">
                          <select 
                            value={item.character}
                            onChange={(e) => setStoryboardItems(prev => prev.map(i => i.id === item.id ? { ...i, character: e.target.value } : i))}
                            className="flex-1 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option>艾莉丝</option>
                            <option>导师</option>
                            <option>同学A</option>
                            <option>麦格教授</option>
                          </select>
                          <button 
                            onClick={() => handleAddCharacter(item.id)}
                            className="px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <i className="fas fa-plus mr-1"></i>添加角色
                          </button>
                        </div>
                      </div>
                      
                      {/* 分镜首帧 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">分镜首帧</label>
                        <div className="flex items-center space-x-3">
                          {item.hasFrame ? (
                            <img 
                              src={item.frameImage}
                              alt="分镜首帧" 
                              className="w-20 h-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-20 h-14 rounded-lg bg-bg-primary border border-border-medium flex items-center justify-center">
                              <i className="fas fa-image text-text-secondary"></i>
                            </div>
                          )}
                          <div className="flex-1">
                            <button 
                              onClick={() => handleEditFrame(item.id)}
                              className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors mr-2"
                            >
                              <i className="fas fa-edit mr-1"></i>编辑画面
                            </button>
                            <button 
                              onClick={() => handleReplaceFrame(item.id)}
                              className="px-3 py-1 text-sm text-secondary border border-secondary rounded-lg hover:bg-purple-50 transition-colors"
                            >
                              <i className="fas fa-exchange-alt mr-1"></i>替换画面
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 分镜视频 */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">分镜视频</label>
                        <div className="space-y-3">
                          {/* 视频播放器 */}
                          <div className="relative">
                            {item.hasVideo ? (
                              <video 
                                className={`w-full h-32 rounded-lg object-cover ${styles.videoPlayer}`} 
                                controls
                              >
                                <source src={item.videoUrl} type="video/mp4" />
                                您的浏览器不支持视频播放。
                              </video>
                            ) : (
                              <div className="w-full h-32 rounded-lg bg-bg-primary flex items-center justify-center border-2 border-dashed border-border-medium">
                                <div className="text-center">
                                  <i className="fas fa-video text-2xl text-text-secondary mb-2"></i>
                                  <div className="text-sm text-text-secondary">视频未生成</div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* 视频提示词 */}
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">视频提示词</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-text-secondary mb-1">主体</label>
                                <input 
                                  type="text" 
                                  value={item.videoPrompts.subject}
                                  onChange={(e) => setStoryboardItems(prev => prev.map(i => i.id === item.id ? { ...i, videoPrompts: { ...i.videoPrompts, subject: e.target.value } } : i))}
                                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-text-secondary mb-1">动作</label>
                                <input 
                                  type="text" 
                                  value={item.videoPrompts.action}
                                  onChange={(e) => setStoryboardItems(prev => prev.map(i => i.id === item.id ? { ...i, videoPrompts: { ...i.videoPrompts, action: e.target.value } } : i))}
                                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-text-secondary mb-1">运镜</label>
                                <input 
                                  type="text" 
                                  value={item.videoPrompts.camera}
                                  onChange={(e) => setStoryboardItems(prev => prev.map(i => i.id === item.id ? { ...i, videoPrompts: { ...i.videoPrompts, camera: e.target.value } } : i))}
                                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* 视频操作按钮 */}
                          <div className="flex items-center space-x-2">
                            {item.hasVideo ? (
                              <>
                                <button 
                                  onClick={() => handleEditVideo(item.id)}
                                  className="px-3 py-1 text-sm text-tertiary border border-tertiary rounded-lg hover:bg-green-50 transition-colors"
                                >
                                  <i className="fas fa-edit mr-1"></i>编辑视频
                                </button>
                                <button 
                                  onClick={() => handleGenerateVideo(item.id)}
                                  className="px-3 py-1 text-sm text-warning border border-warning rounded-lg hover:bg-yellow-50 transition-colors"
                                >
                                  <i className="fas fa-redo mr-1"></i>重新生成
                                </button>
                              </>
                            ) : (
                              <button 
                                onClick={() => handleGenerateVideo(item.id)}
                                className="px-3 py-1 text-sm text-tertiary border border-tertiary rounded-lg hover:bg-green-50 transition-colors"
                              >
                                <i className="fas fa-play mr-1"></i>生成视频
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 添加分镜按钮 */}
            <div className="mt-6 text-center">
              <button 
                onClick={handleAddStoryboard}
                className="px-6 py-3 border-2 border-dashed border-border-medium text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <i className="fas fa-plus text-xl mb-2 block"></i>
                <div>添加分镜</div>
              </button>
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border-light">
            <button 
              onClick={handlePrevStep}
              className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>上一步
            </button>
            <button 
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
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

export default DynamicCreateStep4;

