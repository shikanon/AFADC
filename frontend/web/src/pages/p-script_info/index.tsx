

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface FormData {
  dramaName: string;
  styleType: 'text' | 'image';
  styleText: string;
  aspectRatio: string;
  resolution: string;
  storyBackground: string;
  styleImage?: File | null;
}

const ScriptInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    dramaName: '樱花之恋',
    styleType: 'text',
    styleText: '日系二次元风格，清新唯美，樱花飞舞的校园场景，温暖的色调，细腻的线条',
    aspectRatio: '16:9',
    resolution: '1080p',
    storyBackground: '故事发生在日本的一所普通高中，春天樱花盛开的季节。主角是一名高二学生，性格温柔内向，喜欢文学和音乐。她在樱花树下遇到了转校生，两人因为共同的兴趣爱好而逐渐走近，展开了一段青涩美好的校园恋情。故事充满了青春的悸动、友情的温暖和成长的烦恼。'
  });
  const [showSaveSuccessToast, setShowSaveSuccessToast] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '剧本基础信息 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      console.log('加载项目剧本信息，项目ID:', projectId);
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImageSrc(e.target.result as string);
        setFormData(prev => ({ ...prev, styleImage: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUploadAreaClick = () => {
    if (!previewImageSrc && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImageSrc('');
    setFormData(prev => ({ ...prev, styleImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showSaveSuccessMessage = () => {
    setShowSaveSuccessToast(true);
    setTimeout(() => {
      setShowSaveSuccessToast(false);
    }, 3000);
  };

  const handleSave = () => {
    const form = document.getElementById('script-info-form') as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    console.log('保存剧本信息:', formData);
    showSaveSuccessMessage();
    return true;
  };

  const handleNext = () => {
    if (handleSave()) {
      const projectId = searchParams.get('projectId') || 'project1';
      navigate(`/character-generation?projectId=${projectId}`);
    }
  };

  const handlePrev = () => {
    navigate('/project-list');
  };

  const projectId = searchParams.get('projectId') || 'project1';

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
                  src="https://s.coze.cn/image/Z3EOR1xVjR0/" 
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
      <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-border-light ${styles.sidebarTransition} z-40`}>
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
              <Link to="/script-info" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}>
                <i className="fas fa-file-alt w-4"></i>
                <span>剧本信息</span>
              </Link>
              <Link to={`/character-generation?projectId=${projectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-user-friends w-4"></i>
                <span>角色IP形象</span>
              </Link>
              <Link to={`/voice-selection?projectId=${projectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-microphone w-4"></i>
                <span>音色选择</span>
              </Link>
              <Link to={`/scenario-editor?projectId=${projectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-film w-4"></i>
                <span>分镜脚本</span>
              </Link>
              <Link to={`/image-generation?projectId=${projectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-image w-4"></i>
                <span>分镜画面</span>
              </Link>
              <Link to={`/video-generation?projectId=${projectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
                <i className="fas fa-video w-4"></i>
                <span>分镜视频</span>
              </Link>
              <Link to={`/video-export?projectId=${projectId}`} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
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
              <li><span className="text-text-primary">剧本基础信息</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">剧本基础信息</h1>
              <p className="text-text-secondary">设置您的漫剧基本信息和风格</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSave}
                className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
              <button 
                onClick={handleNext}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="fas fa-arrow-right mr-2"></i>下一步
              </button>
            </div>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <form id="script-info-form" className="space-y-6">
            {/* 漫剧名称 */}
            <div className="space-y-2">
              <label htmlFor="drama-name" className="block text-sm font-medium text-text-primary">漫剧名称 *</label>
              <input 
                type="text" 
                id="drama-name" 
                name="drama-name" 
                className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                placeholder="请输入漫剧名称" 
                value={formData.dramaName}
                onChange={(e) => handleInputChange('dramaName', e.target.value)}
                required 
              />
            </div>

            {/* 画风选择 */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-primary">画风选择 *</label>
              
              {/* 选择方式 */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="style-type" 
                    value="text" 
                    className="text-primary"
                    checked={formData.styleType === 'text'}
                    onChange={(e) => handleInputChange('styleType', e.target.value)}
                  />
                  <span className="text-sm">文本描述</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="style-type" 
                    value="image" 
                    className="text-primary"
                    checked={formData.styleType === 'image'}
                    onChange={(e) => handleInputChange('styleType', e.target.value)}
                  />
                  <span className="text-sm">参考图上传</span>
                </label>
              </div>

              {/* 文本描述输入框 */}
              {formData.styleType === 'text' && (
                <div className="space-y-2">
                  <label htmlFor="style-text" className="block text-sm font-medium text-text-primary">画风描述 *</label>
                  <textarea 
                    id="style-text" 
                    name="style-text" 
                    rows={4}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                    placeholder="请详细描述您想要的画风，例如：日系二次元、清新唯美、手绘风格等..."
                    value={formData.styleText}
                    onChange={(e) => handleInputChange('styleText', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* 参考图上传区域 */}
              {formData.styleType === 'image' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">上传参考图 *</label>
                  <div 
                    className={`${styles.uploadArea} ${isDragOver ? styles.uploadAreaDragover : ''} rounded-lg p-8 text-center cursor-pointer`}
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*" 
                      className="hidden"
                      onChange={handleFileInputChange}
                      required={formData.styleType === 'image'}
                    />
                    {!previewImageSrc ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <i className="fas fa-cloud-upload-alt text-primary text-2xl"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">点击上传或拖拽图片到此处</p>
                          <p className="text-xs text-text-secondary mt-1">支持 JPG、PNG 格式，文件大小不超过 10MB</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <img src={previewImageSrc} alt="参考图预览" className="max-w-full h-48 mx-auto rounded-lg" />
                        <button 
                          type="button" 
                          onClick={handleRemoveImage}
                          className="mt-3 text-sm text-danger hover:text-danger/80"
                        >
                          <i className="fas fa-trash mr-1"></i>移除图片
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 视频比例和分辨率 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 视频比例 */}
              <div className="space-y-2">
                <label htmlFor="aspect-ratio" className="block text-sm font-medium text-text-primary">视频比例 *</label>
                <select 
                  id="aspect-ratio" 
                  name="aspect-ratio" 
                  className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                  value={formData.aspectRatio}
                  onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
                  required
                >
                  <option value="16:9">16:9 (宽屏)</option>
                  <option value="9:16">9:16 (竖屏)</option>
                  <option value="4:3">4:3 (标准)</option>
                  <option value="1:1">1:1 (正方形)</option>
                </select>
              </div>

              {/* 分辨率 */}
              <div className="space-y-2">
                <label htmlFor="resolution" className="block text-sm font-medium text-text-primary">分辨率 *</label>
                <select 
                  id="resolution" 
                  name="resolution" 
                  className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                  value={formData.resolution}
                  onChange={(e) => handleInputChange('resolution', e.target.value)}
                  required
                >
                  <option value="1080p">1080P (1920x1080)</option>
                  <option value="720p">720P (1280x720)</option>
                  <option value="480p">480P (854x480)</option>
                  <option value="2160p">4K (3840x2160)</option>
                </select>
              </div>
            </div>

            {/* 故事背景 */}
            <div className="space-y-2">
              <label htmlFor="story-background" className="block text-sm font-medium text-text-primary">故事背景 *</label>
              <textarea 
                id="story-background" 
                name="story-background" 
                rows={6}
                className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                placeholder="请描述您的故事背景，包括时间、地点、主要人物关系等，这将帮助AI更好地理解和生成符合您期望的内容..."
                value={formData.storyBackground}
                onChange={(e) => handleInputChange('storyBackground', e.target.value)}
                required
              />
            </div>
          </form>
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-card p-4">
          <button 
            onClick={handlePrev}
            className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
          >
            <i className="fas fa-arrow-left mr-2"></i>上一步
          </button>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSave}
              className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
            >
              <i className="fas fa-save mr-2"></i>保存
            </button>
            <button 
              onClick={handleNext}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <i className="fas fa-arrow-right mr-2"></i>下一步
            </button>
          </div>
        </div>
      </main>

      {/* 保存成功提示 */}
      <div className={`fixed top-20 right-6 bg-success text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${showSaveSuccessToast ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center space-x-2">
          <i className="fas fa-check-circle"></i>
          <span>保存成功</span>
        </div>
      </div>
    </div>
  );
};

export default ScriptInfoPage;

