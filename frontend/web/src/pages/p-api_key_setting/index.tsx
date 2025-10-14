

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import { SearchToolbar, ConfirmDialog } from '../../components/Common';
import styles from './styles.module.css';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  createdAt: string;
}

const ApiKeySettingPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showApiKeyEditModal, setShowApiKeyEditModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [currentEditingKeyId, setCurrentEditingKeyId] = useState<string | null>(null);
  const [currentDeletingKeyId, setCurrentDeletingKeyId] = useState<string | null>(null);
  const [apiKeySearchTerm, setApiKeySearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(20);
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'OpenAI API密钥',
      provider: 'OpenAI',
      key: 'sk-****************************abcd',
      createdAt: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'Midjourney API密钥',
      provider: 'Midjourney',
      key: 'mj-****************************wxyz',
      createdAt: '2024-01-14 09:15'
    },
    {
      id: '3',
      name: 'Stable Diffusion API密钥',
      provider: 'Stable Diffusion',
      key: 'sd-****************************efgh',
      createdAt: '2024-01-13 16:45'
    },
    {
      id: '4',
      name: 'ElevenLabs语音合成密钥',
      provider: 'ElevenLabs',
      key: 'el-****************************ijkl',
      createdAt: '2024-01-12 11:20'
    },
    {
      id: '5',
      name: 'Azure OpenAI密钥',
      provider: 'Azure OpenAI',
      key: 'az-****************************mnop',
      createdAt: '2024-01-11 13:50'
    }
  ]);

  const [formData, setFormData] = useState({
    keyName: '',
    keyProvider: '',
    keyValue: ''
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'API密钥设置 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddApiKey = () => {
    setCurrentEditingKeyId(null);
    setFormData({ keyName: '', keyProvider: '', keyValue: '' });
    setShowApiKeyEditModal(true);
  };

  const handleEditApiKey = (keyId: string) => {
    setCurrentEditingKeyId(keyId);
    const keyToEdit = apiKeys.find(key => key.id === keyId);
    if (keyToEdit) {
      setFormData({
        keyName: keyToEdit.name,
        keyProvider: keyToEdit.provider,
        keyValue: keyToEdit.key
      });
    }
    setShowApiKeyEditModal(true);
  };

  const handleDeleteApiKey = (keyId: string) => {
    setCurrentDeletingKeyId(keyId);
    setShowConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (currentDeletingKeyId) {
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== currentDeletingKeyId));
    }
    setShowConfirmDeleteModal(false);
    setCurrentDeletingKeyId(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentEditingKeyId) {
      // Edit mode
      setApiKeys(prevKeys => prevKeys.map(key => 
        key.id === currentEditingKeyId 
          ? { ...key, ...formData }
          : key
      ));
    } else {
      // Add mode
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: formData.keyName,
        provider: formData.keyProvider,
        key: formData.keyValue,
        createdAt: new Date().toLocaleString()
      };
      setApiKeys(prevKeys => [...prevKeys, newKey]);
    }
    
    setShowApiKeyEditModal(false);
    setCurrentEditingKeyId(null);
    setFormData({ keyName: '', keyProvider: '', keyValue: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredApiKeys = apiKeys.filter(key => 
    key.name.toLowerCase().includes(apiKeySearchTerm.toLowerCase()) ||
    key.provider.toLowerCase().includes(apiKeySearchTerm.toLowerCase())
  );

  const getProviderBadgeClass = (provider: string) => {
    const providerSlug = provider.toLowerCase().replace(/\s+/g, '-');
    return `${styles.providerBadge} ${styles[`provider${providerSlug.charAt(0).toUpperCase() + providerSlug.slice(1)}`] || styles.providerOpenai}`;
  };

  const handleModalBackdropClick = (e: React.MouseEvent, closeModal: () => void) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用Header组件 */}
      <Header 
        isSidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleSidebarToggle}
        searchPlaceholder="搜索项目、资产..."
      />

      {/* 左侧菜单 - 使用Sidebar组件 */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        currentPath="/api-key-setting"
      />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            breadcrumbs={[
              { label: '首页', path: '/' },
              { label: 'API密钥设置', path: '/api-key-setting' }
            ]}
            title="API密钥设置"
            actions={
              <button 
                onClick={handleAddApiKey}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>新增密钥</span>
              </button>
            }
          />

          {/* 工具栏 - 使用SearchToolbar组件 */}
          <SearchToolbar 
            searchValue={apiKeySearchTerm}
            onSearchChange={setApiKeySearchTerm}
            searchPlaceholder="搜索密钥名称、提供商..."
          />

          {/* API密钥列表 */}
          <div className="bg-white rounded-lg border border-border-light overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">密钥名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">提供商</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">密钥</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">创建时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApiKeys.map((apiKey) => (
                    <tr key={apiKey.id} className={`border-t border-border-light ${styles.tableRowHover}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-text-primary">{apiKey.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={getProviderBadgeClass(apiKey.provider)}>{apiKey.provider}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`${styles.keyMasked} text-text-secondary`}>{apiKey.key}</div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{apiKey.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditApiKey(apiKey.id)}
                            className="text-primary hover:text-blue-600 text-sm" 
                            title="编辑"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteApiKey(apiKey.id)}
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
              共 <span className="font-medium text-text-primary">{apiKeys.length}</span> 个API密钥，每页显示
              <select 
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="mx-2 border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select> 个
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors disabled:opacity-50" disabled>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">2</button>
              <span className="px-2 text-text-secondary">...</span>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">5</button>
              <button className="px-3 py-1 border border-border-light rounded text-sm hover:bg-bg-secondary transition-colors">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* API密钥编辑弹窗 */}
      {showApiKeyEditModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={(e) => handleModalBackdropClick(e, () => setShowApiKeyEditModal(false))}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {currentEditingKeyId ? '编辑API密钥' : '新增API密钥'}
                  </h3>
                  <button 
                    onClick={() => setShowApiKeyEditModal(false)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="keyName" className="block text-sm font-medium text-text-primary mb-2">密钥名称</label>
                    <input 
                      type="text" 
                      id="keyName" 
                      name="keyName" 
                      value={formData.keyName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="请输入密钥名称" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="keyProvider" className="block text-sm font-medium text-text-primary mb-2">提供商</label>
                    <select 
                      id="keyProvider" 
                      name="keyProvider" 
                      value={formData.keyProvider}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      required
                    >
                      <option value="">请选择提供商</option>
                      <option value="OpenAI">OpenAI</option>
                      <option value="Midjourney">Midjourney</option>
                      <option value="Stable Diffusion">Stable Diffusion</option>
                      <option value="ElevenLabs">ElevenLabs</option>
                      <option value="Azure OpenAI">Azure OpenAI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="keyValue" className="block text-sm font-medium text-text-primary mb-2">API密钥</label>
                    <input 
                      type="text" 
                      id="keyValue" 
                      name="keyValue" 
                      value={formData.keyValue}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="请输入API密钥" 
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowApiKeyEditModal(false)}
                      className="px-4 py-2 border border-border-medium text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 确认删除弹窗 - 使用ConfirmDialog组件 */}
      <ConfirmDialog 
        isVisible={showConfirmDeleteModal}
        title="确认删除"
        message="确定要删除这个API密钥吗？删除后将无法恢复。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDeleteModal(false)}
        type="danger"
      />
    </div>
  );
};

export default ApiKeySettingPage;

