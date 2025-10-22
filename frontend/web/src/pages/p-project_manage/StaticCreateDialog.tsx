import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface StaticCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData) => void;
}

export interface FormData {
  projectName: string;
  storyBackground: string;
  styleChoice: 'text' | 'image';
  stylePrompt: string;
  videoAspect: string;
  videoResolution: string;
  uploadedImage?: string;
  selectedAssetImage?: {id: string; url: string; name: string};
}

// 模拟资产管理数据结构
interface Asset {
  id: string;
  url: string;
  name: string;
}

const StaticCreateDialog: React.FC<StaticCreateDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  // 创建导航函数
  const navigate = useNavigate();
  // 初始化表单数据
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    storyBackground: '',
    styleChoice: 'text',
    stylePrompt: '日系动漫风格，明亮的色彩，细腻的线条，可爱的角色设计，背景丰富',
    videoAspect: '16:9',
    videoResolution: '1080p'
  });
  
  // 图片相关状态
  const [imageSelectionMode, setImageSelectionMode] = useState<'upload' | 'asset'>('upload');
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 模拟资产数据
  const mockAssets: Asset[] = [
    { id: '1', url: 'https://via.placeholder.com/300x200', name: '风格1.jpg' },
    { id: '2', url: 'https://via.placeholder.com/300x200', name: '风格2.jpg' },
    { id: '3', url: 'https://via.placeholder.com/300x200', name: '风格3.jpg' },
    { id: '4', url: 'https://via.placeholder.com/300x200', name: '风格4.jpg' },
    { id: '5', url: 'https://via.placeholder.com/300x200', name: '风格5.jpg' },
    { id: '6', url: 'https://via.placeholder.com/300x200', name: '风格6.jpg' }
  ];
  
  // 过滤资产
  const filteredAssets = assetSearchTerm
    ? mockAssets.filter(asset => asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase()))
    : mockAssets;

  // 处理输入变化
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理图片模式切换
  const handleImageModeChange = (mode: 'upload' | 'asset') => {
    setImageSelectionMode(mode);
  };
  
  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          uploadedImage: reader.result as string,
          selectedAssetImage: undefined
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 移除上传的图片
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      uploadedImage: undefined
    }));
  };
  
  // 选择资产图片
  const handleAssetSelect = (asset: Asset) => {
    setFormData(prev => ({
      ...prev,
      selectedAssetImage: asset,
      uploadedImage: undefined
    }));
  };
  
  // 移除资产图片
  const handleRemoveAssetImage = () => {
    setFormData(prev => ({
      ...prev,
      selectedAssetImage: undefined
    }));
  };
  
  // 打开资产对话框（这里简化为提示）
  const handleOpenAssetDialog = () => {
    alert('打开资产库对话框');
  };
  
  // 处理确认按钮点击
  const handleConfirm = () => {
    // 简单的表单验证
    if (!formData.projectName.trim() || !formData.storyBackground.trim()) {
      alert('请填写必填项');
      return;
    }
    
    // 如果选择了图片风格但没有上传图片或选择资产图片
    if (formData.styleChoice === 'image' && !formData.uploadedImage && !formData.selectedAssetImage) {
      alert('请上传或选择参考图片');
      return;
    }
    
    // 调用父组件传入的确认回调
    onConfirm(formData);
    
    // 重置表单
    setFormData({
      projectName: '',
      storyBackground: '',
      styleChoice: 'text',
      stylePrompt: '日系动漫风格，明亮的色彩，细腻的线条，可爱的角色设计，背景丰富',
      videoAspect: '16:9',
      videoResolution: '1080p'
    });
    
    // 关闭弹窗
    onClose();
    
    // 跳转到静态漫创建第一步页面
    navigate('/p-static_create_step1');
  };

  // 如果弹窗未打开，则不渲染
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${styles.dialogBackdrop}`} onClick={onClose}>
      <div 
        className={`bg-white rounded-lg border border-gray-200 p-6 w-full max-w-2xl mx-4 ${styles.dialogCard}`} 
        onClick={(e) => e.stopPropagation()} // 阻止事件冒泡，防止点击弹窗内容区域关闭弹窗
      >
        <h2 className="text-xl font-semibold mb-6">创建静态漫</h2>
        
        <form>
          {/* 剧本名称模块 */}
          <div className="mb-6">
            <label htmlFor="projectName" className="block text-sm font-bold text-gray-900 mb-2">
              剧本名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              placeholder="请输入剧本名称"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.formInput}`}
            />
            <p className="text-xs text-gray-500 mt-1">建议包含作品类型和主题，便于后续管理</p>
          </div>
          
          {/* 故事背景模块 */}
          <div className="mb-6">
            <label htmlFor="storyBackground" className="block text-sm font-bold text-gray-900 mb-2">
              故事背景 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="storyBackground"
              placeholder="请简要描述故事的背景设定、主要情节等..."
              value={formData.storyBackground}
              onChange={(e) => handleInputChange('storyBackground', e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.formInput}`}
            />
            <p className="text-xs text-gray-500 mt-1">详细的背景描述有助于 AI 生成更符合预期的画面</p>
          </div>
          
          {/* 画风选择模块 */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              画风选择 <span className="text-red-500">*</span>
            </label>
            
            {/* 文本提示词选项 */}
            <div 
              className={`p-4 rounded-md border ${formData.styleChoice === 'text' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} mb-3 cursor-pointer`}
              onClick={() => handleInputChange('styleChoice', 'text')}
            >
              <div className="flex items-start">
                <input
                  id="styleText"
                  type="radio"
                  name="styleChoice"
                  checked={formData.styleChoice === 'text'}
                  onChange={() => handleInputChange('styleChoice', 'text')}
                  className="mt-1 mr-3"
                />
                <div>
                  <label htmlFor="styleText" className="font-medium text-gray-900 flex items-center">
                    文本提示词
                    <span className="ml-2 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">通过文字描述来定义画风风格</p>
                  {formData.styleChoice === 'text' && (
                    <textarea
                      value={formData.stylePrompt}
                      onChange={(e) => handleInputChange('stylePrompt', e.target.value)}
                      className={`w-full mt-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.formInput}`}
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* 参考图片选项 */}
            <div 
              className={`p-4 rounded-md border ${formData.styleChoice === 'image' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} cursor-pointer`}
              onClick={() => handleInputChange('styleChoice', 'image')}
            >
              <div className="flex items-start">
                <input
                  id="styleImage"
                  type="radio"
                  name="styleChoice"
                  checked={formData.styleChoice === 'image'}
                  onChange={() => handleInputChange('styleChoice', 'image')}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <label htmlFor="styleImage" className="font-medium text-gray-900 flex items-center">
                    参考图片
                    <span className="ml-2 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">上传参考图片来定义画风风格</p>
                  
                  {formData.styleChoice === 'image' && (
                    <div>
                      {/* 图片选择模式切换 */}
                      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                        <button
                          type="button"
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${imageSelectionMode === 'upload' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                          onClick={() => handleImageModeChange('upload')}
                        >
                          本地上传
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${imageSelectionMode === 'asset' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                          onClick={() => handleImageModeChange('asset')}
                        >
                          资产管理选择
                        </button>
                      </div>

                      {/* 本地上传模式 */}
                      {imageSelectionMode === 'upload' && (
                        <div className={`transition-opacity duration-300 ${imageSelectionMode === 'upload' ? 'opacity-100' : 'opacity-0 absolute'}`}>
                          {!formData.uploadedImage ? (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                            >
                              <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                              <p className="text-sm text-gray-500 mb-1">点击上传参考图片</p>
                              <p className="text-xs text-gray-500">支持 JPG、PNG 格式，最大 10MB</p>
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
                                src={formData.uploadedImage} 
                                alt="参考图片预览" 
                                className="w-32 h-32 rounded-lg object-cover"
                              />
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage();
                                }}
                                className="mt-2 text-red-500 text-sm hover:underline"
                              >
                                移除图片
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 资产管理选择模式 */}
                      {imageSelectionMode === 'asset' && (
                        <div className={`transition-opacity duration-300 ${imageSelectionMode === 'asset' ? 'opacity-100' : 'opacity-0 absolute'}`}>
                          {!formData.selectedAssetImage ? (
                            <div>
                              {/* 搜索栏 */}
                              <div className="relative mb-4">
                                <input
                                  type="text"
                                  value={assetSearchTerm}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setAssetSearchTerm(e.target.value);
                                  }}
                                  placeholder="搜索资产中的图片..."
                                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                              </div>
                               
                              {/* 资产图片预览 */}
                              <div className="grid grid-cols-3 gap-2 mb-4 max-h-40 overflow-y-auto">
                                {filteredAssets.slice(0, 6).map(asset => (
                                  <div
                                    key={asset.id}
                                    className="relative group cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAssetSelect(asset);
                                    }}
                                  >
                                    <img
                                      src={asset.url}
                                      alt={asset.name}
                                      className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                                      <i className="fas fa-check text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
                                    </div>
                                  </div>
                                ))}
                              </div>
                               

                            </div>
                          ) : (
                            <div className="mt-3">
                              <img 
                                src={formData.selectedAssetImage.url} 
                                alt={formData.selectedAssetImage.name} 
                                className="w-32 h-32 rounded-lg object-cover"
                              />
                              <p className="text-sm text-gray-700 mt-2">{formData.selectedAssetImage.name}</p>
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveAssetImage();
                                }}
                                className="mt-2 text-red-500 text-sm hover:underline"
                              >
                                移除图片
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 视频比例与分辨率模块 */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* 视频比例 */}
            <div className="flex-1">
              <label htmlFor="videoAspect" className="block text-sm font-bold text-gray-900 mb-2">
                视频比例 <span className="text-red-500">*</span>
              </label>
              <select
                id="videoAspect"
                value={formData.videoAspect}
                onChange={(e) => handleInputChange('videoAspect', e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.formInput}`}
              >
                <option value="16:9">16:9 (横屏)</option>
                <option value="9:16">9:16 (竖屏)</option>
                <option value="1:1">1:1 (正方形)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">根据发布平台选择合适的比例</p>
            </div>
            
            {/* 分辨率 */}
            <div className="flex-1">
              <label htmlFor="videoResolution" className="block text-sm font-bold text-gray-900 mb-2">
                分辨率 <span className="text-red-500">*</span>
              </label>
              <select
                id="videoResolution"
                value={formData.videoResolution}
                onChange={(e) => handleInputChange('videoResolution', e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.formInput}`}
              >
                <option value="1080p">1080p (1920x1080)</option>
                <option value="720p">720p (1280x720)</option>
                <option value="480p">480p (854x480)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">更高的分辨率需要更多的计算资源</p>
            </div>
          </div>
          
          {/* 底部按钮区域 */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaticCreateDialog;