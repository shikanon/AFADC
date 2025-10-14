

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import { SearchToolbar, ConfirmDialog } from '../../components/Common';
import styles from './styles.module.css';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video';
  subtype: 'character' | 'scene' | 'bgm' | 'voice' | 'effect';
  uploader: string;
  uploadTime: string;
  previewUrl?: string;
  fileUrl?: string;
}

type AssetType = 'image' | 'audio' | 'video';
type AssetSubtype = 'character' | 'scene' | 'bgm' | 'voice' | 'effect';

const AssetManagePage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<AssetType>('image');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const [subtypeFilter, setSubtypeFilter] = useState('');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [uploadSubtype, setUploadSubtype] = useState('');
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  
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
    document.title = '资产管理 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟资产数据
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      name: '魔法少女小樱',
      type: 'image',
      subtype: 'character',
      uploader: '张设计师',
      uploadTime: '2024-01-15 14:30',
      previewUrl: 'https://s.coze.cn/image/3U0w1HOeG4s/'
    },
    {
      id: '2',
      name: '魔法学院教室',
      type: 'image',
      subtype: 'scene',
      uploader: '李动画师',
      uploadTime: '2024-01-14 09:15',
      previewUrl: 'https://s.coze.cn/image/7608UVkB9ho/'
    },
    {
      id: '3',
      name: '温馨钢琴曲',
      type: 'audio',
      subtype: 'bgm',
      uploader: '王编剧',
      uploadTime: '2024-01-13 16:45',
      fileUrl: 'https://example.com/audio/warm-piano.mp3'
    },
    {
      id: '4',
      name: '甜美女声克隆',
      type: 'audio',
      subtype: 'voice',
      uploader: '陈策划',
      uploadTime: '2024-01-12 11:20',
      fileUrl: 'https://example.com/audio/sweet-female-voice.mp3'
    },
    {
      id: '5',
      name: '魔法闪光特效',
      type: 'video',
      subtype: 'effect',
      uploader: '刘导演',
      uploadTime: '2024-01-11 13:50',
      fileUrl: 'https://example.com/video/magic-flash.mp4'
    }
  ]);

  // 筛选资产
  const filteredAssets = assets.filter(asset => {
    const matchesType = asset.type === activeTab;
    const matchesSearch = asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase());
    const matchesSubtype = !subtypeFilter || asset.subtype === subtypeFilter;
    return matchesType && matchesSearch && matchesSubtype;
  });

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 处理标签页切换
  const handleTabChange = (tabType: AssetType) => {
    setActiveTab(tabType);
    setSubtypeFilter('');
    setSelectedAssets(new Set());
  };

  // 处理资产选择
  const handleAssetSelect = (assetId: string, checked: boolean) => {
    const newSelectedAssets = new Set(selectedAssets);
    if (checked) {
      newSelectedAssets.add(assetId);
    } else {
      newSelectedAssets.delete(assetId);
    }
    setSelectedAssets(newSelectedAssets);
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(new Set(filteredAssets.map(asset => asset.id)));
    } else {
      setSelectedAssets(new Set());
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

  // 处理资产删除
  const handleDeleteAsset = (assetId: string) => {
    showConfirmDialog({
      title: '删除资产',
      message: '确定要删除这个资产吗？',
      confirmType: 'danger',
      confirmText: '删除',
      onConfirm: () => {
        console.log('删除资产', assetId);
        // 这里应该调用删除API
        setIsConfirmDialogVisible(false);
      }
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedAssets.size === 0) return;
    
    showConfirmDialog({
      title: '批量删除',
      message: `确定要删除选中的 ${selectedAssets.size} 个资产吗？`,
      confirmType: 'danger',
      confirmText: '批量删除',
      onConfirm: () => {
        console.log('批量删除资产', Array.from(selectedAssets));
        // 这里应该调用批量删除API
        setSelectedAssets(new Set());
        setIsConfirmDialogVisible(false);
      }
    });
  };

  // 处理上传资产
  const handleUploadAsset = () => {
    if (!uploadType || !uploadSubtype || !uploadFiles) {
      alert('请填写完整的资产信息并选择文件');
      return;
    }
    
    console.log('开始上传资产', {
      type: uploadType,
      subtype: uploadSubtype,
      files: Array.from(uploadFiles).map(file => file.name)
    });
    
    alert('资产上传成功！');
    setIsUploadModalVisible(false);
    resetUploadForm();
  };

  // 重置上传表单
  const resetUploadForm = () => {
    setUploadType('');
    setUploadSubtype('');
    setUploadFiles(null);
  };

  // 获取子类型选项
  const getSubtypeOptions = (assetType: AssetType) => {
    const options = {
      'image': [
        { value: '', text: '全部子类型' },
        { value: 'character', text: '角色IP' },
        { value: 'scene', text: '场景' }
      ],
      'audio': [
        { value: '', text: '全部子类型' },
        { value: 'bgm', text: '音乐BGM' },
        { value: 'voice', text: '声音克隆' }
      ],
      'video': [
        { value: '', text: '全部子类型' },
        { value: 'effect', text: '视频特效' }
      ]
    };
    return options[assetType] || [];
  };

  // 获取上传子类型选项
  const getUploadSubtypeOptions = (assetType: string) => {
    const options = {
      'image': [
        { value: '', text: '请选择子类型' },
        { value: 'character', text: '角色IP' },
        { value: 'scene', text: '场景' }
      ],
      'audio': [
        { value: '', text: '请选择子类型' },
        { value: 'bgm', text: '音乐BGM' },
        { value: 'voice', text: '声音克隆' }
      ],
      'video': [
        { value: '', text: '请选择子类型' },
        { value: 'effect', text: '视频特效' }
      ]
    };
    return options[assetType as AssetType] || [{ value: '', text: '请先选择资产类型' }];
  };

  // 渲染资产预览
  const renderAssetPreview = (asset: Asset) => {
    switch (asset.type) {
      case 'image':
        return (
          <img 
            src={asset.previewUrl} 
            alt={asset.name} 
            className={styles.assetPreview}
          />
        );
      case 'audio':
        return (
          <audio controls className={styles.audioPlayer} title={asset.name}>
            <source src={asset.fileUrl} type="audio/mpeg" />
          </audio>
        );
      case 'video':
        return (
          <video controls className={styles.videoPreview} title={asset.name}>
            <source src={asset.fileUrl} type="video/mp4" />
          </video>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 使用Header组件替换重复的顶部导航栏代码 */}
      <Header onSidebarToggle={handleSidebarToggle} />

      {/* 使用Sidebar组件替换重复的侧边栏代码 */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        activeMenu="asset-manage"
      />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 使用PageHeader组件替换重复的页面头部代码 */}
          <PageHeader 
            title="资产管理"
            breadcrumbs={[
              { label: '首页' },
              { label: '资产管理' }
            ]}
            actions={
              <button 
                onClick={() => setIsUploadModalVisible(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-upload mr-2"></i>上传资产
              </button>
            }
          />

          {/* 标签页 */}
          <div className="flex space-x-4 mb-6" role="tablist">
            <button 
              onClick={() => handleTabChange('image')}
              className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
                activeTab === 'image' ? styles.tabActive : styles.tabInactive
              }`}
              role="tab"
            >
              图片类资产
            </button>
            <button 
              onClick={() => handleTabChange('audio')}
              className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
                activeTab === 'audio' ? styles.tabActive : styles.tabInactive
              }`}
              role="tab"
            >
              音频资产
            </button>
            <button 
              onClick={() => handleTabChange('video')}
              className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
                activeTab === 'video' ? styles.tabActive : styles.tabInactive
              }`}
              role="tab"
            >
              视频资产
            </button>
          </div>

          {/* 工具栏 - 使用SearchToolbar组件 */}
          <SearchToolbar 
            searchValue={assetSearchTerm}
            onSearchChange={(e) => setAssetSearchTerm(e.target.value)}
            searchPlaceholder="搜索资产名称、标签..."
            filters={[
              {
                label: '子类型',
                value: subtypeFilter,
                onChange: (e) => setSubtypeFilter(e.target.value),
                options: getSubtypeOptions(activeTab).map(option => ({
                  value: option.value,
                  label: option.text
                }))
              }
            ]}
            actions={
              selectedAssets.size > 0 ? (
                <button 
                  onClick={handleBatchDelete}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  批量删除
                </button>
              ) : undefined
            }
          />

          {/* 资产列表 */}
          <div className="bg-white rounded-lg border border-border-light overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={filteredAssets.length > 0 && selectedAssets.size === filteredAssets.length}
                        ref={(input) => {
                          if (input) input.indeterminate = selectedAssets.size > 0 && selectedAssets.size < filteredAssets.length;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-border-medium"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">资产名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">预览</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">子类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">上传人</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">上传时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className={`border-t border-border-light ${styles.tableRowHover}`}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedAssets.has(asset.id)}
                          onChange={(e) => handleAssetSelect(asset.id, e.target.checked)}
                          className="rounded border-border-medium"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-text-primary">{asset.name}</div>
                        <div className="text-sm text-text-secondary">ID: ASSET-{asset.id.padStart(3, '0')}</div>
                      </td>
                      <td className="px-4 py-3">
                        {renderAssetPreview(asset)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${styles.typeBadge} ${styles[`type${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}`]}`}>
                          {asset.type === 'image' ? '图片' : asset.type === 'audio' ? '音频' : '视频'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${styles.subtypeBadge} ${styles[`subtype${asset.subtype.charAt(0).toUpperCase() + asset.subtype.slice(1)}`]}`}>
                          {asset.subtype === 'character' ? '角色IP' : 
                           asset.subtype === 'scene' ? '场景' :
                           asset.subtype === 'bgm' ? '音乐BGM' :
                           asset.subtype === 'voice' ? '声音克隆' : '视频特效'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-primary">{asset.uploader}</td>
                      <td className="px-4 py-3 text-text-secondary">{asset.uploadTime}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => console.log('预览资产', asset.id)}
                            className="text-primary hover:text-blue-600 text-sm" 
                            title={asset.type === 'audio' ? '试听' : '预览'}
                          >
                            <i className={`fas ${asset.type === 'audio' ? 'fa-play' : 'fa-eye'}`}></i>
                          </button>
                          <button 
                            onClick={() => console.log('编辑资产', asset.id)}
                            className="text-text-secondary hover:text-text-primary text-sm" 
                            title="编辑"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="text-danger hover:text-red-600 text-sm" 
                            title="删除"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-text-secondary">
              共 <span className="font-medium text-text-primary">15</span> 个资产，每页显示
              <select className="mx-2 border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="10">10</option>
                <option value="20" selected>20</option>
                <option value="50">50</option>
              </select> 个
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors disabled:opacity-50" disabled>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">2</button>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
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

      {/* 上传文件对话框 */}
      {isUploadModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">上传资产</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">资产类型</label>
                    <select 
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">请选择资产类型</option>
                      <option value="image">图片</option>
                      <option value="audio">音频</option>
                      <option value="video">视频</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">子类型</label>
                    <select 
                      value={uploadSubtype}
                      onChange={(e) => setUploadSubtype(e.target.value)}
                      disabled={!uploadType}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {getUploadSubtypeOptions(uploadType).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">选择文件</label>
                    <input 
                      type="file" 
                      onChange={(e) => setUploadFiles(e.target.files)}
                      multiple
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    onClick={() => {
                      setIsUploadModalVisible(false);
                      resetUploadForm();
                    }}
                    className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleUploadAsset}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    上传
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

export default AssetManagePage;

