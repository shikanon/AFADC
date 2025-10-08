

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  username: string;
  password: string;
  login: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 表单数据状态
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false
  });

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: '',
    password: '',
    login: ''
  });

  // UI状态
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '登录 - AI漫剧快造';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 页面加载时检查记住的用户
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedUser = localStorage.getItem('rememberedUser');
      if (rememberedUser) {
        setFormData(prev => ({
          ...prev,
          username: rememberedUser,
          rememberMe: true
        }));
      }
    }
  }, []);

  // 邮箱格式验证
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 表单验证
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { username: '', password: '', login: '' };

    // 验证用户名/邮箱
    const username = formData.username.trim();
    if (!username) {
      newErrors.username = '请输入用户名或邮箱';
      isValid = false;
    } else if (username.includes('@') && !isValidEmail(username)) {
      newErrors.username = '请输入有效的邮箱地址';
      isValid = false;
    }

    // 验证密码
    const password = formData.password.trim();
    if (!password) {
      newErrors.password = '请输入密码';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少6位';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 清除相关错误信息
    if (name === 'username' || name === 'password') {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
        login: ''
      }));
    }
  };

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormErrors(prev => ({ ...prev, login: '' }));
    setShowLoginSuccess(false);

    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟登录成功（在实际应用中，这里会进行真实的API调用）
      const { username, password, rememberMe } = formData;
      
      if (username.trim() && password.trim()) {
        setShowLoginSuccess(true);
        
        // 记住密码功能
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem('rememberedUser', username.trim());
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('rememberedUser');
        }
        
        // 2秒后跳转到项目管理页
        setTimeout(() => {
          navigate('/project-list');
        }, 2000);
      } else {
        setFormErrors(prev => ({ ...prev, login: '用户名或密码错误，请重试' }));
      }
    } catch (error) {
      setFormErrors(prev => ({ ...prev, login: '登录失败，请稍后重试' }));
    } finally {
      setIsLoading(false);
    }
  };

  // 处理忘记密码表单提交
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = forgotEmail.trim();
    if (!email || !isValidEmail(email)) {
      alert('请输入有效的邮箱地址');
      return;
    }
    
    // 模拟发送重置链接
    alert('重置密码链接已发送到您的邮箱，请查收');
    setShowForgotPasswordModal(false);
    setForgotEmail('');
  };

  // 关闭忘记密码弹窗
  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotEmail('');
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter键触发登录
      if (e.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
        const activeElement = document.activeElement as HTMLInputElement;
        if (activeElement.name === 'username' || activeElement.name === 'password') {
          handleSubmit(e as any);
        }
      }
      
      // ESC键关闭弹窗
      if (e.key === 'Escape' && showForgotPasswordModal) {
        closeForgotPasswordModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showForgotPasswordModal]);

  // 处理输入框焦点效果
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const parentElement = e.target.parentElement;
    if (parentElement) {
      parentElement.classList.add('ring-2', 'ring-primary/20');
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const parentElement = e.target.parentElement;
    if (parentElement) {
      parentElement.classList.remove('ring-2', 'ring-primary/20');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* 登录表单卡片 */}
        <div className="w-full max-w-md">
          {/* Logo和产品名称 */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 ${styles.logoGlow}`}>
              <i className="fas fa-magic text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">AI漫剧快造</h1>
            <p className="text-white/80 text-sm">让AI助力您的漫剧创作梦想</p>
          </div>
          
          {/* 登录表单 */}
          <div className="bg-white rounded-2xl shadow-login p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">欢迎回来</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 用户名/邮箱输入框 */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-text-primary">
                  用户名/邮箱
                </label>
                <div className={styles.inputGroup}>
                  <i className={`fas fa-user ${styles.inputIcon}`}></i>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} ${styles.inputField}`}
                    placeholder="请输入用户名或邮箱"
                    required
                  />
                </div>
                {formErrors.username && (
                  <div className={`${styles.errorMessage} ${styles.show}`}>
                    {formErrors.username}
                  </div>
                )}
              </div>
              
              {/* 密码输入框 */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                  密码
                </label>
                <div className={styles.inputGroup}>
                  <i className={`fas fa-lock ${styles.inputIcon}`}></i>
                  <input 
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} ${styles.inputField}`}
                    placeholder="请输入密码"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    <i className={`fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {formErrors.password && (
                  <div className={`${styles.errorMessage} ${styles.show}`}>
                    {formErrors.password}
                  </div>
                )}
              </div>
              
              {/* 记住密码和忘记密码 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="rememberMe" 
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-text-secondary">记住密码</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  忘记密码？
                </button>
              </div>
              
              {/* 登录按钮 */}
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full bg-primary text-white py-3 px-4 rounded-lg font-medium ${styles.btnPrimaryHover} transition-all duration-200`}
              >
                <span>{isLoading ? '登录中...' : '登录'}</span>
                {isLoading && <i className="fas fa-spinner fa-spin ml-2"></i>}
              </button>
              
              {/* 登录状态消息 */}
              <div className="text-center">
                {formErrors.login && (
                  <div className={`${styles.errorMessage} ${styles.show}`}>
                    {formErrors.login}
                  </div>
                )}
                {showLoginSuccess && (
                  <div className={`${styles.successMessage} ${styles.show}`}>
                    登录成功，正在跳转...
                  </div>
                )}
              </div>
            </form>
            
            {/* 注册链接 */}
            <div className="mt-6 text-center">
              <p className="text-text-secondary text-sm">
                还没有账号？
                <Link 
                  to="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors ml-1"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </div>
          
          {/* 底部版权信息 */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              © 2024 AI漫剧快造. 保留所有权利.
            </p>
          </div>
        </div>
      </div>

      {/* 忘记密码弹窗 */}
      {showForgotPasswordModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeForgotPasswordModal();
            }
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">重置密码</h3>
                  <button 
                    type="button"
                    onClick={closeForgotPasswordModal}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-text-primary mb-2">
                      邮箱地址
                    </label>
                    <input 
                      type="email" 
                      id="forgot-email" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入您的邮箱地址" 
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={closeForgotPasswordModal}
                      className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:border-primary hover:text-primary"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      发送重置链接
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

