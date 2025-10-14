

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '登录 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 页面加载时聚焦到用户名输入框
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  // 用户名验证函数
  const validateUsername = (value: string): boolean => {
    return value.trim().length >= 3;
  };

  // 密码验证函数
  const validatePassword = (value: string): boolean => {
    return value.length >= 6;
  };

  // 输入验证函数
  const validateInput = (
    field: keyof FormData,
    value: string,
    validator: (value: string) => boolean,
    errorMessage: string
  ): boolean => {
    const isValid = validator(value);
    setFormErrors(prev => ({
      ...prev,
      [field]: isValid ? '' : errorMessage
    }));
    return isValid;
  };

  // 处理输入变化
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除错误状态
    if (typeof value === 'string' && formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 处理输入框失去焦点
  const handleInputBlur = (field: keyof FormData) => {
    const value = formData[field] as string;
    if (field === 'username') {
      validateInput(field, value, validateUsername, '用户名至少需要3个字符');
    } else if (field === 'password') {
      validateInput(field, value, validatePassword, '密码至少需要6个字符');
    }
  };

  // 切换密码显示/隐藏
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 处理表单提交
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证所有字段
    const isUsernameValid = validateInput('username', formData.username, validateUsername, '用户名至少需要3个字符');
    const isPasswordValid = validateInput('password', formData.password, validatePassword, '密码至少需要6个字符');

    if (isUsernameValid && isPasswordValid) {
      // 显示加载状态
      setIsLoading(true);

      // 模拟登录请求
      setTimeout(() => {
        // 登录成功，跳转到项目管理页
        navigate('/project-manage');
      }, 1500);
    }
  };

  // 处理忘记密码
  const handleForgotPassword = () => {
    alert('忘记密码功能暂未开放，请联系管理员重置密码。');
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target !== document.querySelector('button')) {
      const activeElement = document.activeElement;
      if (activeElement === usernameInputRef.current) {
        const passwordInput = document.querySelector('#password') as HTMLInputElement;
        if (passwordInput) {
          passwordInput.focus();
        }
      } else if (activeElement?.id === 'password') {
        handleFormSubmit(e as any);
      }
    }
  };

  return (
    <div className={styles.pageWrapper} onKeyDown={handleKeyDown}>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        {/* 登录卡片 */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-login-card overflow-hidden">
          {/* 卡片头部 */}
          <div className="p-8 text-center border-b border-border-light">
            <div className={`${styles.logoAnimation} mb-4`}>
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                <i className="fas fa-magic text-white text-2xl"></i>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">AI漫剧速成工场</h1>
            <p className="text-text-secondary text-sm">专业的企业级AI漫剧制作平台</p>
          </div>
          
          {/* 登录表单 */}
          <div className="p-8">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* 用户名输入 */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-text-primary">
                  用户名
                </label>
                <div className={styles.inputGroup}>
                  <i className={`fas fa-user ${styles.inputIcon}`}></i>
                  <input
                    type="text"
                    id="username"
                    ref={usernameInputRef}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onBlur={() => handleInputBlur('username')}
                    className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${
                      formErrors.username ? 'border-danger' : 'border-border-light'
                    }`}
                    placeholder="请输入用户名"
                    required
                  />
                </div>
                <div className={`${styles.errorMessage} ${formErrors.username ? styles.show : ''}`}>
                  {formErrors.username}
                </div>
              </div>
              
              {/* 密码输入 */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                  密码
                </label>
                <div className={styles.inputGroup}>
                  <i className={`fas fa-lock ${styles.inputIcon}`}></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleInputBlur('password')}
                    className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${
                      formErrors.password ? 'border-danger' : 'border-border-light'
                    }`}
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                <div className={`${styles.errorMessage} ${formErrors.password ? styles.show : ''}`}>
                  {formErrors.password}
                </div>
              </div>
              
              {/* 记住密码和忘记密码 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="rounded border-border-medium focus:ring-primary"
                  />
                  <span className="text-sm text-text-secondary">记住密码</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-blue-600 transition-colors"
                >
                  忘记密码？
                </button>
              </div>
              
              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-primary text-white rounded-lg font-medium ${styles.btnPrimaryHover} transition-all duration-200`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>登录中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>登录
                  </>
                )}
              </button>
              
              {/* 注册链接 */}
              <div className="text-center">
                <span className="text-text-secondary text-sm">还没有账号？</span>
                <Link
                  to="/register"
                  className="text-sm text-primary hover:text-blue-600 font-medium transition-colors ml-1"
                >
                  立即注册
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        {/* 装饰元素 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-15 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-lg"></div>
      </div>
    </div>
  );
}

