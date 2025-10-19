import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import { ConfirmDialog } from '../../components/Common';
import styles from './styles.module.css';

// 定义资产类型和子类型
type AssetType = 'image' | 'audio' | 'video';
type ImageSubtype = 'character' | 'scene' | 'prop';

type HistoryRecord = {
  id: string;
  type: AssetType;
  subtype: string;
  prompt: string;
  imageUrl?: string;
  generateTime: string;
};

// AI生成参数接口
interface GenerateParams {
  type: AssetType;
  subtype: string;
  prompt: string;
  size: string;
  referenceImage?: File | null;
}

const AssetGeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 生成参数状态
  const [params, setParams] = useState<GenerateParams>({
    type: 'image',
    subtype: 'character',
    prompt: '',
    size: '1:1',
    referenceImage: null
  });
  
  // 预览和生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [assetName, setAssetName] = useState('');
  
  // 历史记录状态
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // 确认对话框状态
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState({
    title: '',
    message: '',
    confirmText: '确认',
    confirmType: 'default' as 'default' | 'danger',
    onConfirm: () => {},
    isLoading: false
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI资产生成 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟加载历史记录
  useEffect(() => {
    const mockHistory: HistoryRecord[] = [
      {
        id: '1',
        type: 'image',
        subtype: 'character',
        prompt: '可爱的魔法少女，蓝色头发，红色眼睛，穿粉色连衣裙',
        imageUrl: 'https://s.coze.cn/image/3U0w1HOeG4s/',
        generateTime: '2024-01-19 14:30'
      },
      {
        id: '2',
        type: 'image',
        subtype: 'scene',
        prompt: '魔法学院教室，阳光透过窗户，有魔法书和水晶球',
        imageUrl: 'https://s.coze.cn/image/7608UVkB9ho/',
        generateTime: '2024-01-19 10:15'
      },
    ];
    setHistoryRecords(mockHistory);
  }, []);

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 更新生成参数
  const updateParam = <K extends keyof GenerateParams>(key: K, value: GenerateParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // 处理参考图上传
  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updateParam('referenceImage', e.target.files[0]);
    }
  };

  // 移除参考图
  const removeReferenceImage = () => {
    updateParam('referenceImage', null);
  };

  // 生成AI资产
  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      alert('请输入描述文字');
      return;
    }

    setIsGenerating(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟生成结果（实际应从API获取）
      const mockGeneratedImage = params.subtype === 'character' 
        ? 'https://s.coze.cn/image/3U0w1HOeG4s/' 
        : 'https://s.coze.cn/image/7608UVkB9ho/';
      
      setGeneratedImage(mockGeneratedImage);
      
      // 根据参数自动生成资产名称
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const subtypeName = params.subtype === 'character' ? '角色' : 
                          params.subtype === 'scene' ? '场景' : '道具';
      const autoName = `AI生成-${subtypeName}-${currentDate}`;
      setAssetName(autoName);
      
      // 添加到历史记录
      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        type: params.type,
        subtype: params.subtype,
        prompt: params.prompt,
        imageUrl: mockGeneratedImage,
        generateTime: new Date().toLocaleString('zh-CN')
      };
      setHistoryRecords(prev => [newRecord, ...prev]);
      
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 微调参数
  const handleFineTune = (adjustment: string) => {
    let adjustedPrompt = params.prompt;
    
    // 根据微调选项调整提示词
    switch (adjustment) {
      case 'brighter':
        adjustedPrompt += '，明亮的';
        break;
      case 'darker':
        adjustedPrompt += '，暗色调的';
        break;
      case 'more_detail':
        adjustedPrompt += '，细节丰富';
        break;
      case 'simpler':
        adjustedPrompt += '，简约风格';
        break;
    }
    
    updateParam('prompt', adjustedPrompt);
    setGeneratedImage(null); // 清除当前生成结果，等待重新生成
  };

  // 保存生成的资产
  const handleSave = () => {
    if (!generatedImage || !assetName.trim()) {
      alert('请先生成资产并确认资产名称');
      return;
    }
    
    // 这里应该调用API保存资产
    console.log('保存资产:', {
      name: assetName,
      type: params.type,
      subtype: params.subtype,
      imageUrl: generatedImage
    });
    
    // 显示成功消息并跳转到资产列表
    alert('资产保存成功');
    navigate('/asset-manage');
  };

  // 取消并返回资产列表
  const handleCancel = () => {
    if (generatedImage) {
      showConfirmDialog({
        title: '确认取消',
        message: '您当前有未保存的生成结果，确定要放弃吗？',
        confirmText: '放弃',
        confirmType: 'danger',
        onConfirm: () => navigate('/asset-manage')
      });
    } else {
      navigate('/asset-manage');
    }
  };

  // 显示确认对话框
  const showConfirmDialog = (config: {
    title: string;
    message: string;
    confirmText?: string;
    confirmType?: 'default' | 'danger';
    onConfirm: () => void;
  }) => {
    setConfirmDialogConfig({
      ...config,
      confirmText: config.confirmText || '确认',
      confirmType: config.confirmType || 'default',
      isLoading: false
    });
    setIsConfirmDialogVisible(true);
  };

  // 应用历史记录的参数
  const applyHistoryRecord = (record: HistoryRecord) => {
    updateParam('type', record.type);
    updateParam('subtype', record.subtype);
    updateParam('prompt', record.prompt);
    setGeneratedImage(record.imageUrl || null);
    setShowHistory(false);
  };

  // 渲染图片尺寸选项
  const renderSizeOptions = () => {
    const options = [
      { value: '1:1', label: '1:1 (正方形)' },
      { value: '4:3', label: '4:3 (横向)' },
      { value: '16:9', label: '16:9 (宽屏)' },
      { value: '3:4', label: '3:4 (竖向)' },
      { value: '9:16', label: '9:16 (手机屏)' }
    ];
    
    return options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ));
  };

  // 渲染图片子类型选项
  const renderImageSubtypeOptions = () => {
    const options = [
      { value: 'character', label: '角色IP' },
      { value: 'scene', label: '场景' },
      { value: 'prop', label: '道具' }
    ];
    
    return options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ));
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航 */}
      <Header onSidebarToggle={handleSidebarToggle} />

      {/* 侧边栏 */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        activeMenu="asset-generate"
        currentPath={window.location.pathname}
      />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 */}
          <PageHeader 
            title="AI资产生成"
            breadcrumbs={[
              { label: '首页' },
              { label: '资产管理', path: '/asset-manage' },
              { label: 'AI资产生成' }
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* 左侧：参数设置区 */}
            <div className={`${styles.card} p-6 ${generatedImage ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
              <h2 className="text-lg font-semibold mb-4">参数设置</h2>
              
              <div className="space-y-4">
                {/* 资产类型选择 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">资产类型</label>
                  <div className="flex space-x-2">
                    <button 
                      className={`px-4 py-2 text-sm rounded-lg ${params.type === 'image' ? styles.tagActive : styles.tagInactive}`}
                      onClick={() => updateParam('type', 'image')}
                      disabled={isGenerating}
                    >
                      图片
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm rounded-lg ${params.type === 'audio' ? styles.tagActive : styles.tagInactive}`}
                      onClick={() => updateParam('type', 'audio')}
                      disabled={true} // 目前只支持图片
                    >
                      音频 (暂不支持)
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm rounded-lg ${params.type === 'video' ? styles.tagActive : styles.tagInactive}`}
                      onClick={() => updateParam('type', 'video')}
                      disabled={true} // 目前只支持图片
                    >
                      视频 (暂不支持)
                    </button>
                  </div>
                </div>
                
                {/* 子类型选择 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">子类型</label>
                  <select 
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={params.subtype}
                    onChange={(e) => updateParam('subtype', e.target.value)}
                    disabled={isGenerating || params.type !== 'image'}
                  >
                    {renderImageSubtypeOptions()}
                  </select>
                </div>
                
                {/* 描述文字 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">描述文字 (Prompt)</label>
                  <textarea 
                    className={`w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${styles.textArea}`}
                    placeholder="请输入详细描述，越详细生成效果越好..."
                    value={params.prompt}
                    onChange={(e) => updateParam('prompt', e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                
                {/* 图片尺寸 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">尺寸</label>
                  <select 
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={params.size}
                    onChange={(e) => updateParam('size', e.target.value)}
                    disabled={isGenerating || params.type !== 'image'}
                  >
                    {renderSizeOptions()}
                  </select>
                </div>
                
                {/* 参考图上传 */}
                {params.type === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">参考图 (可选)</label>
                    {params.referenceImage ? (
                      <div className="flex items-center justify-between p-3 border border-border-light rounded-lg bg-bg-secondary">
                        <span className="text-sm text-text-secondary truncate">
                          {params.referenceImage.name}
                        </span>
                        <button 
                          className="px-2 py-1 text-sm text-text-secondary hover:text-danger"
                          onClick={removeReferenceImage}
                          disabled={isGenerating}
                        >
                          <i className="fas fa-times"></i> 移除
                        </button>
                      </div>
                    ) : (
                      <label className={`${styles.uploadArea} ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleReferenceImageUpload}
                          disabled={isGenerating}
                        />
                        <i className="fas fa-cloud-upload-alt text-2xl text-text-secondary mb-2"></i>
                        <p className="text-sm text-text-secondary">点击或拖拽图片到此处上传</p>
                      </label>
                    )}
                  </div>
                )}
                
                {/* 生成按钮 */}
                {!generatedImage && (
                  <button 
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGenerate}
                    disabled={isGenerating || !params.prompt.trim() || params.type !== 'image'}
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> 生成中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i> 生成AI资产
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {/* 右侧：生成预览区 */}
            {generatedImage && (
              <div className="lg:col-span-2 space-y-6">
                {/* 生成预览 */}
                <div className={`${styles.card} p-6`}>
                  <h2 className="text-lg font-semibold mb-4">生成预览</h2>
                  
                  <div className={styles.previewContainer}>
                    <img src={generatedImage} alt="生成结果" className={styles.previewImage} />
                  </div>
                  
                  {/* 微调按钮 */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button 
                      className="px-3 py-1 text-sm border border-border-light rounded-lg hover:bg-bg-secondary transition-colors"
                      onClick={() => handleFineTune('brighter')}
                    >
                      <i className="fas fa-sun mr-1"></i> 更亮
                    </button>
                    <button 
                      className="px-3 py-1 text-sm border border-border-light rounded-lg hover:bg-bg-secondary transition-colors"
                      onClick={() => handleFineTune('darker')}
                    >
                      <i className="fas fa-moon mr-1"></i> 更暗
                    </button>
                    <button 
                      className="px-3 py-1 text-sm border border-border-light rounded-lg hover:bg-bg-secondary transition-colors"
                      onClick={() => handleFineTune('more_detail')}
                    >
                      <i className="fas fa-detail mr-1"></i> 增加细节
                    </button>
                    <button 
                      className="px-3 py-1 text-sm border border-border-light rounded-lg hover:bg-bg-secondary transition-colors"
                      onClick={() => handleFineTune('simpler')}
                    >
                      <i className="fas fa-feather mr-1"></i> 简化风格
                    </button>
                    <button 
                      className="px-3 py-1 text-sm border border-border-light rounded-lg hover:bg-bg-secondary transition-colors"
                      onClick={() => {
                        setGeneratedImage(null);
                        setAssetName('');
                      }}
                    >
                      <i className="fas fa-redo mr-1"></i> 重新生成
                    </button>
                  </div>
                </div>
                
                {/* 资产信息和操作区 */}
                <div className={`${styles.card} p-6`}>
                  <h2 className="text-lg font-semibold mb-4">资产信息</h2>
                  
                  <div className="space-y-4">
                    {/* 资产名称 */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">资产名称</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={assetName}
                        onChange={(e) => setAssetName(e.target.value)}
                        placeholder="自动生成，可自定义"
                      />
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className={styles.buttonGroup}>
                      <button 
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex-1"
                        onClick={handleSave}
                      >
                        <i className="fas fa-save mr-2"></i> 确认保存
                      </button>
                      <button 
                        className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors flex-1"
                        onClick={handleCancel}
                      >
                        <i className="fas fa-times mr-2"></i> 取消
                      </button>
                      <button 
                        className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors flex-shrink-0"
                        onClick={() => setShowHistory(!showHistory)}
                      >
                        <i className="fas fa-history mr-2"></i> 历史记录
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 历史生成记录 */}
                {showHistory && (
                  <div className={`${styles.card} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">历史生成记录</h2>
                      <button 
                        className="text-sm text-text-secondary hover:text-text-primary"
                        onClick={() => setShowHistory(false)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {historyRecords.length > 0 ? (
                        historyRecords.map(record => (
                          <div 
                            key={record.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${styles.historyItem}`}
                            onClick={() => applyHistoryRecord(record)}
                          >
                            <div className="flex items-start">
                              {record.imageUrl && (
                                <img 
                                  src={record.imageUrl} 
                                  alt="历史记录" 
                                  className="w-16 h-16 object-cover rounded mr-3"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-text-primary truncate">
                                  {record.prompt.length > 30 
                                    ? `${record.prompt.substring(0, 30)}...` 
                                    : record.prompt}
                                </div>
                                <div className="text-xs text-text-secondary mt-1">
                                  {record.type === 'image' ? '图片' : record.type} / 
                                  {record.subtype === 'character' ? '角色IP' : 
                                   record.subtype === 'scene' ? '场景' : 
                                   record.subtype === 'prop' ? '道具' : record.subtype}
                                </div>
                                <div className="text-xs text-text-secondary mt-1">
                                  {record.generateTime}
                                </div>
                              </div>
                              <button 
                                className="ml-2 text-text-secondary hover:text-primary p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  applyHistoryRecord(record);
                                }}
                              >
                                <i className="fas fa-sync-alt"></i>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-text-secondary">暂无历史记录</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 确认对话框 */}
      <ConfirmDialog 
        isVisible={isConfirmDialogVisible}
        title={confirmDialogConfig.title}
        message={confirmDialogConfig.message}
        confirmText={confirmDialogConfig.confirmText}
        confirmType={confirmDialogConfig.confirmType}
        onConfirm={confirmDialogConfig.onConfirm}
        onCancel={() => setIsConfirmDialogVisible(false)}
        isLoading={confirmDialogConfig.isLoading}
      />
    </div>
  );
};

export default AssetGeneratePage;