

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface Character {
  id: string;
  name: string;
  description: string;
  images: string[];
}

const CharacterGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentProjectId = searchParams.get('projectId') || 'default';

  // 状态管理
  const [showCharacterEditor, setShowCharacterEditor] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showUploadCustomModal, setShowUploadCustomModal] = useState(false);
  const [currentEditingCharacterId, setCurrentEditingCharacterId] = useState<string | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerationResult, setShowGenerationResult] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<{
    front: string;
    side: string;
    angle45: string;
  }>({
    front: '',
    side: '',
    angle45: ''
  });

  // 表单状态
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');

  // 文件输入引用
  const referenceImageInputRef = useRef<HTMLInputElement>(null);
  const frontImageInputRef = useRef<HTMLInputElement>(null);
  const sideImageInputRef = useRef<HTMLInputElement>(null);
  const angle45ImageInputRef = useRef<HTMLInputElement>(null);

  // 模拟角色数据
  const [characters, setCharacters] = useState<Record<string, Character>>({
    'char1': {
      id: 'char1',
      name: '樱花少女',
      description: '穿着粉色连衣裙的少女，长发飘飘，温柔可爱，樱花般的美好',
      images: [
        'https://s.coze.cn/image/PDuGC7GmwBY/',
        'https://s.coze.cn/image/wz8FagV1IH0/',
        'https://s.coze.cn/image/bz3lyoGdyuo/'
      ]
    },
    'char2': {
      id: 'char2',
      name: '阳光少年',
      description: '穿着校服的高中男生，阳光开朗，运动型的帅气少年',
      images: [
        'https://s.coze.cn/image/qwUWSRSD8vs/',
        'https://s.coze.cn/image/pqU0BBLLjjg/',
        'https://s.coze.cn/image/qte30jFf5ZE/'
      ]
    }
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '角色IP形象 - AI漫剧快造';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 处理导航
  const handlePreviousStep = () => {
    navigate(-1);
  };

  const handleNextStep = () => {
    navigate(`/voice-selection?projectId=${currentProjectId}`);
  };

  // 保存所有角色
  const handleSaveAllCharacters = () => {
    console.log('保存所有角色');
    alert('角色保存成功！');
  };

  // 打开角色编辑器
  const openCharacterEditor = (characterId: string | null = null) => {
    setCurrentEditingCharacterId(characterId);
    setCharacterName('');
    setCharacterDescription('');
    setReferenceImage('');
    setShowGenerationResult(false);

    if (characterId && characters[characterId]) {
      const character = characters[characterId];
      setCharacterName(character.name);
      setCharacterDescription(character.description);
    }

    setShowCharacterEditor(true);
  };

  // 关闭角色编辑器
  const closeCharacterEditor = () => {
    setShowCharacterEditor(false);
    setCurrentEditingCharacterId(null);
  };

  // 生成角色
  const generateCharacter = async () => {
    if (!characterName || !characterDescription) {
      alert('请填写角色名称和描述');
      return;
    }

    setIsGenerating(true);

    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    setShowGenerationResult(true);
    setIsGenerating(false);
  };

  // 保存角色
  const saveCharacter = () => {
    if (!characterName || !characterDescription) {
      alert('请填写角色名称和描述');
      return;
    }

    const newCharacter: Character = {
      id: currentEditingCharacterId || `char_${Date.now()}`,
      name: characterName,
      description: characterDescription,
      images: [
        'https://s.coze.cn/image/qveN3EUygCk/',
        'https://s.coze.cn/image/GMhVRbRtAd8/',
        'https://s.coze.cn/image/FRLfbcu_s3w/'
      ]
    };

    setCharacters(prev => ({
      ...prev,
      [newCharacter.id]: newCharacter
    }));

    alert('角色保存成功！');
    closeCharacterEditor();
  };

  // 打开删除确认
  const openDeleteConfirm = (characterId: string) => {
    setCharacterToDelete(characterId);
    setShowDeleteConfirmModal(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (characterToDelete) {
      setCharacters(prev => {
        const newChars = { ...prev };
        delete newChars[characterToDelete];
        return newChars;
      });
      alert('角色删除成功！');
    }
    setShowDeleteConfirmModal(false);
    setCharacterToDelete(null);
  };

  // 处理参考图上传
  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 移除参考图
  const removeReferenceImage = () => {
    setReferenceImage('');
    if (referenceImageInputRef.current) {
      referenceImageInputRef.current.value = '';
    }
  };

  // 处理手动上传图片
  const handleCustomImageUpload = (type: 'front' | 'side' | 'angle45') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => ({
          ...prev,
          [type]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 提交手动上传
  const handleSubmitCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedImages.front || !uploadedImages.side || !uploadedImages.angle45) {
      alert('请上传所有视角的图片');
      return;
    }

    const newCharacter: Character = {
      id: currentEditingCharacterId || `char_${Date.now()}`,
      name: characterName,
      description: characterDescription,
      images: [
        uploadedImages.front,
        uploadedImages.side,
        uploadedImages.angle45
      ]
    };

    setCharacters(prev => ({
      ...prev,
      [newCharacter.id]: newCharacter
    }));

    alert('角色上传成功！');
    setShowUploadCustomModal(false);
    closeCharacterEditor();
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
                  src="https://s.coze.cn/image/Ha7BrYdYGYA/" 
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
              <Link to={`/script-info?projectId=${currentProjectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-file-alt w-4"></i>
                <span>剧本信息</span>
              </Link>
              <Link to={`/character-generation?projectId=${currentProjectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}>
                <i className="fas fa-user-friends w-4"></i>
                <span>角色IP形象</span>
              </Link>
              <Link to={`/voice-selection?projectId=${currentProjectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-microphone w-4"></i>
                <span>音色选择</span>
              </Link>
              <Link to={`/scenario-editor?projectId=${currentProjectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-film w-4"></i>
                <span>分镜脚本</span>
              </Link>
              <Link to={`/image-generation?projectId=${currentProjectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </Link>
              <Link to={`/video-generation?projectId=${currentProjectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </Link>
              <Link to={`/video-export?projectId=${currentProjectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
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
              <li><span className="text-text-primary">角色IP形象</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">角色IP形象</h1>
              <p className="text-text-secondary">创建和管理您的角色形象</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => openCharacterEditor()}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>新建角色
              </button>
              <button 
                onClick={handleSaveAllCharacters}
                className="bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
              <button 
                onClick={handleNextStep}
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <span>下一步</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 角色列表区域 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">已创建角色</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(characters).map((character) => (
              <div key={character.id} className={`bg-white rounded-xl shadow-card ${styles.characterCardHover}`}>
                <div className="relative">
                  <img 
                    src={character.images[0]} 
                    alt="角色预览图" 
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => openCharacterEditor(character.id)}
                      className="bg-white/90 text-text-secondary hover:text-primary p-2 rounded-lg shadow-md"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-text-primary mb-2">{character.name}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{character.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">3个视角</span>
                    <button 
                      onClick={() => openDeleteConfirm(character.id)}
                      className="text-text-secondary hover:text-danger text-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 新建角色卡片 */}
            <div 
              onClick={() => openCharacterEditor()}
              className="border-2 border-dashed border-border-light rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-plus text-primary text-2xl"></i>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">创建新角色</h3>
              <p className="text-sm text-text-secondary">使用AI生成独特的角色形象</p>
            </div>
          </div>
        </div>

        {/* 角色编辑/创建表单 */}
        {showCharacterEditor && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">
                {currentEditingCharacterId ? '编辑角色' : '创建新角色'}
              </h2>
              <button 
                onClick={closeCharacterEditor}
                className="text-text-secondary hover:text-text-primary"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="space-y-6">
              {/* 角色基本信息 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="character-name" className="block text-sm font-medium text-text-primary mb-2">
                    角色名称 *
                  </label>
                  <input 
                    type="text" 
                    id="character-name"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入角色名称" 
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="character-description" className="block text-sm font-medium text-text-primary mb-2">
                    角色特征描述 *
                  </label>
                  <textarea 
                    id="character-description"
                    rows={4}
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                    placeholder="请详细描述角色的外貌、性格、服装等特征..." 
                    required
                  />
                </div>

                {/* 参考图上传 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">参考图上传（可选）</label>
                  {!referenceImage ? (
                    <div 
                      onClick={() => referenceImageInputRef.current?.click()}
                      className={`${styles.uploadArea} rounded-lg p-6 text-center cursor-pointer`}
                    >
                      <input 
                        ref={referenceImageInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleReferenceImageUpload}
                        className="hidden" 
                      />
                      <i className="fas fa-cloud-upload-alt text-3xl text-text-secondary mb-3"></i>
                      <p className="text-sm text-text-primary mb-1">点击上传参考图片</p>
                      <p className="text-xs text-text-secondary">支持 JPG、PNG 格式，最大 10MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img 
                        src={referenceImage} 
                        alt="参考图预览" 
                        className="w-32 h-32 object-cover rounded-lg border border-border-light"
                      />
                      <button 
                        type="button" 
                        onClick={removeReferenceImage}
                        className="ml-3 text-danger hover:text-danger/80 text-sm"
                      >
                        <i className="fas fa-trash mr-1"></i>移除
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 生成选项 */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between space-x-4">
                  <button 
                    type="button" 
                    onClick={generateCharacter}
                    disabled={isGenerating}
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>生成中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>AI生成角色
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowUploadCustomModal(true)}
                    className="px-6 py-3 border border-border-light text-text-primary rounded-lg hover:border-primary hover:text-primary transition-colors"
                  >
                    <i className="fas fa-upload mr-2"></i>手动上传
                  </button>
                </div>
              </div>
            </form>

            {/* 生成结果预览 */}
            {showGenerationResult && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">生成结果</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <img 
                      src="https://s.coze.cn/image/qveN3EUygCk/" 
                      alt="正面视角" 
                      className="w-full h-48 object-cover rounded-lg border border-border-light mb-2"
                    />
                    <p className="text-sm text-text-secondary">正面视角</p>
                  </div>
                  <div className="text-center">
                    <img 
                      src="https://s.coze.cn/image/GMhVRbRtAd8/" 
                      alt="侧面视角" 
                      className="w-full h-48 object-cover rounded-lg border border-border-light mb-2"
                    />
                    <p className="text-sm text-text-secondary">侧面视角</p>
                  </div>
                  <div className="text-center">
                    <img 
                      src="https://s.coze.cn/image/FRLfbcu_s3w/" 
                      alt="45度视角" 
                      className="w-full h-48 object-cover rounded-lg border border-border-light mb-2"
                    />
                    <p className="text-sm text-text-secondary">45度视角</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={generateCharacter}
                    disabled={isGenerating}
                    className="px-6 py-2 border border-border-light text-text-primary rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <i className="fas fa-redo mr-2"></i>重新生成
                  </button>
                  <button 
                    type="button" 
                    onClick={saveCharacter}
                    className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                  >
                    <i className="fas fa-save mr-2"></i>保存角色
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 底部操作区 */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePreviousStep}
              className="px-6 py-2 border border-border-light text-text-primary rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>上一步
            </button>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveAllCharacters}
                className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
              <button 
                onClick={handleNextStep}
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <span>下一步</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 删除确认弹窗 */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
                  <p className="text-sm text-text-secondary mb-6">确定要删除这个角色吗？删除后无法恢复。</p>
                  <div className="flex items-center justify-center space-x-3">
                    <button 
                      onClick={() => setShowDeleteConfirmModal(false)}
                      className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button 
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 手动上传弹窗 */}
      {showUploadCustomModal && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">手动上传角色形象</h3>
                  <button 
                    onClick={() => setShowUploadCustomModal(false)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleSubmitCustomUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">正面视角图片 *</label>
                    <div 
                      onClick={() => frontImageInputRef.current?.click()}
                      className={`${styles.uploadArea} rounded-lg p-4 text-center cursor-pointer`}
                    >
                      <input 
                        ref={frontImageInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleCustomImageUpload('front')}
                        className="hidden" 
                      />
                      <i className="fas fa-cloud-upload-alt text-2xl text-text-secondary mb-2"></i>
                      <p className="text-sm text-text-primary">点击上传正面视角</p>
                    </div>
                    {uploadedImages.front && (
                      <img 
                        src={uploadedImages.front} 
                        alt="正面预览" 
                        className="mt-2 w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">侧面视角图片 *</label>
                    <div 
                      onClick={() => sideImageInputRef.current?.click()}
                      className={`${styles.uploadArea} rounded-lg p-4 text-center cursor-pointer`}
                    >
                      <input 
                        ref={sideImageInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleCustomImageUpload('side')}
                        className="hidden" 
                      />
                      <i className="fas fa-cloud-upload-alt text-2xl text-text-secondary mb-2"></i>
                      <p className="text-sm text-text-primary">点击上传侧面视角</p>
                    </div>
                    {uploadedImages.side && (
                      <img 
                        src={uploadedImages.side} 
                        alt="侧面预览" 
                        className="mt-2 w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">45度视角图片 *</label>
                    <div 
                      onClick={() => angle45ImageInputRef.current?.click()}
                      className={`${styles.uploadArea} rounded-lg p-4 text-center cursor-pointer`}
                    >
                      <input 
                        ref={angle45ImageInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleCustomImageUpload('angle45')}
                        className="hidden" 
                      />
                      <i className="fas fa-cloud-upload-alt text-2xl text-text-secondary mb-2"></i>
                      <p className="text-sm text-text-primary">点击上传45度视角</p>
                    </div>
                    {uploadedImages.angle45 && (
                      <img 
                        src={uploadedImages.angle45} 
                        alt="45度预览" 
                        className="mt-2 w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowUploadCustomModal(false)}
                      className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      上传角色
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterGenerationPage;

