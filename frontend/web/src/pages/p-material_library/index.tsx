

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface MaterialItem {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video';
  category: string;
  url: string;
  uploadDate: string;
  size?: string;
  duration?: string;
}

const MaterialLibrary: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialTypeFilter, setMaterialTypeFilter] = useState('');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState('');
  const [materialSort, setMaterialSort] = useState('uploaded_desc');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '素材库管理 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  // 素材数据
  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: 'mat001',
      name: '樱花背景图',
      type: 'image',
      category: '背景',
      url: 'https://s.coze.cn/image/0xl9ykHM84M/',
      uploadDate: '2024-01-15',
      size: '2.3MB'
    },
    {
      id: 'mat002',
      name: '温馨钢琴曲',
      type: 'audio',
      category: '音乐',
      url: 'https://s.coze.cn/audio/piano123/',
      uploadDate: '2024-01-14',
      duration: '3:45'
    },
    {
      id: 'mat003',
      name: '星空背景视频',
      type: 'video',
      category: '背景',
      url: 'https://s.coze.cn/video/starry123/',
      uploadDate: '2024-01-13',
      duration: '1:30'
    },
    {
      id: 'mat004',
      name: '魔法城堡',
      type: 'image',
      category: '背景',
      url: 'https://s.coze.cn/image/Jc4-ue0joRM/',
      uploadDate: '2024-01-12',
      size: '1.8MB'
    },
    {
      id: 'mat005',
      name: '风声音效',
      type: 'audio',
      category: '音效',
      url: 'https://s.coze.cn/audio/wind123/',
      uploadDate: '2024-01-11',
      duration: '0:30'
    },
    {
      id: 'mat006',
      name: '都市夜景',
      type: 'image',
      category: '背景',
      url: 'https://s.coze.cn/image/vtVtBJczOEE/',
      uploadDate: '2024-01-10',
      size: '3.1MB'
    },
    {
      id: 'mat007',
      name: '海洋波浪视频',
      type: 'video',
      category: '背景',
      url: 'https://s.coze.cn/video/ocean123/',
      uploadDate: '2024-01-09',
      duration: '2:15'
    },
    {
      id: 'mat008',
      name: '轻快吉他曲',
      type: 'audio',
      category: '音乐',
      url: 'https://s.coze.cn/audio/guitar123/',
      uploadDate: '2024-01-08',
      duration: '2:58'
    }
  ]);

  // 模态框控制函数
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);
  
  const openPreviewModal = (material: MaterialItem) => {
    setSelectedMaterial(material);
    setIsPreviewModalOpen(true);
  };
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedMaterial(null);
  };
  
  const openDeleteModal = (materialId: string) => {
    setMaterialToDelete(materialId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMaterialToDelete(null);
  };

  // 素材操作函数
  const handleCopyLink = async (materialId: string) => {
    const materialUrl = `https://s.coze.cn/image/LhoPZOfBwpw/${materialId}`;
    try {
      await navigator.clipboard.writeText(materialUrl);
      console.log('链接已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleDeleteMaterial = () => {
    if (materialToDelete) {
      setMaterials(prev => prev.filter(m => m.id !== materialToDelete));
      closeDeleteModal();
      console.log('删除素材:', materialToDelete);
    }
  };

  // 表单处理函数
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('选择文件:', file.name);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const materialName = formData.get('material-name') as string;
    const materialCategory = formData.get('material-category') as string;
    const materialFile = formData.get('material-file') as File;

    if (materialFile) {
      console.log('上传素材:', {
        name: materialName,
        category: materialCategory,
        file: materialFile.name
      });
      alert('素材上传成功！');
      closeUploadModal();
      (e.target as HTMLFormElement).reset();
    }
  };

  // 搜索和筛选处理
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(materialSearch.toLowerCase());
    const matchesType = !materialTypeFilter || material.type === materialTypeFilter;
    const matchesCategory = !materialCategoryFilter || material.category === materialCategoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  // 渲染素材卡片内容
  const renderMaterialContent = (material: MaterialItem) => {
    if (material.type === 'image') {
      return (
        <img 
          src={material.url} 
          alt={material.name} 
          className="w-full h-48 object-cover rounded-t-xl" 
        />
      );
    } else if (material.type === 'audio') {
      return (
        <div className={`w-full h-48 rounded-t-xl flex items-center justify-center ${
          material.category === '音乐' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 
          'bg-gradient-to-br from-blue-400 to-blue-600'
        }`}>
          <i className={`fas ${material.category === '音乐' ? 'fa-music' : 'fa-volume-up'} text-white text-4xl`}></i>
        </div>
      );
    } else if (material.type === 'video') {
      return (
        <>
          <img 
            src={material.url.replace('video', 'image')} 
            alt={`${material.name}预览`} 
            className="w-full h-48 object-cover rounded-t-xl" 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
              <i className="fas fa-play text-white ml-1"></i>
            </div>
          </div>
        </>
      );
    }
  };

  // 渲染预览内容
  const renderPreviewContent = () => {
    if (!selectedMaterial) return null;

    if (selectedMaterial.type === 'image') {
      return (
        <img 
          src={selectedMaterial.url} 
          alt={selectedMaterial.name} 
          className="max-w-full max-h-96 mx-auto rounded-lg" 
        />
      );
    } else if (selectedMaterial.type === 'audio') {
      return (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-lg p-6 mb-4">
            <i className="fas fa-music text-4xl text-secondary mb-4"></i>
            <p className="text-text-secondary mb-4">{selectedMaterial.name}</p>
            <audio controls className="w-full">
              <source src={selectedMaterial.url} type="audio/mpeg" />
              您的浏览器不支持音频播放。
            </audio>
          </div>
        </div>
      );
    } else if (selectedMaterial.type === 'video') {
      return (
        <video controls className="max-w-full max-h-96 mx-auto rounded-lg">
          <source src={selectedMaterial.url} type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
      );
    }
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
                  src="https://s.coze.cn/image/vPXp5FgfIfM/" 
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
              <Link to="/scenario-editor" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemHover}`}>
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
              <Link to="/material-library" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${styles.navItemActive}`}>
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
              <li><Link to="/workspace-list" className="hover:text-primary">首页</Link></li>
              <li><i className="fas fa-chevron-right text-xs"></i></li>
              <li><span className="text-text-primary">素材库管理</span></li>
            </ol>
          </nav>
          
          {/* 页面标题和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">素材库管理</h1>
              <p className="text-text-secondary">管理和上传您的素材资源</p>
            </div>
            <button 
              onClick={openUploadModal}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <i className="fas fa-upload mr-2"></i>上传素材
            </button>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <input 
                  type="text" 
                  placeholder="搜索素材名称..." 
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                />
              </div>
            </div>
            
            {/* 筛选和排序 */}
            <div className="flex items-center space-x-3">
              <select 
                value={materialTypeFilter}
                onChange={(e) => setMaterialTypeFilter(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm"
              >
                <option value="">所有类型</option>
                <option value="image">图片</option>
                <option value="audio">音频</option>
                <option value="video">视频</option>
              </select>
              
              <select 
                value={materialCategoryFilter}
                onChange={(e) => setMaterialCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm"
              >
                <option value="">所有分类</option>
                <option value="background">背景</option>
                <option value="character">角色</option>
                <option value="prop">道具</option>
                <option value="music">音乐</option>
                <option value="sound">音效</option>
                <option value="other">其他</option>
              </select>
              
              <select 
                value={materialSort}
                onChange={(e) => setMaterialSort(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm"
              >
                <option value="uploaded_desc">上传时间 ↓</option>
                <option value="uploaded_asc">上传时间 ↑</option>
                <option value="name_asc">名称 A-Z</option>
                <option value="name_desc">名称 Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* 素材列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredMaterials.map((material) => (
            <div 
              key={material.id}
              className={`bg-white rounded-xl shadow-card cursor-pointer ${styles.materialCardHover}`}
              onClick={() => openPreviewModal(material)}
            >
              <div className={`relative ${styles.materialPreview}`}>
                {renderMaterialContent(material)}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    material.type === 'image' ? 'bg-primary/10 text-primary' :
                    material.type === 'audio' ? 'bg-secondary/10 text-secondary' :
                    'bg-tertiary/10 text-tertiary'
                  }`}>
                    {material.type === 'image' ? '图片' : 
                     material.type === 'audio' ? '音频' : '视频'}
                  </span>
                </div>
                <div className={styles.materialOverlay}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{material.category}</span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreviewModal(material);
                        }}
                        className="text-white hover:text-gray-300"
                      >
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(material.id);
                        }}
                        className="text-white hover:text-gray-300"
                      >
                        <i className="fas fa-copy text-xs"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(material.id);
                        }}
                        className="text-white hover:text-gray-300"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">{material.name}</h3>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span><i className="fas fa-calendar mr-1"></i>{material.uploadDate}</span>
                  <span>
                    <i className={`fas ${material.size ? 'fa-file' : 'fa-clock'} mr-1`}></i>
                    {material.size || material.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-card p-4">
          <div className="text-sm text-text-secondary">
            显示 1-{filteredMaterials.length} 条，共 {filteredMaterials.length} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:border-primary hover:text-primary">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:border-primary hover:text-primary">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>

      {/* 上传素材弹窗 */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={closeUploadModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">上传素材</h3>
                  <button onClick={closeUploadModal} className="text-text-secondary hover:text-text-primary">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="material-name" className="block text-sm font-medium text-text-primary mb-2">素材名称</label>
                    <input 
                      type="text" 
                      id="material-name" 
                      name="material-name" 
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      placeholder="请输入素材名称" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="material-category" className="block text-sm font-medium text-text-primary mb-2">素材分类</label>
                    <select 
                      id="material-category" 
                      name="material-category" 
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      required
                    >
                      <option value="">请选择分类</option>
                      <option value="background">背景</option>
                      <option value="character">角色</option>
                      <option value="prop">道具</option>
                      <option value="music">音乐</option>
                      <option value="sound">音效</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">选择文件</label>
                    <div 
                      className="border-2 border-dashed border-border-light rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('material-file')?.click()}
                    >
                      <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                      <p className="text-text-secondary mb-2">点击或拖拽文件到此处上传</p>
                      <p className="text-xs text-text-secondary">支持图片、音频、视频格式，单个文件最大100MB</p>
                      <input 
                        type="file" 
                        id="material-file" 
                        name="material-file" 
                        className="hidden" 
                        accept="image/*,audio/*,video/*" 
                        required
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={closeUploadModal}
                      className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      上传
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 素材预览弹窗 */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={closePreviewModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">{selectedMaterial?.name || '素材预览'}</h3>
                  <button onClick={closePreviewModal} className="text-text-secondary hover:text-text-primary">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="text-center">
                  {renderPreviewContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={closeDeleteModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-trash text-danger text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
                  <p className="text-text-secondary mb-6">确定要删除这个素材吗？删除后无法恢复。</p>
                  
                  <div className="flex items-center justify-center space-x-3">
                    <button 
                      onClick={closeDeleteModal}
                      className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleDeleteMaterial}
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
    </div>
  );
};

export default MaterialLibrary;

