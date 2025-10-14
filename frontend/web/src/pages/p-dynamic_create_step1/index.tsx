

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import styles from './styles.module.css';

interface FormData {
  projectName: string;
  storyBackground: string;
  styleChoice: 'text' | 'image';
  stylePrompt: string;
  videoAspect: string;
  videoResolution: string;
  styleReference?: File;
}

const DynamicCreateStep1: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    storyBackground: '',
    styleChoice: 'text',
    stylePrompt: '日系动漫风格，明亮的色彩，细腻的线条，可爱的角色设计，高清画质',
    videoAspect: '16:9',
    videoResolution: '1080p'
  });
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI动态漫制作 - 基础信息设置 - AI漫剧速成工场';
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, styleReference: file }));
    }
  };

  const handleUploadAreaClick = () => {
    if (!uploadedImage && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChangeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
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

    if (!uploadedImage && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({ ...prev, styleReference: file }));
        
        if (fileInputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInputRef.current.files = dt.files;
        }
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.projectName.trim()) {
      alert('请输入剧本名称');
      return false;
    }

    if (!formData.videoAspect) {
      alert('请选择视频比例');
      return false;
    }

    if (!formData.videoResolution) {
      alert('请选择分辨率');
      return false;
    }

    if (formData.styleChoice === 'text') {
      if (!formData.stylePrompt.trim()) {
        alert('请输入画风提示词');
        return false;
      }
    } else {
      if (!formData.styleReference) {
        alert('请上传参考图片');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      const projectId = 'PROJ-' + Date.now();
      
      const projectData = {
        projectId: projectId,
        projectName: formData.projectName.trim(),
        storyBackground: formData.storyBackground.trim(),
        styleChoice: formData.styleChoice,
        stylePrompt: formData.stylePrompt.trim(),
        videoAspect: formData.videoAspect,
        videoResolution: formData.videoResolution,
        projectType: 'dynamic'
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentProject', JSON.stringify(projectData));
      }
      
      navigate(`/dynamic-create-step2?projectId=${projectId}`);
    }
  };

  const handleSaveDraft = () => {
    const projectId = 'PROJ-' + Date.now();
    
    const draftData = {
      projectId: projectId,
      projectName: formData.projectName.trim() || '未命名项目',
      storyBackground: formData.storyBackground.trim(),
      styleChoice: formData.styleChoice,
      stylePrompt: formData.stylePrompt.trim(),
      videoAspect: formData.videoAspect,
      videoResolution: formData.videoResolution,
      projectType: 'dynamic',
      status: 'draft'
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedProject_' + projectId, JSON.stringify(draftData));
    }
    
    navigate('/project-manage');
  };

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('当前页面的内容将不会保存，确定要离开吗？')) {
      navigate(path);
    }
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
            title="AI动态漫制作 - 基础信息设置"
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
                <div className={`${styles.stepItem} active mb-4`}>
                  <div className="ml-8">
                    <div className="font-medium text-text-primary">基础信息设置</div>
                    <div className="text-sm text-text-secondary">设置剧本基本信息和画风</div>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <div className="font-medium text-text-secondary">确认角色</div>
                    <div className="text-sm text-text-secondary">创建或选择角色IP形象</div>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <div className="font-medium text-text-secondary">章节管理</div>
                    <div className="text-sm text-text-secondary">创建和管理剧本章节</div>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <div className="font-medium text-text-secondary">分镜脚本与画面生成</div>
                    <div className="text-sm text-text-secondary">AI拆分剧本为生成分镜</div>
                  </div>
                </div>
                <div className={`${styles.stepItem} mb-4`}>
                  <div className="ml-8">
                    <div className="font-medium text-text-secondary">生成分镜视频</div>
                    <div className="text-sm text-text-secondary">将分镜画面转换为动态视频</div>
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
          </div>

          {/* 表单区域 */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <form className="space-y-6">
              {/* 剧本名称 */}
              <div className="space-y-2">
                <label htmlFor="project-name" className="block text-sm font-medium text-text-primary">剧本名称 *</label>
                <input 
                  type="text" 
                  id="project-name" 
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                  placeholder="请输入剧本名称" 
                  required 
                />
              </div>

              {/* 故事背景 */}
              <div className="space-y-2">
                <label htmlFor="story-background" className="block text-sm font-medium text-text-primary">故事背景</label>
                <textarea 
                  id="story-background" 
                  rows={4}
                  value={formData.storyBackground}
                  onChange={(e) => handleInputChange('storyBackground', e.target.value)}
                  className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                  placeholder="请描述故事的背景设定、世界观等..."
                />
              </div>

              {/* 画风选择 */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-text-primary">画风选择 *</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="style-choice" 
                      value="text" 
                      checked={formData.styleChoice === 'text'}
                      onChange={(e) => handleInputChange('styleChoice', e.target.value)}
                      className="text-primary focus:ring-primary" 
                    />
                    <span className="text-sm text-text-primary">文本提示词</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="style-choice" 
                      value="image" 
                      checked={formData.styleChoice === 'image'}
                      onChange={(e) => handleInputChange('styleChoice', e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-primary">参考图片</span>
                  </label>
                </div>
              </div>

              {/* 画风提示词 */}
              {formData.styleChoice === 'text' && (
                <div className="space-y-2">
                  <label htmlFor="style-prompt" className="block text-sm font-medium text-text-primary">画风提示词 *</label>
                  <textarea 
                    id="style-prompt" 
                    rows={3}
                    value={formData.stylePrompt}
                    onChange={(e) => handleInputChange('stylePrompt', e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                    placeholder="请描述期望的画风，例如：日系动漫风格，明亮的色彩，细腻的线条，可爱的角色设计..."
                    required
                  />
                  <div className="text-xs text-text-secondary">
                    <i className="fas fa-lightbulb mr-1"></i>
                    提示：详细的画风描述可以帮助AI生成更符合预期的作品
                  </div>
                </div>
              )}

              {/* 画风参考图 */}
              {formData.styleChoice === 'image' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">参考图片 *</label>
                  <div 
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`${styles.uploadArea} ${isDragOver ? 'dragover' : ''} rounded-lg p-8 text-center cursor-pointer`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    {!uploadedImage ? (
                      <div>
                        <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                        <div className="text-sm text-text-primary mb-2">点击上传或拖拽图片到此处</div>
                        <div className="text-xs text-text-secondary">支持 JPG、PNG 格式，文件大小不超过 10MB</div>
                      </div>
                    ) : (
                      <div>
                        <img src={uploadedImage} alt="参考图片预览" className="max-w-full max-h-48 mx-auto rounded-lg" />
                        <div className="mt-4">
                          <button 
                            type="button" 
                            onClick={handleChangeImage}
                            className="text-sm text-primary hover:text-blue-600"
                          >
                            <i className="fas fa-exchange-alt mr-1"></i>更换图片
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 视频参数设置 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 视频比例 */}
                <div className="space-y-2">
                  <label htmlFor="video-aspect" className="block text-sm font-medium text-text-primary">视频比例 *</label>
                  <select 
                    id="video-aspect" 
                    value={formData.videoAspect}
                    onChange={(e) => handleInputChange('videoAspect', e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    required
                  >
                    <option value="">请选择视频比例</option>
                    <option value="16:9">16:9 (横屏)</option>
                    <option value="9:16">9:16 (竖屏)</option>
                    <option value="1:1">1:1 (正方形)</option>
                    <option value="4:3">4:3 (标准)</option>
                  </select>
                </div>

                {/* 分辨率 */}
                <div className="space-y-2">
                  <label htmlFor="video-resolution" className="block text-sm font-medium text-text-primary">分辨率 *</label>
                  <select 
                    id="video-resolution" 
                    value={formData.videoResolution}
                    onChange={(e) => handleInputChange('videoResolution', e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    required
                  >
                    <option value="">请选择分辨率</option>
                    <option value="1080p">1080p (1920x1080)</option>
                    <option value="720p">720p (1280x720)</option>
                    <option value="480p">480p (854x480)</option>
                    <option value="2160p">4K (3840x2160)</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-end space-x-4 mt-8">
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
              下一步
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DynamicCreateStep1;

