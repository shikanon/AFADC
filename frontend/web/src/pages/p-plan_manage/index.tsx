

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Sidebar, PageHeader } from '../../components/Layout';
import styles from './styles.module.css';

const PlanManagePage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '套餐管理 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSubscribe = (planId: string) => {
    console.log('需要调用第三方支付接口实现订阅功能');
    // 注释：此功能需要集成第三方支付系统，在原型阶段仅做UI展示
    // window.open(`https://payment-gateway.com/subscribe?plan=${planId}`, '_blank');
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 1024 && !isSidebarCollapsed) {
        // 小屏幕自动折叠侧边栏
        setIsSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化检查
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用Header组件 */}
      <Header 
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleSidebarToggle}
        searchPlaceholder="搜索项目、资产..."
      />

      {/* 左侧菜单 - 使用Sidebar组件 */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        currentPath="/plan-manage"
      />

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 - 使用PageHeader组件 */}
          <PageHeader 
            breadcrumbs={[
              { label: '首页', path: '/' },
              { label: '套餐管理', path: '/plan-manage' }
            ]}
            title="套餐管理"
            description="选择适合您的套餐，开启AI漫剧创作之旅"
          />

          {/* 套餐列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 基础版套餐 */}
            <div className={`${styles.planCard} bg-white rounded-lg border border-border-light p-6 relative`}>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">基础版</h3>
                <div className="mb-4">
                  <span className={styles.priceHighlight}>¥99</span>
                  <span className="text-text-secondary">/月</span>
                </div>
                <p className="text-text-secondary text-sm mb-6">适合个人创作者入门使用</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">静态漫制作</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">每月5个项目</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">基础AI生图</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">100个资产存储</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">标准分辨率输出</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-times text-sm text-text-secondary"></i>
                  <span className="text-sm text-text-secondary">动态漫制作</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-times text-sm text-text-secondary"></i>
                  <span className="text-sm text-text-secondary">团队协作</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSubscribe('basic')}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                立即订阅
              </button>
            </div>

            {/* 专业版套餐 */}
            <div className={`${styles.planCard} bg-white rounded-lg border border-border-light p-6 relative`}>
              <div className={styles.popularBadge}>
                <i className="fas fa-crown mr-1"></i>最受欢迎
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">专业版</h3>
                <div className="mb-4">
                  <span className={styles.priceHighlight}>¥299</span>
                  <span className="text-text-secondary">/月</span>
                </div>
                <p className="text-text-secondary text-sm mb-6">适合专业创作者和小型团队</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">静态漫制作</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">动态漫制作</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">每月20个项目</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">高级AI生图</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">500个资产存储</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">高清分辨率输出</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">最多5人团队协作</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSubscribe('pro')}
                className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                立即订阅
              </button>
            </div>

            {/* 企业版套餐 */}
            <div className={`${styles.planCard} bg-white rounded-lg border border-border-light p-6 relative`}>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">企业版</h3>
                <div className="mb-4">
                  <span className={styles.priceHighlight}>¥999</span>
                  <span className="text-text-secondary">/月</span>
                </div>
                <p className="text-text-secondary text-sm mb-6">适合企业级大规模生产需求</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">静态漫制作</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">动态漫制作</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">无限项目数量</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">顶级AI生图</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">无限资产存储</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">4K超高清输出</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">无限团队协作</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">优先技术支持</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check text-sm"></i>
                  <span className="text-sm text-text-primary">API调用权限</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSubscribe('enterprise')}
                className="w-full py-3 bg-tertiary text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                立即订阅
              </button>
            </div>
          </div>

          {/* 套餐对比表格 */}
          <div className="mt-12 bg-white rounded-lg border border-border-light overflow-hidden">
            <h3 className="text-lg font-semibold text-text-primary p-6 border-b border-border-light">套餐功能对比</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">功能特性</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-text-secondary">基础版</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-text-secondary">专业版</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-text-secondary">企业版</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">静态漫制作</td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-check text-success"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-check text-success"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-check text-success"></i>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">动态漫制作</td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-times text-text-secondary"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-check text-success"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-check text-success"></i>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">每月项目数量</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">5个</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">20个</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">无限</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">AI生图质量</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">基础</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">高级</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">顶级</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">资产存储数量</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">100个</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">500个</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">无限</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">视频分辨率</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">720P</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">1080P</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">4K</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">团队协作人数</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">1人</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">5人</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">无限</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">技术支持</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">标准</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">优先</td>
                    <td className="px-6 py-4 text-center text-sm text-text-primary">专属</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-text-primary">API调用权限</td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-times text-text-secondary"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-times text-text-secondary"></i>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <i className="fas fa-check text-success"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanManagePage;

