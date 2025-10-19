import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, saveAuthState, RegisterParams } from '../../services/api/auth';
import styles from './styles.module.css';

interface FormData {
  email: string;
  username: string;
  organization: string;
  verifyCode: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  username: string;
  organization: string;
  verifyCode: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    organization: '',
    verifyCode: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    username: '',
    organization: '',
    verifyCode: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '注册 - AI漫剧速成工场';
    return () => { document.title = originalTitle; };
  }, []);

  // 页面加载时聚焦到邮箱输入框
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // 验证码倒计时
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => window.clearTimeout(timer);
  }, [countdown]);

  // 邮箱验证函数
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // 用户名验证函数
  const validateUsername = (value: string): boolean => {
    return value.trim().length >= 3;
  };

  // 组织名称验证函数
  const validateOrganization = (value: string): boolean => {
    return value.trim().length >= 2;
  };

  // 验证码验证函数
  const validateVerifyCode = (value: string): boolean => {
    return value.length >= 4;
  };

  // 密码验证函数
  const validatePassword = (value: string): boolean => {
    return value.length >= 6;
  };

  // 确认密码验证函数
  const validateConfirmPassword = (value: string): boolean => {
    return value === formData.password;
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
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除错误状态
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 处理输入框失去焦点
  const handleInputBlur = (field: keyof FormData) => {
    const value = formData[field];
    
    switch (field) {
      case 'email':
        validateInput(field, value, validateEmail, '请输入有效的邮箱地址');
        break;
      case 'username':
        validateInput(field, value, validateUsername, '用户名至少需要3个字符');
        break;
      case 'organization':
        validateInput(field, value, validateOrganization, '组织名称至少需要2个字符');
        break;
      case 'verifyCode':
        validateInput(field, value, validateVerifyCode, '验证码至少需要4个字符');
        break;
      case 'password':
        validateInput(field, value, validatePassword, '密码至少需要6个字符');
        // 如果确认密码已经输入，需要重新验证
        if (formData.confirmPassword) {
          validateInput(
            'confirmPassword',
            formData.confirmPassword,
            validateConfirmPassword,
            '两次输入的密码不一致'
          );
        }
        break;
      case 'confirmPassword':
        validateInput(field, value, validateConfirmPassword, '两次输入的密码不一致');
        break;
    }
  };

  // 切换密码显示/隐藏
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 切换确认密码显示/隐藏
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // 获取验证码
  const handleGetVerifyCode = () => {
    // 先验证邮箱
    if (!validateInput('email', formData.email, validateEmail, '请输入有效的邮箱地址')) {
      return;
    }

    // 开始倒计时
    setCountdown(60);
    
    // 模拟发送验证码
    console.log('发送验证码到邮箱:', formData.email);
  };

  // 处理表单提交
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证所有字段
    const isEmailValid = validateInput('email', formData.email, validateEmail, '请输入有效的邮箱地址');
    const isOrganizationValid = validateInput('organization', formData.organization, validateOrganization, '组织名称至少需要2个字符');
    const isPasswordValid = validateInput('password', formData.password, validatePassword, '密码至少需要6个字符');
    const isConfirmPasswordValid = validateInput('confirmPassword', formData.confirmPassword, validateConfirmPassword, '两次输入的密码不一致');

    // 注意：根据API要求，我们不需要用户名和验证码字段
    if (isEmailValid && isOrganizationValid && isPasswordValid && isConfirmPasswordValid) {
      // 显示加载状态
      setIsLoading(true);

      try {
        // 构建注册参数
        const registerParams: RegisterParams = {
          email: formData.email,
          password: formData.password,
          organization_name: formData.organization,
          // 使用username作为display_name，如果有输入的话
          display_name: formData.username || formData.email.split('@')[0]
        };

        // 调用注册接口
        const response = await register(registerParams);

        // 保存登录状态
        saveAuthState(response.token, response.user);

        // 注册成功后跳转到主页或其他页面
        navigate('/');
      } catch (error) {
        console.error('注册失败:', error);
        // 错误处理已经在API客户端中完成
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const activeElement = document.activeElement as HTMLElement;
      const form = document.querySelector('form');
      const inputs = form?.querySelectorAll('input') || [];
      const inputArray = Array.from(inputs) as HTMLInputElement[];
      
      const currentIndex = inputArray.findIndex(input => input === activeElement);
      if (currentIndex >= 0 && currentIndex < inputArray.length - 1) {
        inputArray[currentIndex + 1].focus();
      } else {
        handleFormSubmit(e as any);
      }
    }
  };

  return (
    <div className={styles.pageWrapper} onKeyDown={handleKeyDown}>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        {/* 注册卡片 */}
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
          
          {/* 注册表单 */}
          <div className="p-8">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* 用户名输入 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="username" className={`w-28 text-sm font-medium text-text-primary ${styles.inputLabel}`}>
                    用户名
                  </label>
                  <div className="flex-1">
                    <div className={styles.inputGroup}>
                      
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        onBlur={() => handleInputBlur('username')}
                        className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${formErrors.username ? 'border-danger' : 'border-border-light'}`}
                        placeholder="请输入用户名"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className={`${styles.errorMessage} ${formErrors.username ? styles.show : ''}`}>
                  {formErrors.username}
                </div>
              </div>
              
              {/* 组织名称输入 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="organization" className={`w-28 text-sm font-medium text-text-primary ${styles.inputLabel}`}>
                    组织名称
                  </label>
                  <div className="flex-1">
                    <div className={styles.inputGroup}>
                    
                      <input
                        type="text"
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        onBlur={() => handleInputBlur('organization')}
                        className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${formErrors.organization ? 'border-danger' : 'border-border-light'}`}
                        placeholder="请输入组织名称"
                        required
                      />
                    </div>
                    <div className={styles.hintText}>组织名需唯一</div>
                  </div>
                </div>
                <div className={`${styles.errorMessage} ${formErrors.organization ? styles.show : ''}`}>
                  {formErrors.organization}
                </div>
              </div>

              {/* 邮箱输入 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="email" className={`w-28 text-sm font-medium text-text-primary ${styles.inputLabel}`}>
                    注册邮箱
                  </label>
                  <div className="flex-1">
                    <div className={styles.inputGroup}>
                       
                      <input
                        type="email"
                        id="email"
                        ref={emailInputRef}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleInputBlur('email')}
                        className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${formErrors.email ? 'border-danger' : 'border-border-light'}`}
                        placeholder="请输入邮箱地址"
                        required
                      />
                    </div>
                    <div className={styles.hintText}>邮箱需唯一</div>
                  </div>
                </div>
                <div className={`${styles.errorMessage} ${formErrors.email ? styles.show : ''}`}>
                  {formErrors.email}
                </div>
              </div>

              {/* 验证码输入 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="verifyCode" className={`w-28 text-sm font-medium text-text-primary ${styles.inputLabel}`}>
                    验证码
                  </label>
                  <div className="flex-1 flex space-x-3">
                    <div className={`${styles.inputGroup} flex-1`}>
                      
                      <input
                        type="text"
                        id="verifyCode"
                        value={formData.verifyCode}
                        onChange={(e) => handleInputChange('verifyCode', e.target.value)}
                        onBlur={() => handleInputBlur('verifyCode')}
                        className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${formErrors.verifyCode ? 'border-danger' : 'border-border-light'}`}
                        placeholder="请输入验证码"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGetVerifyCode}
                      disabled={countdown > 0 || !formData.email}
                      className={styles.verifyCodeBtn}
                    >
                      {countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码'}
                    </button>
                  </div>
                </div>
                <div className={`${styles.errorMessage} ${formErrors.verifyCode ? styles.show : ''}`}>
                  {formErrors.verifyCode}
                </div>
              </div>
              
              {/* 密码输入 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="password" className={`w-28 text-sm font-medium text-text-primary ${styles.inputLabel}`}>
                    密码
                  </label>
                  <div className="flex-1">
                    <div className={styles.inputGroup}>
                      
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={() => handleInputBlur('password')}
                        className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${formErrors.password ? 'border-danger' : 'border-border-light'}`}
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
                  </div>
                </div>
                <div className={`${styles.errorMessage} ${formErrors.password ? styles.show : ''}`}>
                  {formErrors.password}
                </div>
              </div>
              
              {/* 确认密码输入 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="confirmPassword" className={`w-28 text-sm font-medium text-text-primary ${styles.inputLabel}`}>
                    确认密码
                  </label>
                  <div className="flex-1">
                    <div className={styles.inputGroup}>
                      
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        onBlur={() => handleInputBlur('confirmPassword')}
                        className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${styles.inputField} transition-all duration-200 ${formErrors.confirmPassword ? 'border-danger' : 'border-border-light'}`}
                        placeholder="请再次输入密码"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`${styles.errorMessage} ${formErrors.confirmPassword ? styles.show : ''}`}>
                  {formErrors.confirmPassword}
                </div>
              </div>
              
              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-primary text-white rounded-lg font-medium ${styles.btnPrimaryHover} transition-all duration-200 mt-6`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>注册中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2"></i>注册
                  </>
                )}
              </button>
              
              {/* 登录链接 */}
              <div className="text-center">
                <span className="text-text-secondary text-sm">已有账号？</span>
                <Link
                  to="/login"
                  className="text-sm text-primary hover:text-blue-600 font-medium transition-colors ml-1"
                >
                  去登录
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