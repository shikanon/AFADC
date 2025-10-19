import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_login from '../pages/p-login';
import P_project_manage from '../pages/p-project_manage';
import P_asset_manage from '../pages/p-asset_manage';
import P_asset_generate from '../pages/p-asset_generate';
import P_user_manage from '../pages/p-user_manage';
import P_plan_manage from '../pages/p-plan_manage';
import P_api_key_setting from '../pages/p-api_key_setting';
import P_static_create_step1 from '../pages/p-static_create_step1';
import P_static_create_step2 from '../pages/p-static_create_step2';
import P_static_create_step3 from '../pages/p-static_create_step3';
import P_static_create_step4 from '../pages/p-static_create_step4';
import P_dynamic_create_step1 from '../pages/p-dynamic_create_step1';
import P_dynamic_create_step2 from '../pages/p-dynamic_create_step2';
import P_dynamic_create_step3 from '../pages/p-dynamic_create_step3';
import P_dynamic_create_step4 from '../pages/p-dynamic_create_step4';
import P_dynamic_create_step5 from '../pages/p-dynamic_create_step5';
import P_image_edit_dialog from '../pages/p-image_edit_dialog';
import P_video_edit_dialog from '../pages/p-video_edit_dialog';
import P_asset_select_dialog from '../pages/p-asset_select_dialog';
import P_confirm_dialog from '../pages/p-confirm_dialog';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: location.pathname,
        search: location.search,
      }, '*');
    }
  }, [location]);

  return <Outlet />;
}

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
    path: '/',
    element: <Navigate to='/login' replace={true} />,
  },
      {
    path: '/login',
    element: (
      <ErrorBoundary>
        <P_login />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/project-manage',
    element: (
      <ErrorBoundary>
        <P_project_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/asset-manage',
    element: (
      <ErrorBoundary>
        <P_asset_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/asset-generate',
    element: (
      <ErrorBoundary>
        <P_asset_generate />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/user-manage',
    element: (
      <ErrorBoundary>
        <P_user_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/plan-manage',
    element: (
      <ErrorBoundary>
        <P_plan_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/api-key-setting',
    element: (
      <ErrorBoundary>
        <P_api_key_setting />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/static-create-step1',
    element: (
      <ErrorBoundary>
        <P_static_create_step1 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/static-create-step2',
    element: (
      <ErrorBoundary>
        <P_static_create_step2 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/static-create-step3',
    element: (
      <ErrorBoundary>
        <P_static_create_step3 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/static-create-step4',
    element: (
      <ErrorBoundary>
        <P_static_create_step4 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/dynamic-create-step1',
    element: (
      <ErrorBoundary>
        <P_dynamic_create_step1 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/dynamic-create-step2',
    element: (
      <ErrorBoundary>
        <P_dynamic_create_step2 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/dynamic-create-step3',
    element: (
      <ErrorBoundary>
        <P_dynamic_create_step3 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/dynamic-create-step4',
    element: (
      <ErrorBoundary>
        <P_dynamic_create_step4 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/dynamic-create-step5',
    element: (
      <ErrorBoundary>
        <P_dynamic_create_step5 />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/image-edit-dialog',
    element: (
      <ErrorBoundary>
        <P_image_edit_dialog />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/video-edit-dialog',
    element: (
      <ErrorBoundary>
        <P_video_edit_dialog />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/asset-select-dialog',
    element: (
      <ErrorBoundary>
        <P_asset_select_dialog />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/confirm-dialog',
    element: (
      <ErrorBoundary>
        <P_confirm_dialog />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '*',
    element: <NotFoundPage />,
  },
    ]
  }
]);

export default router;