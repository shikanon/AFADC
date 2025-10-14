

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { Header, Sidebar, PageHeader } from '../../components/Layout';

interface FormData {
  projectName: string;
  storyBackground: string;
  styleChoice: 'text' | 'image';
  stylePrompt: string;
  videoAspect: string;
  videoResolution: string;
}

const StaticCreateStep1: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    storyBackground: '',
    styleChoice: 'text',
    stylePrompt: '日系动漫风格，明亮的色彩，细腻的线条，可爱的角色设计，背景丰富',
    videoAspect: '16:9',
    videoResolution: '1080p'
  });
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [showUploadedImage, setShowUploadedImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI静态漫制作 - 基础信息设置 - AI漫剧速成工场';
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setShowUploadedImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage('');
    setShowUploadedImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    if (!formData.projectName.trim()) {
      alert('请输入剧本名称');
      return false;
    }

    if (!formData.storyBackground.trim()) {
      alert('请输入故事背景');
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

    if (formData.styleChoice === 'text' && !formData.stylePrompt.trim()) {
      alert('请输入画风提示词');
      return false;
    }

    return true;
  };

  const generateProjectId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PROJ-${timestamp}-${random}`;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      const projectId = generateProjectId();
      const projectData = {
        projectId,
        ...formData,
        step: 1,
        type: 'static'
      };

      localStorage.setItem('currentProject', JSON.stringify(projectData));
      navigate(`/static-create-step2?projectId=${projectId}`);
    }
  };

  const handleSaveDraft = () => {
    const projectId = generateProjectId();
    const draftData = {
      projectId,
      projectName: formData.projectName.trim() || '未命名项目',
      storyBackground: formData.storyBackground.trim(),
      styleChoice: formData.styleChoice,
      stylePrompt: formData.stylePrompt.trim(),
      videoAspect: formData.videoAspect,
      videoResolution: formData.videoResolution,
      step: 1,
      type: 'static',
      status: 'draft'
    };

    localStorage.setItem('savedProject', JSON.stringify(draftData));
    alert('草稿保存成功！');
    navigate('/project-manage');
  };

  const handleNavigation = (path: string) => {
    if (confirm('当前页面的内容将不会保存，确定要离开吗？')) {
      navigate(path);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 使用Header组件替换重复的顶部导航栏代码 */}
      <Header onSidebarToggle={handleSidebarToggle} />

      {/* 使用Sidebar组件替换重复的侧边栏代码 */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        activeMenu="project-manage"
      />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            title="AI静态漫制作 - 基础信息设置"
            breadcrumb={[
              { label: '首页', href: '/' },
              { label: '项目管理', href: '/project-manage' },
              { label: 'AI静态漫制作', active: true }
            ]}
          />

          <div className="flex gap-6">
            {/* 左侧：步骤指示器 */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border border-border-light p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">制作流程</h3>
                <div className="space-y-6">
                  <div className={`${styles.stepIndicator} ${styles.stepActive}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`${styles.stepNumber} w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-sm font-medium`}>1</div>
                      <div>
                        <div className={`${styles.stepTitle} text-sm font-medium`}>基础信息设置</div>
                        <div className="text-xs text-text-secondary mt-1">设置剧本基本信息</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.stepIndicator}>
                    <div className="flex items-center space-x-3">
                      <div className={`${styles.stepNumber} w-8 h-8 rounded-full border-2 border-border-light flex items-center justify-center text-sm font-medium text-text-secondary`}>2</div>
                      <div>
                        <div className="text-sm font-medium text-text-secondary">确认角色</div>
                        <div className="text-xs text-text-secondary mt-1">创建或选择角色IP</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.stepIndicator}>
                    <div className="flex items-center space-x-3">
                      <div className={`${styles.stepNumber} w-8 h-8 rounded-full border-2 border-border-light flex items-center justify-center text-sm font-medium text-text-secondary`}>3</div>
                      <div>
                        <div className="text-sm font-medium text-text-secondary">创建章节，生成分镜画面</div>
                        <div className="text-xs text-text-secondary mt-1">拆分剧本，生成画面</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.stepIndicator}>
                    <div className="flex items-center space-x-3">
                      <div className={`${styles.stepNumber} w-8 h-8 rounded-full border-2 border-border-light flex items-center justify-center text-sm font-medium text-text-secondary`}>4</div>
                      <div>
                        <div className="text-sm font-medium text-text-secondary">合成最终视频</div>
                        <div className="text-xs text-text-secondary mt-1">配置并生成视频</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：表单区域 */}
            <div className="flex-1">
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
                      className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入剧本名称" 
                      required 
                    />
                    <p className="text-xs text-text-secondary">建议包含作品类型和主题，便于后续管理</p>
                  </div>

                  {/* 故事背景 */}
                  <div className="space-y-2">
                    <label htmlFor="story-background" className="block text-sm font-medium text-text-primary">故事背景 *</label>
                    <textarea 
                      id="story-background" 
                      rows={4}
                      value={formData.storyBackground}
                      onChange={(e) => handleInputChange('storyBackground', e.target.value)}
                      className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                      placeholder="请简要描述故事的背景设定、主要情节等..." 
                      required
                    />
                    <p className="text-xs text-text-secondary">详细的背景描述有助于AI生成更符合预期的画面</p>
                  </div>

                  {/* 画风选择 */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-text-primary">画风选择 *</label>
                    
                    <div className="space-y-3">
                      {/* 文本提示词选项 */}
                      <div className="flex items-start space-x-3 p-4 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer">
                        <input 
                          type="radio" 
                          id="style-text" 
                          name="style-choice" 
                          value="text" 
                          checked={formData.styleChoice === 'text'}
                          onChange={(e) => handleInputChange('styleChoice', e.target.value)}
                          className={`${styles.radioCustom} mt-1`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className="fas fa-pen text-primary"></i>
                            <span className="font-medium text-text-primary">文本提示词</span>
                          </div>
                          <p className="text-sm text-text-secondary mb-3">通过文字描述来定义画风风格</p>
                          {formData.styleChoice === 'text' && (
                            <div>
                              <textarea 
                                id="style-prompt" 
                                rows={3}
                                value={formData.stylePrompt}
                                onChange={(e) => handleInputChange('stylePrompt', e.target.value)}
                                className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                                placeholder="例如：日系动漫风格，明亮的色彩，细腻的线条，可爱的角色设计，背景丰富..."
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 参考图片选项 */}
                      <div className="flex items-start space-x-3 p-4 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer">
                        <input 
                          type="radio" 
                          id="style-image" 
                          name="style-choice" 
                          value="image" 
                          checked={formData.styleChoice === 'image'}
                          onChange={(e) => handleInputChange('styleChoice', e.target.value)}
                          className={`${styles.radioCustom} mt-1`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className="fas fa-image text-secondary"></i>
                            <span className="font-medium text-text-primary">参考图片</span>
                          </div>
                          <p className="text-sm text-text-secondary mb-3">上传参考图片来定义画风风格</p>
                          {formData.styleChoice === 'image' && (
                            <div>
                              {!showUploadedImage ? (
                                <div 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="border-2 border-dashed border-border-light rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                                >
                                  <i className="fas fa-cloud-upload-alt text-3xl text-text-secondary mb-2"></i>
                                  <p className="text-sm text-text-secondary mb-1">点击上传参考图片</p>
                                  <p className="text-xs text-text-secondary">支持 JPG、PNG 格式，最大 10MB</p>
                                  <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*" 
                                    className="hidden"
                                  />
                                </div>
                              ) : (
                                <div className="mt-3">
                                  <img 
                                    src={uploadedImage} 
                                    alt="参考图片预览" 
                                    className="w-32 h-32 rounded-lg object-cover"
                                  />
                                  <button 
                                    type="button" 
                                    onClick={handleRemoveImage}
                                    className="mt-2 text-danger text-sm hover:underline"
                                  >
                                    移除图片
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 视频参数设置 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 视频比例 */}
                    <div className="space-y-2">
                      <label htmlFor="video-aspect" className="block text-sm font-medium text-text-primary">视频比例 *</label>
                      <select 
                        id="video-aspect" 
                        value={formData.videoAspect}
                        onChange={(e) => handleInputChange('videoAspect', e.target.value)}
                        className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                        required
                      >
                        <option value="">请选择视频比例</option>
                        <option value="16:9">16:9 (横屏)</option>
                        <option value="9:16">9:16 (竖屏)</option>
                        <option value="1:1">1:1 (正方形)</option>
                        <option value="4:3">4:3 (标准屏)</option>
                      </select>
                      <p className="text-xs text-text-secondary">根据发布平台选择合适的比例</p>
                    </div>

                    {/* 分辨率 */}
                    <div className="space-y-2">
                      <label htmlFor="video-resolution" className="block text-sm font-medium text-text-primary">分辨率 *</label>
                      <select 
                        id="video-resolution" 
                        value={formData.videoResolution}
                        onChange={(e) => handleInputChange('videoResolution', e.target.value)}
                        className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                        required
                      >
                        <option value="">请选择分辨率</option>
                        <option value="1080p">1080p (1920x1080)</option>
                        <option value="720p">720p (1280x720)</option>
                        <option value="480p">480p (854x480)</option>
                        <option value="2160p">4K (3840x2160)</option>
                      </select>
                      <p className="text-xs text-text-secondary">更高的分辨率需要更多的计算资源</p>
                    </div>
                  </div>
                </form>
              </div>

              {/* 操作按钮区 */}
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                >
                  <i className="fas fa-save mr-2"></i>保存草稿
                </button>
                <button 
                  type="button" 
                  disabled
                  className="px-6 py-3 border border-border-medium text-text-secondary rounded-lg opacity-50 cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left mr-2"></i>上一步
                </button>
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  下一步<i className="fas fa-chevron-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaticCreateStep1;

