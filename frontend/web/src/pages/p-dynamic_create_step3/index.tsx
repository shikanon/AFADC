

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import styles from './styles.module.css';

interface Chapter {
  id: string;
  title: string;
  status: 'draft' | 'processing' | 'completed';
  content: string;
  createdAt: string;
}

interface Storyboard {
  id: string;
  script: string;
  characters: string[];
  prompt: string;
  imageUrl?: string;
  isGenerated: boolean;
}

const DynamicCreateStep3: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState('1');
  const [chapterTitle, setChapterTitle] = useState('第一章：魔法学院的开学日');
  const [chapterStatus, setChapterStatus] = useState<'draft' | 'processing' | 'completed'>('completed');
  const [chapterContent, setChapterContent] = useState(`阳光透过魔法学院的彩色玻璃窗，洒在铺满古老石板的庭院里。莉莉娅背着她的魔法书，兴奋地踏入了这座传说中的学院。今天是她第一天上课，心中充满了期待和紧张。

"莉莉娅！这边！"一个清脆的声音传来。她抬头一看，是她的好朋友艾米，正站在不远处的塔楼门口向她招手。

两个女孩手牵手走进了宏伟的教学楼。走廊两旁挂着历代校长的画像，空气中弥漫着古老魔法的气息。她们来到了教室门口，推开门，里面已经坐满了和她们一样兴奋的新生...`);

  const [storyboards, setStoryboards] = useState<Storyboard[]>([
    {
      id: '1',
      script: '阳光透过魔法学院的彩色玻璃窗，洒在铺满古老石板的庭院里。莉莉娅背着她的魔法书，兴奋地踏入了这座传说中的学院。',
      characters: ['lilya'],
      prompt: '魔法学院庭院，彩色玻璃窗，莉莉娅背着魔法书，阳光明媚，动漫风格',
      imageUrl: 'https://s.coze.cn/image/CA_MuQO9ung/',
      isGenerated: true
    },
    {
      id: '2',
      script: '"莉莉娅！这边！"一个清脆的声音传来。她抬头一看，是她的好朋友艾米，正站在不远处的塔楼门口向她招手。',
      characters: ['lilya', 'amy'],
      prompt: '塔楼门口，艾米向莉莉娅招手，阳光明媚，动漫风格',
      imageUrl: 'https://s.coze.cn/image/dxv4ZHXGn-M/',
      isGenerated: true
    },
    {
      id: '3',
      script: '两个女孩手牵手走进了宏伟的教学楼。走廊两旁挂着历代校长的画像，空气中弥漫着古老魔法的气息。',
      characters: ['lilya', 'amy'],
      prompt: '宏伟教学楼走廊，校长画像，莉莉娅和艾米手牵手，古老魔法气息，动漫风格',
      isGenerated: false
    }
  ]);

  const [chapters] = useState<Chapter[]>([
    {
      id: '1',
      title: '第一章：魔法学院的开学日',
      status: 'completed',
      content: chapterContent,
      createdAt: '2024-01-15 14:30'
    },
    {
      id: '2',
      title: '第二章：神秘的图书馆',
      status: 'draft',
      content: '',
      createdAt: '2024-01-15 16:45'
    }
  ]);

  const draggedElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI动态漫制作 - 章节管理 - AI漫剧速成工场';
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

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    const selectedChapter = chapters.find(chapter => chapter.id === chapterId);
    if (selectedChapter) {
      setChapterTitle(selectedChapter.title);
      setChapterStatus(selectedChapter.status);
      setChapterContent(selectedChapter.content);
    }
  };

  const handleAddChapter = () => {
    console.log('新增章节');
  };

  const handleEditChapter = (chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('编辑章节:', chapterId);
  };

  const handleDeleteChapter = (chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('删除章节:', chapterId);
  };

  const handleAiSplit = () => {
    console.log('执行AI拆书');
  };

  const handleGenerateStoryboards = () => {
    console.log('批量生成分镜首帧');
  };

  const handleAddStoryboard = () => {
    console.log('新增分镜');
  };

  const handleEditStoryboard = (storyboardId: string) => {
    console.log('编辑分镜:', storyboardId);
  };

  const handleReplaceImage = (storyboardId: string) => {
    console.log('替换分镜画面:', storyboardId);
  };

  const handleDeleteStoryboard = (storyboardId: string) => {
    console.log('删除分镜:', storyboardId);
  };

  const handleGenerateSingleImage = (storyboardId: string) => {
    console.log('单镜生成画面:', storyboardId);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, storyboardId: string) => {
    draggedElementRef.current = e.currentTarget;
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#E2E8F0';
    
    const draggedElement = draggedElementRef.current;
    if (draggedElement && draggedElement !== e.currentTarget) {
      const container = document.querySelector('#storyboard-list');
      if (container) {
        const afterElement = getDragAfterElement(container, e.clientY);
        
        if (afterElement == null) {
          container.appendChild(draggedElement);
        } else {
          container.insertBefore(draggedElement, afterElement);
        }
        
        console.log('分镜顺序已调整');
      }
    }
  };

  const getDragAfterElement = (container: Element, y: number) => {
    const draggableElements = [...container.querySelectorAll(`.${styles.storyboardCard}:not(.dragging)`)];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };

  const handlePrevStep = () => {
    navigate(-1);
  };

  const handleSaveDraft = () => {
    navigate('/project-manage');
  };

  const handleNextStep = () => {
    navigate('/dynamic-create-step4');
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
            title="AI动态漫制作 - 章节管理"
            breadcrumb={[
              { label: '首页', href: '/' },
              { label: '项目管理', href: '/project-manage' },
              { label: 'AI动态漫制作', active: true }
            ]}
          />

          {/* 步骤指示器 */}
          <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <div className={`flex items-start space-x-6 ${styles.stepIndicator}`}>
              <div className={`${styles.stepItem} completed`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">1. 基础信息设置</div>
                  <div className="text-sm text-text-secondary">设置项目基本信息</div>
                </div>
              </div>
              <div className={`${styles.stepItem} completed`}>
                <div className="ml-8">
                  <div className="font-medium text-text-primary">2. 确认角色</div>
                  <div className="text-sm text-text-secondary">创建和配置角色</div>
                </div>
              </div>
              <div className={`${styles.stepItem} active`}>
                <div className="ml-8">
                  <div className="font-medium text-primary">3. 章节管理</div>
                  <div className="text-sm text-text-secondary">创建和管理章节内容</div>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className="ml-8">
                  <div className="font-medium text-text-secondary">4. 分镜脚本与画面生成</div>
                  <div className="text-sm text-text-secondary">生成和编辑分镜</div>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className="ml-8">
                  <div className="font-medium text-text-secondary">5. 生成分镜视频</div>
                  <div className="text-sm text-text-secondary">生成动态视频</div>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className="ml-8">
                  <div className="font-medium text-text-secondary">6. 合成最终视频</div>
                  <div className="text-sm text-text-secondary">合成和导出视频</div>
                </div>
              </div>
            </div>
          </div>

          {/* 章节管理区域 */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* 章节列表 */}
            <div className="col-span-4">
              <div className="bg-white rounded-lg border border-border-light p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">章节列表</h3>
                  <button 
                    onClick={handleAddChapter}
                    className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-plus mr-1"></i>新增章节
                  </button>
                </div>
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <div 
                      key={chapter.id}
                      onClick={() => handleChapterSelect(chapter.id)}
                      className={`${styles.chapterItem} border rounded-lg p-3 cursor-pointer ${
                        selectedChapterId === chapter.id 
                          ? `active border-primary` 
                          : `border-border-light`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-text-primary">{chapter.title}</div>
                          <div className="text-sm text-text-secondary">{chapter.createdAt}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => handleEditChapter(chapter.id, e)}
                            className="text-primary hover:text-blue-600"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={(e) => handleDeleteChapter(chapter.id, e)}
                            className="text-danger hover:text-red-600"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 章节内容编辑 */}
            <div className="col-span-8">
              <div className="bg-white rounded-lg border border-border-light p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">章节内容</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleAiSplit}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <i className="fas fa-magic mr-2"></i>AI拆书
                    </button>
                    <button 
                      onClick={handleGenerateStoryboards}
                      className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <i className="fas fa-image mr-2"></i>批量生成分镜首帧
                    </button>
                  </div>
                </div>
                
                {/* 章节信息编辑 */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="chapter-title" className="block text-sm font-medium text-text-primary mb-2">章节标题</label>
                      <input 
                        type="text" 
                        id="chapter-title" 
                        value={chapterTitle}
                        onChange={(e) => setChapterTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="chapter-status" className="block text-sm font-medium text-text-primary mb-2">状态</label>
                      <select 
                        id="chapter-status" 
                        value={chapterStatus}
                        onChange={(e) => setChapterStatus(e.target.value as 'draft' | 'processing' | 'completed')}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="draft">草稿</option>
                        <option value="processing">处理中</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="chapter-content" className="block text-sm font-medium text-text-primary mb-2">章节内容</label>
                    <textarea 
                      id="chapter-content" 
                      rows={6}
                      value={chapterContent}
                      onChange={(e) => setChapterContent(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="请输入章节内容..."
                    />
                  </div>
                </div>

                {/* 分镜列表 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-text-primary">分镜列表</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">共 {storyboards.length} 个分镜</span>
                      <button 
                        onClick={handleAddStoryboard}
                        className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <i className="fas fa-plus mr-1"></i>添加分镜
                      </button>
                    </div>
                  </div>
                  
                  <div id="storyboard-list" className="space-y-4">
                    {storyboards.map((storyboard, index) => (
                      <div 
                        key={storyboard.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, storyboard.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`${styles.storyboardCard} bg-bg-secondary rounded-lg p-4 border border-border-light`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`${styles.dragHandle} text-text-secondary`}>
                            <i className="fas fa-grip-vertical"></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-text-primary">分镜 #{index + 1}</span>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleEditStoryboard(storyboard.id)}
                                  className="text-primary hover:text-blue-600"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  onClick={() => handleReplaceImage(storyboard.id)}
                                  className="text-secondary hover:text-purple-600"
                                >
                                  <i className="fas fa-images"></i>
                                </button>
                                <button 
                                  onClick={() => handleDeleteStoryboard(storyboard.id)}
                                  className="text-danger hover:text-red-600"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-2">
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-text-primary mb-1">脚本内容</label>
                                  <textarea 
                                    rows={3} 
                                    value={storyboard.script}
                                    onChange={(e) => {
                                      const newStoryboards = [...storyboards];
                                      newStoryboards[index].script = e.target.value;
                                      setStoryboards(newStoryboards);
                                    }}
                                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                                    placeholder="请输入分镜脚本..."
                                  />
                                </div>
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-text-primary mb-1">关联角色</label>
                                  <select 
                                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                  >
                                    <option value="">请选择角色</option>
                                    <option value="lilya" selected>莉莉娅</option>
                                    <option value="amy">艾米</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-text-primary mb-1">画面提示词</label>
                                  <input 
                                    type="text" 
                                    value={storyboard.prompt}
                                    onChange={(e) => {
                                      const newStoryboards = [...storyboards];
                                      newStoryboards[index].prompt = e.target.value;
                                      setStoryboards(newStoryboards);
                                    }}
                                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                  />
                                </div>
                              </div>
                              <div className="col-span-1">
                                <label className="block text-sm font-medium text-text-primary mb-1">分镜画面</label>
                                <div className="relative">
                                  {storyboard.isGenerated && storyboard.imageUrl ? (
                                    <img 
                                      src={storyboard.imageUrl}
                                      alt="分镜画面" 
                                      className="w-full h-32 object-cover rounded-lg border border-border-light"
                                    />
                                  ) : (
                                    <div className="w-full h-32 bg-bg-primary border-2 border-dashed border-border-medium rounded-lg flex items-center justify-center">
                                      <div className="text-center">
                                        <i className="fas fa-image text-2xl text-text-secondary mb-2"></i>
                                        <div className="text-sm text-text-secondary">待生成</div>
                                      </div>
                                    </div>
                                  )}
                                  {storyboard.isGenerated && (
                                    <div className="absolute bottom-2 right-2">
                                      <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                        <i className="fas fa-eye text-text-secondary text-xs"></i>
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-2 text-xs text-text-secondary text-center">
                                  {storyboard.isGenerated ? (
                                    <span>已生成</span>
                                  ) : (
                                    <button 
                                      onClick={() => handleGenerateSingleImage(storyboard.id)}
                                      className="text-primary hover:text-blue-600"
                                    >
                                      <i className="fas fa-magic mr-1"></i>生成画面
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
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              提示：完成章节编辑后，可继续下一步生成动态视频
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

export default DynamicCreateStep3;

