

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video';
  subtype: 'character' | 'scene' | 'bgm' | 'voice' | 'effect';
  url: string;
  tags: string[];
  uploader: string;
  uploadTime: string;
}

const AssetSelectDialog: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [subtypeFilter, setSubtypeFilter] = useState('');
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);

  // 模拟资产数据
  const mockAssets: Asset[] = [
    {
      id: 'asset-001',
      name: '魔法少女立绘',
      type: 'image',
      subtype: 'character',
      url: 'https://s.coze.cn/image/RZUHCmZ3Yf4/',
      tags: ['魔法', '少女', '立绘'],
      uploader: '张设计师',
      uploadTime: '2024-01-15'
    },
    {
      id: 'asset-002',
      name: '未来都市背景',
      type: 'image',
      subtype: 'scene',
      url: 'https://s.coze.cn/image/fS5ZZ8SEQ7c/',
      tags: ['未来', '都市', '背景'],
      uploader: '李动画师',
      uploadTime: '2024-01-14'
    },
    {
      id: 'asset-003',
      name: '温馨钢琴曲',
      type: 'audio',
      subtype: 'bgm',
      url: 'https://s.coze.cn/audio/sample1.mp3',
      tags: ['钢琴', '温馨', '背景音乐'],
      uploader: '王音乐人',
      uploadTime: '2024-01-13'
    },
    {
      id: 'asset-004',
      name: '甜美女声克隆',
      type: 'audio',
      subtype: 'voice',
      url: 'https://s.coze.cn/audio/voice1.mp3',
      tags: ['女声', '甜美', '克隆'],
      uploader: '陈配音师',
      uploadTime: '2024-01-12'
    },
    {
      id: 'asset-005',
      name: '火焰特效',
      type: 'video',
      subtype: 'effect',
      url: 'https://s.coze.cn/video/effect1.mp4',
      tags: ['火焰', '特效', '动画'],
      uploader: '特效师',
      uploadTime: '2024-01-11'
    },
    {
      id: 'asset-006',
      name: '校园少女立绘',
      type: 'image',
      subtype: 'character',
      url: 'https://s.coze.cn/image/nHEFdHx37tY/',
      tags: ['校园', '少女', '立绘'],
      uploader: '张设计师',
      uploadTime: '2024-01-10'
    },
    {
      id: 'asset-007',
      name: '森林场景',
      type: 'image',
      subtype: 'scene',
      url: 'https://s.coze.cn/image/8wIoJymFFuY/',
      tags: ['森林', '自然', '场景'],
      uploader: '李动画师',
      uploadTime: '2024-01-09'
    },
    {
      id: 'asset-008',
      name: '激昂交响乐',
      type: 'audio',
      subtype: 'bgm',
      url: 'https://s.coze.cn/audio/sample2.mp3',
      tags: ['交响乐', '激昂', '背景音乐'],
      uploader: '王音乐人',
      uploadTime: '2024-01-08'
    },
    {
      id: 'asset-009',
      name: '成熟男声克隆',
      type: 'audio',
      subtype: 'voice',
      url: 'https://s.coze.cn/audio/voice2.mp3',
      tags: ['男声', '成熟', '克隆'],
      uploader: '陈配音师',
      uploadTime: '2024-01-07'
    },
    {
      id: 'asset-010',
      name: '闪电特效',
      type: 'video',
      subtype: 'effect',
      url: 'https://s.coze.cn/video/effect2.mp4',
      tags: ['闪电', '特效', '动画'],
      uploader: '特效师',
      uploadTime: '2024-01-06'
    },
    {
      id: 'asset-011',
      name: '古风美人立绘',
      type: 'image',
      subtype: 'character',
      url: 'https://s.coze.cn/image/SewzwtP2qbk/',
      tags: ['古风', '美人', '立绘'],
      uploader: '张设计师',
      uploadTime: '2024-01-05'
    },
    {
      id: 'asset-012',
      name: '星空背景',
      type: 'image',
      subtype: 'scene',
      url: 'https://s.coze.cn/image/diO_lCBxDs4/',
      tags: ['星空', '夜晚', '背景'],
      uploader: '李动画师',
      uploadTime: '2024-01-04'
    },
    {
      id: 'asset-013',
      name: '轻松吉他曲',
      type: 'audio',
      subtype: 'bgm',
      url: 'https://s.coze.cn/audio/sample3.mp3',
      tags: ['吉他', '轻松', '背景音乐'],
      uploader: '王音乐人',
      uploadTime: '2024-01-03'
    },
    {
      id: 'asset-014',
      name: '可爱童声克隆',
      type: 'audio',
      subtype: 'voice',
      url: 'https://s.coze.cn/audio/voice3.mp3',
      tags: ['童声', '可爱', '克隆'],
      uploader: '陈配音师',
      uploadTime: '2024-01-02'
    },
    {
      id: 'asset-015',
      name: '雪花特效',
      type: 'video',
      subtype: 'effect',
      url: 'https://s.coze.cn/video/effect3.mp4',
      tags: ['雪花', '特效', '动画'],
      uploader: '特效师',
      uploadTime: '2024-01-01'
    }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '选择资产 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化筛选
  useEffect(() => {
    const assetType = searchParams.get('asset_type');
    if (assetType) {
      setTypeFilter(assetType);
      setFilteredAssets(mockAssets.filter(asset => asset.type === assetType));
    } else {
      setFilteredAssets([...mockAssets]);
    }
  }, [searchParams]);

  // 筛选资产
  useEffect(() => {
    const filtered = mockAssets.filter(asset => {
      const matchesSearch = !searchTerm || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = !typeFilter || asset.type === typeFilter;
      const matchesSubtype = !subtypeFilter || asset.subtype === subtypeFilter;

      return matchesSearch && matchesType && matchesSubtype;
    });

    setFilteredAssets(filtered);
  }, [searchTerm, typeFilter, subtypeFilter]);

  // 处理类型筛选变化
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setSubtypeFilter(''); // 重置子类型选择
  };

  // 获取可用的子类型选项
  const getAvailableSubtypes = () => {
    if (!typeFilter) {
      return [
        { value: '', label: '全部子类型' },
        { value: 'character', label: '角色IP' },
        { value: 'scene', label: '场景' },
        { value: 'bgm', label: '音乐BGM' },
        { value: 'voice', label: '声音克隆' },
        { value: 'effect', label: '视频特效' }
      ];
    }

    switch (typeFilter) {
      case 'image':
        return [
          { value: '', label: '全部子类型' },
          { value: 'character', label: '角色IP' },
          { value: 'scene', label: '场景' }
        ];
      case 'audio':
        return [
          { value: '', label: '全部子类型' },
          { value: 'bgm', label: '音乐BGM' },
          { value: 'voice', label: '声音克隆' }
        ];
      case 'video':
        return [
          { value: '', label: '全部子类型' },
          { value: 'effect', label: '视频特效' }
        ];
      default:
        return [{ value: '', label: '全部子类型' }];
    }
  };

  // 切换资产选择
  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssetIds(prev => {
      const index = prev.indexOf(assetId);
      if (index > -1) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  // 清除筛选
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setSubtypeFilter('');
  };

  // 清除选择
  const clearSelection = () => {
    setSelectedAssetIds([]);
  };

  // 预览资产
  const previewAsset = (asset: Asset) => {
    if (asset.type === 'image') {
      const modal = window.open('', '_blank', 'width=800,height=600');
      if (modal) {
        modal.document.write(`
          <html>
            <head><title>预览 - ${asset.name}</title></head>
            <body style="margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#000;">
              <img src="${asset.url}" alt="${asset.name}" style="max-width:90%; max-height:90%;">
            </body>
          </html>
        `);
      }
    } else if (asset.type === 'audio') {
      const audio = new Audio(asset.url);
      audio.play().catch(error => {
        console.log('音频播放失败:', error);
        alert('音频播放失败，请检查浏览器设置');
      });
    } else if (asset.type === 'video') {
      const modal = window.open('', '_blank', 'width=800,height=600');
      if (modal) {
        modal.document.write(`
          <html>
            <head><title>预览 - ${asset.name}</title></head>
            <body style="margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#000;">
              <video controls style="max-width:90%; max-height:90%;">
                <source src="${asset.url}" type="video/mp4">
                您的浏览器不支持视频播放。
              </video>
            </body>
          </html>
        `);
      }
    }
  };

  // 确认选择
  const confirmSelection = () => {
    if (selectedAssetIds.length > 0) {
      const selectedAssetDetails = selectedAssetIds.map(id => 
        mockAssets.find(asset => asset.id === id)
      ).filter(Boolean);

      // 将选中的资产信息存储到sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedAssets', JSON.stringify(selectedAssetDetails));
      }
      
      closeModal();
    }
  };

  // 关闭弹窗
  const closeModal = () => {
    navigate(-1);
  };

  // 处理背景点击
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 获取类型显示名称
  const getTypeName = (type: string) => {
    const typeNames = {
      'image': '图片',
      'audio': '音频',
      'video': '视频'
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  // 获取子类型显示名称
  const getSubTypeName = (subtype: string) => {
    const subtypeNames = {
      'character': '角色IP',
      'scene': '场景',
      'bgm': '音乐BGM',
      'voice': '声音克隆',
      'effect': '视频特效'
    };
    return subtypeNames[subtype as keyof typeof subtypeNames] || subtype;
  };

  // 渲染资产预览
  const renderAssetPreview = (asset: Asset) => {
    if (asset.type === 'image') {
      return (
        <img 
          src={asset.url} 
          alt={asset.name} 
          className="w-full h-32 object-cover rounded-lg" 
          loading="lazy"
        />
      );
    } else if (asset.type === 'audio') {
      return (
        <div className="w-full h-32 bg-bg-secondary rounded-lg flex items-center justify-center">
          <i className="fas fa-music text-4xl text-text-secondary"></i>
        </div>
      );
    } else if (asset.type === 'video') {
      return (
        <div className="w-full h-32 bg-bg-secondary rounded-lg flex items-center justify-center">
          <i className="fas fa-play-circle text-4xl text-text-secondary"></i>
        </div>
      );
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗背景 */}
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} flex items-center justify-center z-50 p-4`}
        onClick={handleBackdropClick}
      >
        {/* 弹窗主体 */}
        <div className="bg-white rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-search text-white text-sm"></i>
              </div>
              <h2 className="text-xl font-semibold text-text-primary">选择资产</h2>
            </div>
            <button 
              onClick={closeModal}
              className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>

          {/* 搜索和筛选区域 */}
          <div className="p-6 border-b border-border-light">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索资产名称、标签..." 
                    className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                </div>
              </div>
              
              {/* 筛选条件 */}
              <div className="flex flex-wrap items-center space-x-3">
                <select 
                  value={typeFilter}
                  onChange={(e) => handleTypeFilterChange(e.target.value)}
                  className="px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">全部类型</option>
                  <option value="image">图片</option>
                  <option value="audio">音频</option>
                  <option value="video">视频</option>
                </select>
                <select 
                  value={subtypeFilter}
                  onChange={(e) => setSubtypeFilter(e.target.value)}
                  className="px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {getAvailableSubtypes().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={clearFilters}
                  className="px-3 py-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <i className="fas fa-times mr-1"></i>清除筛选
                </button>
              </div>
            </div>
          </div>

          {/* 资产列表区域 */}
          <div className="flex-1 overflow-hidden">
            <div className="p-6 h-full overflow-y-auto">
              {/* 选中状态提示 */}
              {selectedAssetIds.length > 0 && (
                <div className="mb-4 p-3 bg-bg-secondary rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      已选择 <span className="font-medium text-primary">{selectedAssetIds.length}</span> 个资产
                    </span>
                    <button 
                      onClick={clearSelection}
                      className="text-sm text-text-secondary hover:text-danger transition-colors"
                    >
                      <i className="fas fa-times mr-1"></i>取消选择
                    </button>
                  </div>
                </div>
              )}

              {/* 资产网格 */}
              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredAssets.map(asset => {
                    const isSelected = selectedAssetIds.includes(asset.id);
                    const typeClass = `type-${asset.type}`;
                    const subtypeClass = `subtype-${asset.subtype}`;
                    
                    return (
                      <div 
                        key={asset.id}
                        className={`${styles.assetCard} bg-white rounded-lg border border-border-light p-3 relative ${isSelected ? styles.selected : ''}`}
                        onClick={() => toggleAssetSelection(asset.id)}
                      >
                        <div className={`${styles.assetPreview} mb-3`}>
                          {renderAssetPreview(asset)}
                          <div className={styles.assetOverlay}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                previewAsset(asset);
                              }}
                              className="p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 transition-colors"
                            >
                              <i className="fas fa-eye text-text-primary"></i>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-text-primary truncate" title={asset.name}>
                            {asset.name}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            <span className={`${styles.assetTypeBadge} ${styles[typeClass]}`}>
                              {getTypeName(asset.type)}
                            </span>
                            <span className={`${styles.assetTypeBadge} ${styles[subtypeClass]}`}>
                              {getSubTypeName(asset.subtype)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-text-secondary">
                            <span>{asset.uploader}</span>
                            <span>{asset.uploadTime}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-white text-xs"></i>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 无结果提示 */
                <div className="text-center py-12">
                  <i className="fas fa-search text-4xl text-text-secondary mb-4"></i>
                  <h3 className="text-lg font-medium text-text-primary mb-2">未找到匹配的资产</h3>
                  <p className="text-text-secondary">请尝试调整搜索关键词或筛选条件</p>
                </div>
              )}
            </div>
          </div>

          {/* 弹窗底部操作按钮 */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-bg-secondary">
            <button 
              onClick={closeModal}
              className="px-6 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-white transition-colors"
            >
              取消
            </button>
            <button 
              onClick={confirmSelection}
              disabled={selectedAssetIds.length === 0}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-check mr-2"></i>确定选择 ({selectedAssetIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetSelectDialog;

