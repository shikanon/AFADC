import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_login from '../pages/p-login';
import P_register from '../pages/p-register';
import P_workspace_list from '../pages/p-workspace_list';
import P_project_list from '../pages/p-project_list';
import P_script_info from '../pages/p-script_info';
import P_character_generation from '../pages/p-character_generation';
import P_voice_selection from '../pages/p-voice_selection';
import P_scenario_editor from '../pages/p-scenario_editor';
import P_image_generation from '../pages/p-image_generation';
import P_video_generation from '../pages/p-video_generation';
import P_video_export from '../pages/p-video_export';
import P_material_library from '../pages/p-material_library';
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
    path: '/register',
    element: (
      <ErrorBoundary>
        <P_register />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/workspace-list',
    element: (
      <ErrorBoundary>
        <P_workspace_list />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/project-list',
    element: (
      <ErrorBoundary>
        <P_project_list />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/script-info',
    element: (
      <ErrorBoundary>
        <P_script_info />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/character-generation',
    element: (
      <ErrorBoundary>
        <P_character_generation />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/voice-selection',
    element: (
      <ErrorBoundary>
        <P_voice_selection />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/scenario-editor',
    element: (
      <ErrorBoundary>
        <P_scenario_editor />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/image-generation',
    element: (
      <ErrorBoundary>
        <P_image_generation />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/video-generation',
    element: (
      <ErrorBoundary>
        <P_video_generation />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/video-export',
    element: (
      <ErrorBoundary>
        <P_video_export />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/material-library',
    element: (
      <ErrorBoundary>
        <P_material_library />
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