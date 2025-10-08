

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '注册 - AI漫剧快造';
    return () => { document.title = originalTitle; };
  }, []);

  const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
  };

  const getPasswordStrengthLevel = (score: number): { text: string; className: string } => {
    if (score <= 2) {
      return { text: '弱', className: 'text-danger' };
    } else if (score <= 4) {
      return { text: '中', className: 'text-warning' };
    } else {
      return { text: '强', className: 'text-success' };
    }
  };

  const getPasswordStrengthBars = (score: number): string[] => {
    const bars = ['bg-border-light', 'bg-border-light', 'bg-border-light'];
    
    if (score <= 2) {
      bars[0] = styles.passwordStrengthWeak;
    } else if (score <= 4) {
      bars[0] = styles.passwordStrengthMedium;
      bars[1] = styles.passwordStrengthMedium;
    } else {
      bars[0] = styles.passwordStrengthStrong;
      bars[1] = styles.passwordStrengthStrong;
      bars[2] = styles.passwordStrengthStrong;
    }
    
    return bars;
  };

  const validateUsername = (username: string): string => {
    if (username.length < 3) {
      return '用户名至少需要3位字符';
    } else if (username.length > 20) {
      return '用户名不能超过20位字符';
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return '用户名只能包含字母、数字、下划线和中文';
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return '请输入邮箱地址';
    } else if (!emailRegex.test(email)) {
      return '请输入有效的邮箱地址';
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return '密码至少需要8位字符';
    }
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) {
      return '请确认密码';
    } else if (password !== confirmPassword) {
      return '两次输入的密码不一致';
    }
    return '';
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Special handling for password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
      // Also validate confirm password if it exists
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(value, formData.confirmPassword);
        setFormErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
    }

    // Validate confirm password when it changes
    if (field === 'confirmPassword') {
      const confirmError = validateConfirmPassword(formData.password, value);
      setFormErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    let error = '';
    
    switch (field) {
      case 'username':
        error = validateUsername(formData.username);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, formData.confirmPassword);
        break;
    }
    
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate registration request
    setTimeout(() => {
      setIsSubmitting(false);
      alert('注册成功！请登录您的账户。');
      navigate('/login');
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextField?: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (nextField) {
        const nextElement = document.getElementById(nextField);
        if (nextElement) {
          nextElement.focus();
        }
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const strengthLevel = getPasswordStrengthLevel(passwordStrength);
  const strengthBars = getPasswordStrengthBars(passwordStrength);

  return (
    <div className={styles.pageWrapper}>
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo和产品名称 */}
          <div className={`text-center mb-8 ${styles.fadeIn}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-magic text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">AI漫剧快造</h1>
            <p className="text-text-secondary">开启您的AI漫剧创作之旅</p>
          </div>

          {/* 注册表单 */}
          <div className={`bg-white rounded-2xl shadow-card p-8 ${styles.fadeIn}`}>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">创建账户</h2>
              <p className="text-text-secondary text-sm">加入我们，开始使用AI创作精彩漫剧</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 用户名 */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-text-primary">
                  用户名
                </label>
                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                    onKeyDown={(e) => handleKeyDown(e, 'email')}
                    className={`w-full pl-10 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入用户名"
                    required
                  />
                </div>
                {formErrors.username && (
                  <div className="text-danger text-sm">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{formErrors.username}</span>
                  </div>
                )}
              </div>

              {/* 邮箱 */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                  邮箱
                </label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    onKeyDown={(e) => handleKeyDown(e, 'password')}
                    className={`w-full pl-10 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入邮箱地址"
                    required
                  />
                </div>
                {formErrors.email && (
                  <div className="text-danger text-sm">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{formErrors.email}</span>
                  </div>
                )}
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                  密码
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    onKeyDown={(e) => handleKeyDown(e, 'confirm-password')}
                    className={`w-full pl-10 pr-12 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {/* 密码强度指示器 */}
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    <div className={`flex-1 h-1 ${strengthBars[0]} rounded`}></div>
                    <div className={`flex-1 h-1 ${strengthBars[1]} rounded`}></div>
                    <div className={`flex-1 h-1 ${strengthBars[2]} rounded`}></div>
                  </div>
                  <div className="text-xs text-text-secondary">
                    密码强度：<span className={strengthLevel.className}>{strengthLevel.text}</span>
                  </div>
                </div>
                {formErrors.password && (
                  <div className="text-danger text-sm">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{formErrors.password}</span>
                  </div>
                )}
              </div>

              {/* 确认密码 */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary">
                  确认密码
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    name="confirm-password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-10 pr-12 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请再次输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleToggleConfirmPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary"
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <div className="text-danger text-sm">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{formErrors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span>创建中...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2"></i>
                    <span>创建账户</span>
                  </>
                )}
              </button>
            </form>

            {/* 登录链接 */}
            <div className="mt-6 text-center">
              <p className="text-text-secondary text-sm">
                已有账户？
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium ml-1">
                  立即登录
                </Link>
              </p>
            </div>
          </div>

          {/* 底部提示 */}
          <div className={`text-center mt-6 ${styles.fadeIn}`}>
            <p className="text-text-secondary text-xs">
              点击"创建账户"即表示您同意我们的
              <a href="#" className="text-primary hover:text-primary/80 mx-1">服务条款</a>
              和
              <a href="#" className="text-primary hover:text-primary/80 mx-1">隐私政策</a>
            </p>
          </div>
        </div>
      </main>

      {/* 加载中遮罩 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-text-primary">正在创建账户...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

