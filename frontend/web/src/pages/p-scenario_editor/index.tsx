

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface Scenario {
  id: string;
  index: number;
  shotDescription: string;
  relatedCharacters: string[];
  narratorText: string;
  dialogueText: string;
}

const ScenarioEditor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'default';

  // 状态管理
  const [fullScriptContent, setFullScriptContent] = useState('樱花飞舞的三月，校园里充满了春天的气息。\n\n第一幕：樱花树下的相遇\n(场景：学校樱花大道)\n(人物：小雨、小风)\n\n小雨：(看着飘落的樱花，轻声感叹) 樱花真的好美啊...\n小风：(从身后走来，微笑着) 是啊，每年这个时候都是最美的。\n\n小雨：(惊讶地回头) 啊，你是...\n小风：我是学生会的小风，你是新来的转学生小雨吧？我看过你的资料。\n\n小雨：(脸红) 是的，我是小雨。谢谢你的照顾。\n小风：不用客气，以后有什么需要帮忙的都可以找我。\n\n第二幕：图书馆的约定\n(场景：学校图书馆)\n(人物：小雨、小风)\n\n小雨：(正在找书，不小心碰到了书架) 啊！\n小风：(及时扶住小雨) 小心点，这里的书很多。\n小雨：(感激地) 谢谢你，又麻烦你了。\n小风：没关系，我正好也来借书。你在找什么书？\n\n小雨：我在找关于日本文学的书，想了解更多樱花的文化。\n小风：真巧，我对这个也很感兴趣。不如我们一起看吧？\n\n小雨：(开心地) 好啊！那太好了！\n\n第三幕：黄昏的告白\n(场景：学校屋顶)\n(人物：小雨、小风)\n\n小风：(看着夕阳) 小雨，有件事我想告诉你很久了。\n小雨：(心跳加速) 什么事？\n小风：自从第一次在樱花树下遇见你，我就...\n\n(夕阳下，两个年轻人的身影被拉得很长，樱花的花瓣在空中飞舞，仿佛在见证这个美好的时刻。)');
  const [scenarioList, setScenarioList] = useState<Scenario[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDeleteScenarioId, setCurrentDeleteScenarioId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '分镜脚本生成与编辑 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  // 字数统计
  const scriptWordCount = fullScriptContent.length;

  // AI拆分分镜
  const handleAiSplitScenario = () => {
    const scriptContent = fullScriptContent.trim();
    if (!scriptContent) {
      alert('请先输入剧本内容');
      return;
    }

    setIsAiProcessing(true);

    // 模拟AI处理过程
    setTimeout(() => {
      const generatedScenarios: Scenario[] = [
        {
          id: 'scenario-1',
          index: 1,
          shotDescription: '樱花飞舞的校园樱花大道，小雨站在樱花树下，抬头看着飘落的樱花花瓣，表情温柔而陶醉。背景是粉色的樱花和绿色的草地，营造出浪漫的春日氛围。',
          relatedCharacters: ['小雨'],
          narratorText: '樱花飞舞的三月，校园里充满了春天的气息。小雨站在樱花树下，感受着这美好的季节。',
          dialogueText: '小雨：(轻声感叹) 樱花真的好美啊...'
        },
        {
          id: 'scenario-2',
          index: 2,
          shotDescription: '小风从樱花树后走出，面带微笑地看着小雨。两人的位置形成自然的对话构图，樱花花瓣在两人之间飘落。',
          relatedCharacters: ['小雨', '小风'],
          narratorText: '就在这时，学生会的小风恰好路过，被小雨的身影吸引。',
          dialogueText: '小风：(微笑着) 是啊，每年这个时候都是最美的。\n小雨：(惊讶地回头) 啊，你是...\n小风：我是学生会的小风，你是新来的转学生小雨吧？我看过你的资料。\n小雨：(脸红) 是的，我是小雨。谢谢你的照顾。\n小风：不用客气，以后有什么需要帮忙的都可以找我。'
        },
        {
          id: 'scenario-3',
          index: 3,
          shotDescription: '图书馆内景，书架林立，光线柔和。小雨正在寻找书籍，不小心碰到了书架，小风及时出现扶住了她。',
          relatedCharacters: ['小雨', '小风'],
          narratorText: '几天后，在学校图书馆，两人再次相遇。',
          dialogueText: '小雨：(正在找书，不小心碰到了书架) 啊！\n小风：(及时扶住小雨) 小心点，这里的书很多。\n小雨：(感激地) 谢谢你，又麻烦你了。\n小风：没关系，我正好也来借书。你在找什么书？\n小雨：我在找关于日本文学的书，想了解更多樱花的文化。\n小风：真巧，我对这个也很感兴趣。不如我们一起看吧？\n小雨：(开心地) 好啊！那太好了！'
        },
        {
          id: 'scenario-4',
          index: 4,
          shotDescription: '学校屋顶，黄昏时分，夕阳染红了天空。小雨和小风并肩站在栏杆边，背景是美丽的晚霞和远处的城市轮廓。',
          relatedCharacters: ['小雨', '小风'],
          narratorText: '在一个美丽的黄昏，小风约小雨到学校屋顶。',
          dialogueText: '小风：(看着夕阳) 小雨，有件事我想告诉你很久了。\n小雨：(心跳加速) 什么事？\n小风：自从第一次在樱花树下遇见你，我就...'
        }
      ];

      setScenarioList(generatedScenarios);
      setIsAiProcessing(false);
    }, 3000);
  };

  // 清空剧本
  const handleClearScript = () => {
    if (confirm('确定要清空剧本内容吗？')) {
      setFullScriptContent('');
    }
  };

  // 添加新分镜
  const handleAddScenario = () => {
    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      index: scenarioList.length + 1,
      shotDescription: '请输入画面描述...',
      relatedCharacters: [],
      narratorText: '请输入旁白...',
      dialogueText: '请输入对话...'
    };

    setScenarioList([...scenarioList, newScenario]);
  };

  // 更新分镜字段
  const handleUpdateScenarioField = (scenarioId: string, field: keyof Scenario, value: string) => {
    setScenarioList(prevScenarios =>
      prevScenarios.map(scenario =>
        scenario.id === scenarioId
          ? { ...scenario, [field]: value }
          : scenario
      )
    );
  };

  // 更新分镜角色
  const handleUpdateScenarioCharacters = (scenarioId: string, characters: string[]) => {
    setScenarioList(prevScenarios =>
      prevScenarios.map(scenario =>
        scenario.id === scenarioId
          ? { ...scenario, relatedCharacters: characters }
          : scenario
      )
    );
  };

  // 移动分镜
  const handleMoveScenario = (scenarioId: string, direction: number) => {
    const index = scenarioList.findIndex(s => s.id === scenarioId);
    if (index === -1) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= scenarioList.length) return;

    const newScenarios = [...scenarioList];
    [newScenarios[index], newScenarios[newIndex]] = [newScenarios[newIndex], newScenarios[index]];
    
    // 更新序号
    newScenarios.forEach((scenario, idx) => {
      scenario.index = idx + 1;
    });

    setScenarioList(newScenarios);
  };

  // 删除分镜
  const handleDeleteScenario = (scenarioId: string) => {
    setCurrentDeleteScenarioId(scenarioId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (currentDeleteScenarioId) {
      const newScenarios = scenarioList.filter(s => s.id !== currentDeleteScenarioId);
      newScenarios.forEach((scenario, index) => {
        scenario.index = index + 1;
      });
      setScenarioList(newScenarios);
      setShowDeleteModal(false);
      setCurrentDeleteScenarioId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentDeleteScenarioId(null);
  };

  // 保存功能
  const handleSaveScenario = () => {
    if (scenarioList.length === 0) {
      alert('请先创建分镜脚本');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      console.log('保存分镜脚本:', scenarioList);
    }, 1000);
  };

  // 下一步
  const handleNextStep = () => {
    if (scenarioList.length === 0) {
      alert('请先创建分镜脚本');
      return;
    }
    
    handleSaveScenario();
    setTimeout(() => {
      navigate(`/image-generation?projectId=${projectId}`);
    }, 1000);
  };

  // 上一步
  const handlePrevStep = () => {
    navigate(`/voice-selection?projectId=${projectId}`);
  };

  // 处理可编辑内容的输入
  const handleEditableContentChange = (e: React.FormEvent<HTMLDivElement>, scenarioId: string, field: keyof Scenario) => {
    const target = e.target as HTMLDivElement;
    handleUpdateScenarioField(scenarioId, field, target.textContent || '');
  };

  // 处理角色选择
  const handleCharacterSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, scenarioId: string) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    handleUpdateScenarioCharacters(scenarioId, selectedOptions);
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
              />
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            <button className="relative p-2 text-text-secondary hover:text-primary">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-light">
                <img 
                  src="https://s.coze.cn/image/mIZhuEPK2Tw/" 
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
              <Link to="/workspace-list" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-layer-group w-4"></i>
                <span>工作空间管理</span>
              </Link>
            </div>
          </div>
          
          {/* 项目管理 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">项目管理</h3>
            <div className="space-y-1">
              <Link to="/project-list" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-folder w-4"></i>
                <span>项目列表</span>
              </Link>
            </div>
          </div>
          
          {/* 制作流程 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">制作流程</h3>
            <div className="space-y-1">
              <Link to="/script-info" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-file-alt w-4"></i>
                <span>剧本信息</span>
              </Link>
              <Link to="/character-generation" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-user-friends w-4"></i>
                <span>角色IP形象</span>
              </Link>
              <Link to="/voice-selection" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-microphone w-4"></i>
                <span>音色选择</span>
              </Link>
              <Link to="/scenario-editor" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}>
                <i className="fas fa-film w-4"></i>
                <span>分镜脚本</span>
              </Link>
              <Link to="/image-generation" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </Link>
              <Link to="/video-generation" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </Link>
              <Link to="/video-export" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-download w-4"></i>
                <span>视频导出</span>
              </Link>
            </div>
          </div>
          
          {/* 素材库 */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">素材库</h3>
            <div className="space-y-1">
              <Link to="/material-library" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
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
              <li><span className="text-text-primary">分镜脚本生成与编辑</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">分镜脚本生成与编辑</h1>
              <p className="text-text-secondary">使用AI自动拆分剧本，或手动编辑分镜内容</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleAiSplitScenario}
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <i className="fas fa-magic mr-2"></i>AI拆分分镜
              </button>
              <button 
                onClick={handleSaveScenario}
                disabled={isSaving}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>保存中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>保存
                  </>
                )}
              </button>
              <button 
                onClick={handleNextStep}
                className="bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors"
              >
                <i className="fas fa-arrow-right mr-2"></i>下一步
              </button>
            </div>
          </div>
        </div>

        {/* 剧本输入区 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">完整剧本</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">字数：{scriptWordCount}</span>
              <button 
                onClick={handleClearScript}
                className="text-text-secondary hover:text-danger text-sm"
              >
                <i className="fas fa-trash mr-1"></i>清空
              </button>
            </div>
          </div>
          <textarea 
            value={fullScriptContent}
            onChange={(e) => setFullScriptContent(e.target.value)}
            className={`w-full h-48 p-4 border border-border-light rounded-lg resize-none ${styles.searchFocus}`}
            placeholder="请粘贴完整的剧本内容，AI将自动拆分成分镜脚本..."
          />
        </div>

        {/* AI拆分状态提示 */}
        {isAiProcessing && (
          <div className="bg-white rounded-xl shadow-card p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="font-medium text-text-primary">AI正在拆分剧本</h4>
                <p className="text-sm text-text-secondary">请稍候，正在为您生成分镜脚本...</p>
              </div>
            </div>
          </div>
        )}

        {/* 分镜列表 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">分镜脚本</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-text-secondary">共 {scenarioList.length} 个分镜</span>
              <button 
                onClick={handleAddScenario}
                className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm"
              >
                <i className="fas fa-plus mr-1"></i>添加分镜
              </button>
            </div>
          </div>
          
          {scenarioList.length > 0 ? (
            <div className="space-y-4">
              {scenarioList.map(scenario => (
                <div key={scenario.id} className={`bg-white rounded-xl shadow-card ${styles.scenarioCardHover}`}>
                  <div className="p-6">
                    {/* 分镜头部 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`${styles.dragHandle} text-text-secondary hover:text-primary`}>
                          <i className="fas fa-grip-vertical"></i>
                        </div>
                        <h4 className="font-semibold text-text-primary">分镜 #{scenario.index}</h4>
                        <div className="flex items-center space-x-1">
                          {scenario.relatedCharacters.map(character => (
                            <span key={character} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              {character}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            const element = document.querySelector(`#scenario-card-${scenario.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="text-primary hover:text-primary/80 text-sm"
                        >
                          <i className="fas fa-edit mr-1"></i>编辑
                        </button>
                        <button 
                          onClick={() => handleMoveScenario(scenario.id, -1)}
                          className="text-text-secondary hover:text-primary text-sm"
                        >
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <button 
                          onClick={() => handleMoveScenario(scenario.id, 1)}
                          className="text-text-secondary hover:text-primary text-sm"
                        >
                          <i className="fas fa-chevron-down"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteScenario(scenario.id)}
                          className="text-text-secondary hover:text-danger text-sm"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* 分镜内容 */}
                    <div className="space-y-4">
                      {/* 画面描述 */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">画面描述</label>
                        <div 
                          id={`scenario-card-${scenario.id}`}
                          className={styles.editableContent}
                          contentEditable="true"
                          onInput={(e) => handleEditableContentChange(e, scenario.id, 'shotDescription')}
                          suppressContentEditableWarning={true}
                        >
                          {scenario.shotDescription}
                        </div>
                      </div>

                      {/* 关联角色 */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">关联角色</label>
                        <select 
                          className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                          multiple
                          value={scenario.relatedCharacters}
                          onChange={(e) => handleCharacterSelectChange(e, scenario.id)}
                        >
                          <option value="小雨">小雨</option>
                          <option value="小风">小风</option>
                          <option value="老师">老师</option>
                          <option value="同学">同学</option>
                        </select>
                        <p className="text-xs text-text-secondary mt-1">按住Ctrl键可多选</p>
                      </div>

                      {/* 旁白 */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">旁白</label>
                        <div 
                          className={styles.editableContent}
                          contentEditable="true"
                          onInput={(e) => handleEditableContentChange(e, scenario.id, 'narratorText')}
                          suppressContentEditableWarning={true}
                        >
                          {scenario.narratorText}
                        </div>
                      </div>

                      {/* 对话 */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">对话</label>
                        <div 
                          className={`${styles.editableContent} min-h-[80px]`}
                          contentEditable="true"
                          onInput={(e) => handleEditableContentChange(e, scenario.id, 'dialogueText')}
                          suppressContentEditableWarning={true}
                        >
                          {scenario.dialogueText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 空状态 */
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-film text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">暂无分镜脚本</h3>
              <p className="text-text-secondary mb-6">请在上方输入剧本内容，然后点击"AI拆分分镜"按钮</p>
              <button 
                onClick={handleAiSplitScenario}
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <i className="fas fa-magic mr-2"></i>AI拆分分镜
              </button>
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePrevStep}
              className="px-6 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>上一步
            </button>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveScenario}
                disabled={isSaving}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>保存中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>保存
                  </>
                )}
              </button>
              <button 
                onClick={handleNextStep}
                className="bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors"
              >
                <i className="fas fa-arrow-right mr-2"></i>下一步
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelDelete();
            }
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">确认删除</h3>
                    <p className="text-sm text-text-secondary">此操作不可撤销</p>
                  </div>
                </div>
                
                <p className="text-text-secondary mb-6">确定要删除这个分镜吗？删除后将无法恢复。</p>
                
                <div className="flex items-center justify-end space-x-3">
                  <button 
                    onClick={handleCancelDelete}
                    className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioEditor;

