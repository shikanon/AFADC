import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, isAuthenticated, getUserInfoFromStorage, saveAuthState, logout as logoutApi } from '../services/api';

// 用户状态接口
interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

// 操作类型
type UserAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'CLEAR_ERROR' };

// Context接口
interface UserContextType extends UserState {
  login: (token: string, user: User) => void;
  logout: () => void;
  clearError: () => void;
}

// 初始状态
const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,
};

// 创建Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Reducer函数
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: !!action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider组件
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // 初始化时检查本地存储的登录状态
  useEffect(() => {
    const initializeAuth = () => {
      if (isAuthenticated()) {
        const userInfo = getUserInfoFromStorage();
        if (userInfo) {
          dispatch({ type: 'SET_USER', payload: userInfo });
        } else {
          // Token存在但用户信息不存在，清除token并设置未登录
          logoutApi();
          dispatch({ type: 'SET_USER', payload: null });
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    initializeAuth();
  }, []);

  // 登录方法
  const login = (token: string, user: User) => {
    // 保存到本地存储
    saveAuthState(token, user);
    // 更新状态
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };

  // 登出方法
  const logout = () => {
    // 清除本地存储
    logoutApi();
    // 更新状态
    dispatch({ type: 'LOGOUT' });
  };

  // 清除错误
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: UserContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 自定义Hook，用于在组件中使用UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};