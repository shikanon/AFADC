import React, { useState, useEffect, useMemo } from 'react';
import styles from './styles.module.css';

// 定义资产接口
interface Asset {
  id: string;
  name: string;
  type: string;
  subtype: string;
  url: string;
  tags?: string[];
}

interface AssetSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedAssets: Asset[]) => void;
  initialSelectedAssets?: Asset[]; // 初始选中的资产
}

const AssetSelectDialog: React.FC<AssetSelectDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialSelectedAssets = []
}) => {
  // 搜索关键词
  const [searchTerm, setSearchTerm] = useState('');
  // 选中的资产ID集合
  const initialSelectedAssetIds = useMemo(() => initialSelectedAssets.map(asset => asset.id), [initialSelectedAssets]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(initialSelectedAssetIds);
  
  // 模拟资产数据
  const [mockAssets, setMockAssets] = useState<Asset[]>([
    {
      id: '1',
      name: '魔法学院少女',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i4/O1CN01O1E1jw1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['魔法', '少女', '学院']
    },
    {
      id: '2',
      name: '魔法师导师',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i1/O1CN01QXsZGt1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['魔法', '导师', '智慧']
    },
    {
      id: '3',
      name: '精灵伙伴',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i3/O1CN01O1E1jw1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['精灵', '伙伴', '可爱']
    },
    {
      id: '4',
      name: '暗影刺客',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i2/O1CN01O1E1jw1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['刺客', '暗影', '敏捷']
    },
    {
      id: '5',
      name: '机械战士',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i4/O1CN01O1E1jw1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['机械', '战士', '科技']
    },
    {
      id: '6',
      name: '森林守护者',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i1/O1CN01QXsZGt1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['森林', '守护者', '自然']
    },
    {
      id: '7',
      name: '海盗船长',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i3/O1CN01O1E1jw1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['海盗', '船长', '海洋']
    },
    {
      id: '8',
      name: '贵族小姐',
      type: 'character',
      subtype: 'standing',
      url: 'https://img.alicdn.com/imgextra/i2/O1CN01O1E1jw1ZVrD5nH7hK_!!6000000003202-2-tps-240-240.png',
      tags: ['贵族', '小姐', '优雅']
    }
  ]);

  // 过滤后的资产
  const filteredAssets = mockAssets.filter(asset => {
    // 只显示角色类型的资产
    if (asset.type !== 'character') return false;
    
    // 搜索过滤
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      asset.name.toLowerCase().includes(searchLower) ||
      (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  // 处理资产选择
  const handleAssetSelect = (assetId: string) => {
    setSelectedAssetIds(prev => {
      if (prev.includes(assetId)) {
        // 如果已选中，则取消选中
        return prev.filter(id => id !== assetId);
      } else {
        // 如果未选中，则添加选中（最多选择3个）
        if (prev.length >= 3) {
          // 如果已选择3个，替换最早选择的那个
          return [...prev.slice(1), assetId];
        }
        return [...prev, assetId];
      }
    });
  };

  // 获取选中的资产对象
  const getSelectedAssets = (): Asset[] => {
    return mockAssets.filter(asset => selectedAssetIds.includes(asset.id));
  };

  // 确认选择
  const handleConfirm = () => {
    onConfirm(getSelectedAssets());
    onClose();
  };

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      // 当对话框打开时，重置选中状态为初始值
      setSelectedAssetIds(initialSelectedAssetIds);
    } else {
      // 当对话框关闭时，清空搜索词
      setSearchTerm('');
    }
  }, [isOpen, initialSelectedAssetIds]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.assetSelectDialog}>
        {/* 头部 */}
        <div className={styles.dialogHeader}>
          <h2>资产库 - 角色图片选择</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* 搜索区域 */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="搜索角色名称或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <i className={`fas fa-search ${styles.searchIcon}`}></i>
          </div>
        </div>

        {/* 资产网格 */}
        <div className={styles.assetsGrid}>
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`${styles.assetCard} ${
                  selectedAssetIds.includes(asset.id) ? styles.selected : ''
                }`}
                onClick={() => handleAssetSelect(asset.id)}
              >
                <div className={styles.assetPreview}>
                  <img src={asset.url} alt={asset.name} />
                </div>
                <div className={styles.assetInfo}>
                  <div className={styles.assetName}>{asset.name}</div>
                </div>
                {selectedAssetIds.includes(asset.id) && (
                  <div className={styles.checkmark}>
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>未找到相关角色资产</p>
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        <div className={styles.dialogFooter}>
          <button
            className={`${styles.cancelButton}`}
            onClick={onClose}
          >
            取消
          </button>
          <button
            className={`${styles.confirmButton} ${
              selectedAssetIds.length > 0 ? styles.enabled : ''
            }`}
            onClick={handleConfirm}
            disabled={selectedAssetIds.length === 0}
          >
            确认 ({selectedAssetIds.length}/3)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetSelectDialog;